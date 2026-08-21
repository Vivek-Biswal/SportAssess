import csv
from pathlib import Path


class AngleDataWriter:
    def __init__(self, output_path: str) -> None:
        self.output_path = Path(output_path)
        self.rows: list[dict] = []

    def add(
        self,
        frame_number: int,
        timestamp: float,
        hip_angle: float | None,
        knee_angle: float | None,
        elbow_angle: float | None,
    ) -> None:
        self.rows.append(
            {
                "frame": frame_number,
                "timestamp": round(timestamp, 4),
                "hip_angle": (
                    round(hip_angle, 4)
                    if hip_angle is not None
                    else ""
                ),
                "knee_angle": (
                    round(knee_angle, 4)
                    if knee_angle is not None
                    else ""
                ),
                "elbow_angle": (
                    round(elbow_angle, 4)
                    if elbow_angle is not None
                    else ""
                ),
            }
        )

    def save(self) -> None:
        self.output_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        with self.output_path.open(
            "w",
            newline="",
            encoding="utf-8",
        ) as file:
            writer = csv.DictWriter(
                file,
                fieldnames=[
                    "frame",
                    "timestamp",
                    "hip_angle",
                    "knee_angle",
                    "elbow_angle",
                ],
            )

            writer.writeheader()
            writer.writerows(self.rows)