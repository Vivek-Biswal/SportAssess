from pathlib import Path

import cv2

from app.analysis.geometry import find_landmark
from app.assessments.vertical_jump import (
    VerticalJumpAnalyzer,
)
from app.pose.detector import PoseDetector
from app.pose.landmarks import LandmarkExtractor


class VerticalJumpVideoRunner:
    """
    Process a vertical-jump video and feed each
    frame into VerticalJumpAnalyzer.
    """

    def __init__(
        self,
        video_path: str,
    ) -> None:
        self.video_path = Path(video_path)

    def run(self):
        if not self.video_path.exists():
            raise FileNotFoundError(
                f"Video not found: {self.video_path}"
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

        detector = PoseDetector()
        extractor = LandmarkExtractor()
        analyzer = VerticalJumpAnalyzer()

        frame_number = 0

        try:
            while True:
                success, frame = video.read()

                if not success:
                    break

                timestamp = (
                    frame_number / fps
                )

                timestamp_ms = int(
                    timestamp * 1000
                )

                result = detector.process(
                    frame,
                    timestamp_ms,
                )

                frame_number += 1

                landmarks = extractor.extract(
                    result
                )

                if not landmarks:
                    continue

                left_ankle = find_landmark(
                    landmarks,
                    "LEFT_ANKLE",
                )

                right_ankle = find_landmark(
                    landmarks,
                    "RIGHT_ANKLE",
                )

                left_hip = find_landmark(
                    landmarks,
                    "LEFT_HIP",
                )

                right_hip = find_landmark(
                    landmarks,
                    "RIGHT_HIP",
                )

                left_ankle_ok = (
                    left_ankle is not None
                    and left_ankle.visibility >= 0.50
                )

                right_ankle_ok = (
                    right_ankle is not None
                    and right_ankle.visibility >= 0.50
                )

                ankle_y = None

                if (
                    left_ankle_ok
                    and right_ankle_ok
                ):
                    ankle_y = (
                        left_ankle.y
                        + right_ankle.y
                    ) / 2.0

                elif left_ankle_ok:
                    ankle_y = left_ankle.y

                elif right_ankle_ok:
                    ankle_y = right_ankle.y

                left_hip_ok = (
                    left_hip is not None
                    and left_hip.visibility >= 0.50
                )

                right_hip_ok = (
                    right_hip is not None
                    and right_hip.visibility >= 0.50
                )

                hip_y = None

                if (
                    left_hip_ok
                    and right_hip_ok
                ):
                    hip_y = (
                        left_hip.y
                        + right_hip.y
                    ) / 2.0

                elif left_hip_ok:
                    hip_y = left_hip.y

                elif right_hip_ok:
                    hip_y = right_hip.y

                analyzer.update(
                    frame_number=frame_number,
                    timestamp=timestamp,
                    ankle_y=ankle_y,
                    hip_y=hip_y,
                )

        finally:
            detector.close()
            video.release()

        return analyzer.to_assessment_result()