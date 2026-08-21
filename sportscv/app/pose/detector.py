from pathlib import Path

import cv2
import mediapipe as mp


class PoseDetector:
    def __init__(self) -> None:
        model_path = (
            Path(__file__).resolve().parents[2]
            / "models"
            / "pose_landmarker_full.task"
        )

        if not model_path.exists():
            raise FileNotFoundError(
                f"Pose model not found: {model_path}"
            )

        base_options = mp.tasks.BaseOptions(
            model_asset_path=str(model_path)
        )

        options = mp.tasks.vision.PoseLandmarkerOptions(
            base_options=base_options,
            running_mode=mp.tasks.vision.RunningMode.VIDEO,
            num_poses=1,
            min_pose_detection_confidence=0.5,
            min_pose_presence_confidence=0.5,
            min_tracking_confidence=0.5,
        )

        self.landmarker = (
            mp.tasks.vision.PoseLandmarker.create_from_options(
                options
            )
        )

    def process(self, frame, timestamp_ms: int):
        rgb_frame = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB,
        )

        image = mp.Image(
            image_format=mp.ImageFormat.SRGB,
            data=rgb_frame,
        )

        return self.landmarker.detect_for_video(
            image,
            timestamp_ms,
        )

    def draw_landmarks(self, frame, result):
        if not result.pose_landmarks:
            return frame

        person = result.pose_landmarks[0]

        # MediaPipe pose connections.
        connections = [
            (0, 1), (1, 2), (2, 3), (3, 7),
            (0, 4), (4, 5), (5, 6), (6, 8),

            (9, 10),

            (11, 12),

            (11, 13), (13, 15),
            (15, 17), (15, 19), (15, 21),
            (17, 19),

            (12, 14), (14, 16),
            (16, 18), (16, 20), (16, 22),
            (18, 20),

            (11, 23),
            (12, 24),
            (23, 24),

            (23, 25), (25, 27),
            (27, 29), (27, 31),
            (29, 31),

            (24, 26), (26, 28),
            (28, 30), (28, 32),
            (30, 32),
        ]

        height, width = frame.shape[:2]

        # Draw connections.
        for start_index, end_index in connections:
            start = person[start_index]
            end = person[end_index]

            # Skip very unreliable landmarks.
            if (
                start.visibility < 0.30
                or end.visibility < 0.30
            ):
                continue

            start_point = (
                int(start.x * width),
                int(start.y * height),
            )

            end_point = (
                int(end.x * width),
                int(end.y * height),
            )

            cv2.line(
                frame,
                start_point,
                end_point,
                (0, 255, 0),
                2,
            )

        # Draw joints.
        for landmark in person:
            if landmark.visibility < 0.30:
                continue

            point = (
                int(landmark.x * width),
                int(landmark.y * height),
            )

            cv2.circle(
                frame,
                point,
                4,
                (0, 0, 255),
                -1,
            )

        return frame

    def close(self) -> None:
        self.landmarker.close()