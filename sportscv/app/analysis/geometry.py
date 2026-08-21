import math
from typing import Optional

from app.pose.landmarks import Landmark


def calculate_angle(
    point_a: Landmark,
    point_b: Landmark,
    point_c: Landmark,
) -> Optional[float]:
    """
    Calculate the angle at point_b.

    Example:
        shoulder -> hip -> knee

    The angle is measured between:
        point_b -> point_a
        point_b -> point_c
    """

    if (
        point_a is None
        or point_b is None
        or point_c is None
    ):
        return None

    vector_ba = (
        point_a.x - point_b.x,
        point_a.y - point_b.y,
    )

    vector_bc = (
        point_c.x - point_b.x,
        point_c.y - point_b.y,
    )

    magnitude_ba = math.sqrt(
        vector_ba[0] ** 2
        + vector_ba[1] ** 2
    )

    magnitude_bc = math.sqrt(
        vector_bc[0] ** 2
        + vector_bc[1] ** 2
    )

    if magnitude_ba == 0 or magnitude_bc == 0:
        return None

    dot_product = (
        vector_ba[0] * vector_bc[0]
        + vector_ba[1] * vector_bc[1]
    )

    cosine_angle = (
        dot_product
        / (magnitude_ba * magnitude_bc)
    )

    # Numerical safety.
    cosine_angle = max(
        -1.0,
        min(1.0, cosine_angle),
    )

    angle = math.degrees(
        math.acos(cosine_angle)
    )

    return angle


def find_landmark(
    landmarks: list[Landmark],
    name: str,
) -> Optional[Landmark]:
    """
    Find a landmark by name.
    """

    for landmark in landmarks:
        if landmark.name == name:
            return landmark

    return None