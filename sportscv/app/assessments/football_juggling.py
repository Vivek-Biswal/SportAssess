from dataclasses import dataclass

from ultralytics import YOLO


@dataclass
class BallDetection:
    frame_number: int
    timestamp: float

    x: float
    y: float

    width: float
    height: float

    confidence: float


class FootballBallTracker:
    """
    YOLO-based football detector.

    Stores the football trajectory so the
    juggling analyzer can later study:

        position
        velocity
        direction
        touches
    """

    SPORTS_BALL_CLASS_ID = 32

    def __init__(
        self,
        model_path: str = "yolo11n.pt",
        confidence_threshold: float = 0.25,
    ) -> None:

        self.model = YOLO(model_path)

        self.confidence_threshold = (
            confidence_threshold
        )

        self.detections: list[
            BallDetection
        ] = []

    def reset(self) -> None:
        self.detections.clear()

    def detect(
        self,
        frame,
        frame_number: int,
        timestamp: float,
    ) -> BallDetection | None:

        results = self.model.predict(
            source=frame,
            verbose=False,
            conf=self.confidence_threshold,
        )

        if not results:
            return None

        result = results[0]

        if result.boxes is None:
            return None

        best_detection = None
        best_confidence = 0.0

        for box in result.boxes:

            class_id = int(
                box.cls.item()
            )

            confidence = float(
                box.conf.item()
            )

            if (
                class_id
                != self.SPORTS_BALL_CLASS_ID
            ):
                continue

            if confidence < best_confidence:
                continue

            coordinates = (
                box.xyxy[0]
                .cpu()
                .numpy()
            )

            x1, y1, x2, y2 = coordinates

            center_x = (
                float(x1) + float(x2)
            ) / 2.0

            center_y = (
                float(y1) + float(y2)
            ) / 2.0

            width = (
                float(x2) - float(x1)
            )

            height = (
                float(y2) - float(y1)
            )

            best_confidence = confidence

            best_detection = BallDetection(
                frame_number=frame_number,
                timestamp=timestamp,
                x=center_x,
                y=center_y,
                width=width,
                height=height,
                confidence=confidence,
            )

        if best_detection is None:
            return None

        self.detections.append(
            best_detection
        )

        return best_detection