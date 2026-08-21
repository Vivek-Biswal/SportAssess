from pathlib import Path

import cv2

from app.analysis.geometry import find_landmark
from app.assessments.football_juggling import (
    FootballBallTracker,
)
from app.assessments.juggling_analyzer import (
    JugglingAnalyzer,
)
from app.pose.detector import PoseDetector
from app.pose.landmarks import LandmarkExtractor


class FootballJugglingVideoRunner:

    def __init__(
        self,
        video_path: str,
        output_path: str = (
            "output/football_juggling_assessment.avi"
        ),
    ) -> None:

        self.video_path = Path(
            video_path
        )

        self.output_path = Path(
            output_path
        )

    def run(self) -> dict:

        if not self.video_path.exists():
            raise FileNotFoundError(
                f"Video not found: "
                f"{self.video_path}"
            )

        video = cv2.VideoCapture(
            str(self.video_path)
        )

        if not video.isOpened():
            raise RuntimeError(
                f"Could not open video: "
                f"{self.video_path}"
            )

        fps = video.get(
            cv2.CAP_PROP_FPS
        )

        if fps <= 0:
            fps = 30.0

        width = int(
            video.get(
                cv2.CAP_PROP_FRAME_WIDTH
            )
        )

        height = int(
            video.get(
                cv2.CAP_PROP_FRAME_HEIGHT
            )
        )

        total_frames = int(
            video.get(
                cv2.CAP_PROP_FRAME_COUNT
            )
        )

        self.output_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        writer = cv2.VideoWriter(
            str(self.output_path),
            cv2.VideoWriter_fourcc(
                *"MJPG"
            ),
            fps,
            (width, height),
        )

        if not writer.isOpened():
            video.release()

            raise RuntimeError(
                "Could not create output video."
            )

        detector = PoseDetector()

        extractor = LandmarkExtractor()

        ball_tracker = (
            FootballBallTracker()
        )

        juggling = (
            JugglingAnalyzer()
        )

        frame_number = 0

        detected_ball_frames = 0

        last_touch = None

        touch_message_frames = 0

        print(
            "Starting football juggling analysis..."
        )

        print(
            f"Input  : {self.video_path}"
        )

        print(
            f"Output : {self.output_path}"
        )

        print(
            f"Frames : {total_frames}"
        )

        print()

        try:

            while True:

                success, frame = (
                    video.read()
                )

                if not success:
                    break

                timestamp = (
                    frame_number / fps
                )

                timestamp_ms = int(
                    timestamp * 1000
                )

                pose_result = (
                    detector.process(
                        frame,
                        timestamp_ms,
                    )
                )

                frame_number += 1

                landmarks = (
                    extractor.extract(
                        pose_result
                    )
                )

                # ---------------------------------
                # FOOT POSITIONS
                # ---------------------------------

                left_foot = None

                right_foot = None

                if landmarks:

                    left_foot_landmark = (
                        find_landmark(
                            landmarks,
                            "LEFT_FOOT_INDEX",
                        )
                    )

                    right_foot_landmark = (
                        find_landmark(
                            landmarks,
                            "RIGHT_FOOT_INDEX",
                        )
                    )

                    if (
                        left_foot_landmark
                        is not None
                        and left_foot_landmark.visibility
                        >= 0.50
                    ):

                        left_foot = (
                            left_foot_landmark.x
                            * width,

                            left_foot_landmark.y
                            * height,
                        )

                    if (
                        right_foot_landmark
                        is not None
                        and right_foot_landmark.visibility
                        >= 0.50
                    ):

                        right_foot = (
                            right_foot_landmark.x
                            * width,

                            right_foot_landmark.y
                            * height,
                        )

                # ---------------------------------
                # BALL
                # ---------------------------------

                ball = (
                    ball_tracker.detect(
                        frame=frame,
                        frame_number=frame_number,
                        timestamp=timestamp,
                    )
                )

                if ball is not None:

                    detected_ball_frames += 1

                    ball_center = (
                        int(ball.x),
                        int(ball.y),
                    )

                    x1 = int(
                        ball.x
                        - ball.width / 2
                    )

                    y1 = int(
                        ball.y
                        - ball.height / 2
                    )

                    x2 = int(
                        ball.x
                        + ball.width / 2
                    )

                    y2 = int(
                        ball.y
                        + ball.height / 2
                    )

                    cv2.rectangle(
                        frame,
                        (x1, y1),
                        (x2, y2),
                        (0, 255, 255),
                        3,
                    )

                    cv2.circle(
                        frame,
                        ball_center,
                        5,
                        (0, 0, 255),
                        -1,
                    )

                    cv2.putText(
                        frame,
                        (
                            f"BALL "
                            f"{ball.confidence:.2f}"
                        ),
                        (
                            x1,
                            max(
                                20,
                                y1 - 10,
                            ),
                        ),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.5,
                        (0, 255, 255),
                        2,
                        cv2.LINE_AA,
                    )

                # ---------------------------------
                # JUGGLE TOUCH
                # ---------------------------------

                touch = (
                    juggling.update(
                        ball=ball,
                        left_foot=left_foot,
                        right_foot=right_foot,
                    )
                )

                if touch is not None:

                    last_touch = touch

                    touch_message_frames = int(
                        fps * 0.7
                    )

                # ---------------------------------
                # SKELETON
                # ---------------------------------

                if landmarks:

                    frame = (
                        detector.draw_landmarks(
                            frame,
                            pose_result,
                        )
                    )

                # ---------------------------------
                # FOOT POINTS
                # ---------------------------------

                if left_foot is not None:

                    cv2.circle(
                        frame,
                        (
                            int(left_foot[0]),
                            int(left_foot[1]),
                        ),
                        6,
                        (255, 0, 0),
                        -1,
                    )

                if right_foot is not None:

                    cv2.circle(
                        frame,
                        (
                            int(right_foot[0]),
                            int(right_foot[1]),
                        ),
                        6,
                        (255, 0, 0),
                        -1,
                    )

                # ---------------------------------
                # PANEL
                # ---------------------------------

                overlay = frame.copy()

                cv2.rectangle(
                    overlay,
                    (
                        0,
                        0,
                        width,
                        min(160, height),
                    ),
                    (20, 20, 20),
                    -1,
                )

                frame = cv2.addWeighted(
                    overlay,
                    0.78,
                    frame,
                    0.22,
                    0,
                )

                cv2.putText(
                    frame,
                    "FOOTBALL JUGGLING",
                    (15, 30),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.70,
                    (255, 255, 255),
                    2,
                    cv2.LINE_AA,
                )

                cv2.putText(
                    frame,
                    (
                        f"TOUCHES: "
                        f"{len(juggling.touches)}"
                    ),
                    (15, 65),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.58,
                    (255, 255, 255),
                    2,
                    cv2.LINE_AA,
                )

                cv2.putText(
                    frame,
                    (
                        f"BALL DETECTION: "
                        f"{detected_ball_frames}"
                    ),
                    (15, 95),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.52,
                    (255, 255, 255),
                    2,
                    cv2.LINE_AA,
                )

                if (
                    last_touch is not None
                    and touch_message_frames > 0
                ):

                    cv2.putText(
                        frame,
                        (
                            f"TOUCH "
                            f"{last_touch.number} "
                            f"✓"
                        ),
                        (15, 130),
                        cv2.FONT_HERSHEY_SIMPLEX,
                        0.65,
                        (0, 255, 0),
                        2,
                        cv2.LINE_AA,
                    )

                if (
                    touch_message_frames
                    > 0
                ):

                    touch_message_frames -= 1

                writer.write(frame)

                if frame_number % 30 == 0:

                    print(
                        f"Frame "
                        f"{frame_number}/"
                        f"{total_frames}"
                        f" | Ball: "
                        f"{ball is not None}"
                        f" | Touches: "
                        f"{len(juggling.touches)}"
                    )

        finally:

            detector.close()

            video.release()

            writer.release()

        detection_rate = (
            detected_ball_frames
            / frame_number
            if frame_number > 0
            else 0.0
        )

        print()

        print(
            "FOOTBALL JUGGLING COMPLETE"
        )

        print(
            f"Frames processed : "
            f"{frame_number}"
        )

        print(
            f"Ball detections  : "
            f"{detected_ball_frames}"
        )

        print(
            f"Ball detection   : "
            f"{detection_rate * 100:.2f}%"
        )

        print(
            f"Touches detected : "
            f"{len(juggling.touches)}"
        )

        print(
            f"Saved video      : "
            f"{self.output_path}"
        )

        for touch in juggling.touches:

            print(
                f"Touch "
                f"{touch.number}: "
                f"{touch.foot} foot | "
                f"{touch.timestamp:.2f}s | "
                f"confidence="
                f"{touch.confidence:.2f}"
            )

        return {
            "frames_processed": frame_number,
            "ball_detections": detected_ball_frames,
            "detection_rate": detection_rate,
            "touches": juggling.touches,
            "output_path": str(
                self.output_path
            ),
        }