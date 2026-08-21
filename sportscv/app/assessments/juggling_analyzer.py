from dataclasses import dataclass
from math import hypot


@dataclass
class JuggleTouch:
    number: int

    frame: int
    timestamp: float

    ball_x: float
    ball_y: float

    foot: str

    confidence: float


class JugglingAnalyzer:

    def __init__(
        self,
        minimum_vertical_change: float = 8.0,
        foot_distance_threshold: float = 90.0,
        minimum_touch_gap: float = 0.18,
    ) -> None:

        self.minimum_vertical_change = (
            minimum_vertical_change
        )

        self.foot_distance_threshold = (
            foot_distance_threshold
        )

        self.minimum_touch_gap = (
            minimum_touch_gap
        )

        self.detections = []

        self.touches: list[
            JuggleTouch
        ] = []

        self.last_touch_time = None

        self.previous_ball = None

        self.previous_velocity_y = None

    def reset(self) -> None:

        self.detections.clear()

        self.touches.clear()

        self.last_touch_time = None

        self.previous_ball = None

        self.previous_velocity_y = None

    def update(
        self,
        ball,
        left_foot,
        right_foot,
    ) -> JuggleTouch | None:

        if ball is None:
            return None

        # Save trajectory.
        self.detections.append(ball)

        if self.previous_ball is None:

            self.previous_ball = ball

            return None

        dt = (
            ball.timestamp
            - self.previous_ball.timestamp
        )

        if dt <= 0:

            self.previous_ball = ball

            return None

        velocity_y = (
            ball.y
            - self.previous_ball.y
        ) / dt

        previous_velocity_y = (
            self.previous_velocity_y
        )

        self.previous_velocity_y = (
            velocity_y
        )

        self.previous_ball = ball

        if previous_velocity_y is None:
            return None

        # -----------------------------------------
        # Detect a downward -> upward direction
        # change.
        #
        # In image coordinates:
        #
        # positive velocity = moving downward
        # negative velocity = moving upward
        # -----------------------------------------

        direction_reversal = (
            previous_velocity_y > 0
            and velocity_y < 0
        )

        if not direction_reversal:
            return None

        # -----------------------------------------
        # Find the nearest foot.
        # -----------------------------------------

        candidates = []

        if left_foot is not None:

            distance = hypot(
                ball.x - left_foot[0],
                ball.y - left_foot[1],
            )

            candidates.append(
                ("left", distance)
            )

        if right_foot is not None:

            distance = hypot(
                ball.x - right_foot[0],
                ball.y - right_foot[1],
            )

            candidates.append(
                ("right", distance)
            )

        if not candidates:
            return None

        foot_name, foot_distance = min(
            candidates,
            key=lambda item: item[1],
        )

        if (
            foot_distance
            > self.foot_distance_threshold
        ):
            return None

        # Don't double-count a single touch.
        if self.last_touch_time is not None:

            gap = (
                ball.timestamp
                - self.last_touch_time
            )

            if (
                gap
                < self.minimum_touch_gap
            ):
                return None

        # -----------------------------------------
        # Touch detected.
        # -----------------------------------------

        confidence = max(
            0.0,
            min(
                1.0,
                1.0
                - (
                    foot_distance
                    / self.foot_distance_threshold
                ),
            ),
        )

        touch = JuggleTouch(
            number=len(
                self.touches
            ) + 1,

            frame=ball.frame_number,

            timestamp=ball.timestamp,

            ball_x=ball.x,

            ball_y=ball.y,

            foot=foot_name,

            confidence=confidence,
        )

        self.touches.append(
            touch
        )

        self.last_touch_time = (
            ball.timestamp
        )

        return touch