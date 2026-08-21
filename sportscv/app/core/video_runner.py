from pathlib import Path

import cv2

from app.analysis.geometry import (
    calculate_angle,
    find_landmark,
)
from app.assessments.situps import SitUpAnalyzer
from app.pose.detector import PoseDetector
from app.pose.landmarks import LandmarkExtractor


class SitUpVideoRunner:
    """
    Process a sit-up video and feed each frame into
    SitUpAnalyzer.
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
        analyzer = SitUpAnalyzer()

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

                landmarks = (
                    extractor.extract(result)
                )

                if not landmarks:
                    continue

                left_shoulder = find_landmark(
                    landmarks,
                    "LEFT_SHOULDER",
                )

                left_hip = find_landmark(
                    landmarks,
                    "LEFT_HIP",
                )

                left_knee = find_landmark(
                    landmarks,
                    "LEFT_KNEE",
                )

                hip_angle = calculate_angle(
                    left_shoulder,
                    left_hip,
                    left_knee,
                )

                analyzer.update(
                    frame_number=frame_number,
                    timestamp=timestamp,
                    angle=hip_angle,
                )

        finally:
            detector.close()
            video.release()

        return analyzer.to_assessment_result()