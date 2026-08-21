from dataclasses import dataclass


@dataclass
class MovementQuality:
    min_angle: float
    max_angle: float
    range_of_motion: float
    quality: str
    message: str


def analyze_angle_quality(
    min_angle: float | None,
    max_angle: float | None,
) -> MovementQuality:
    if min_angle is None or max_angle is None:
        return MovementQuality(
            min_angle=0.0,
            max_angle=0.0,
            range_of_motion=0.0,
            quality="INSUFFICIENT_DATA",
            message="Not enough pose data.",
        )

    movement_range = max_angle - min_angle

    if movement_range < 20:
        quality = "VERY_LOW"
        message = (
            "Very little movement detected. "
            "Assessment may not be valid."
        )

    elif movement_range < 40:
        quality = "LOW"
        message = (
            "Limited movement detected. "
            "Consider repeating the assessment."
        )

    elif movement_range < 70:
        quality = "MODERATE"
        message = (
            "Moderate movement detected."
        )

    else:
        quality = "HIGH"
        message = (
            "Strong movement detected."
        )

    return MovementQuality(
        min_angle=min_angle,
        max_angle=max_angle,
        range_of_motion=movement_range,
        quality=quality,
        message=message,
    )