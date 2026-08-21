from pathlib import Path

import matplotlib.pyplot as plt


def plot_angles(
    csv_path: str,
    output_path: str,
) -> None:
    import csv

    timestamps = []
    hip_angles = []
    knee_angles = []
    elbow_angles = []

    with open(
        csv_path,
        "r",
        encoding="utf-8",
    ) as file:
        reader = csv.DictReader(file)

        for row in reader:
            timestamps.append(
                float(row["timestamp"])
            )

            hip_angles.append(
                float(row["hip_angle"])
                if row["hip_angle"]
                else None
            )

            knee_angles.append(
                float(row["knee_angle"])
                if row["knee_angle"]
                else None
            )

            elbow_angles.append(
                float(row["elbow_angle"])
                if row["elbow_angle"]
                else None
            )

    output = Path(output_path)
    output.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    plt.figure(figsize=(12, 6))

    plt.plot(
        timestamps,
        hip_angles,
        label="Hip Angle",
    )

    plt.plot(
        timestamps,
        knee_angles,
        label="Knee Angle",
    )

    plt.plot(
        timestamps,
        elbow_angles,
        label="Elbow Angle",
    )

    plt.title(
        "Athlete Joint Angles Over Time"
    )

    plt.xlabel("Time (seconds)")
    plt.ylabel("Angle (degrees)")

    plt.ylim(0, 190)
    plt.grid(True, alpha=0.25)
    plt.legend()

    plt.tight_layout()
    plt.savefig(output, dpi=150)
    plt.close()