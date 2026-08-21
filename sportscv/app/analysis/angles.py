from dataclasses import dataclass


@dataclass
class AngleSample:
    frame_number: int
    timestamp: float
    angle: float


class AngleTrack:
    def __init__(self) -> None:
        self.samples: list[AngleSample] = []

    def add(
        self,
        frame_number: int,
        timestamp: float,
        angle: float | None,
    ) -> None:
        if angle is None:
            return

        self.samples.append(
            AngleSample(
                frame_number=frame_number,
                timestamp=timestamp,
                angle=angle,
            )
        )

    @property
    def count(self) -> int:
        return len(self.samples)

    def min_angle(self) -> float | None:
        if not self.samples:
            return None

        return min(
            sample.angle
            for sample in self.samples
        )

    def max_angle(self) -> float | None:
        if not self.samples:
            return None

        return max(
            sample.angle
            for sample in self.samples
        )

    def average_angle(self) -> float | None:
        if not self.samples:
            return None

        return sum(
            sample.angle
            for sample in self.samples
        ) / len(self.samples)