from dataclasses import dataclass

from app.schemas.results import (
    AssessmentEvent,
    AssessmentResult,
)


GRAVITY = 9.81


@dataclass
class JumpEvent:
    number: int

    takeoff_frame: int
    landing_frame: int
    peak_frame: int

    takeoff_time: float
    landing_time: float
    peak_time: float

    flight_time: float

    jump_height_m: float
    jump_height_cm: float

    peak_ankle_lift: float

    valid: bool
    reason: str


@dataclass
class JumpResult:
    assessment_valid: bool

    total_jumps_detected: int
    valid_jumps: int

    best_jump_number: int | None
    best_jump_height_cm: float

    jumps: list[JumpEvent]

    flight_time: float

    takeoff_frame: int | None
    landing_frame: int | None
    peak_frame: int | None

    takeoff_time: float | None
    landing_time: float | None
    peak_time: float | None

    baseline_ankle_y: float | None
    baseline_hip_y: float | None

    confidence: float

    message: str


class VerticalJumpAnalyzer:
    def __init__(
        self,
        baseline_frames: int = 60,
        minimum_ankle_lift: float = 0.025,
        minimum_hip_lift: float = 0.012,
        confirmation_frames: int = 2,
        minimum_flight_time: float = 0.22,
        maximum_flight_time: float = 1.50,
        landing_ankle_tolerance: float = 0.07,
        landing_hip_tolerance: float = 0.06,
        cooldown_frames: int = 8,
    ) -> None:
        self.baseline_frames = baseline_frames
        self.minimum_ankle_lift = minimum_ankle_lift
        self.minimum_hip_lift = minimum_hip_lift
        self.confirmation_frames = confirmation_frames
        self.minimum_flight_time = minimum_flight_time
        self.maximum_flight_time = maximum_flight_time
        self.landing_ankle_tolerance = landing_ankle_tolerance
        self.landing_hip_tolerance = landing_hip_tolerance
        self.cooldown_frames = cooldown_frames

        self.reset()

    def reset(self) -> None:
        self.ankle_baseline_values: list[float] = []
        self.hip_baseline_values: list[float] = []

        self.baseline_ankle_y: float | None = None
        self.baseline_hip_y: float | None = None

        self.state = "CALIBRATING"

        self.previous_ankle_y: float | None = None
        self.previous_hip_y: float | None = None

        self.candidate_frames = 0

        self.takeoff_candidate_frame: int | None = None
        self.takeoff_candidate_time: float | None = None

        self.current_takeoff_frame: int | None = None
        self.current_takeoff_time: float | None = None

        self.current_peak_frame: int | None = None
        self.current_peak_time: float | None = None

        self.current_peak_ankle_y: float | None = None
        self.current_peak_lift = 0.0

        self.current_airborne_frames = 0

        self.cooldown_remaining = 0

        self.jumps: list[JumpEvent] = []

    def _median(self, values: list[float]) -> float:
        sorted_values = sorted(values)
        middle = len(sorted_values) // 2

        if len(sorted_values) % 2 == 0:
            return (
                sorted_values[middle - 1]
                + sorted_values[middle]
            ) / 2.0

        return sorted_values[middle]

    def _reset_jump_state(self) -> None:
        self.candidate_frames = 0

        self.takeoff_candidate_frame = None
        self.takeoff_candidate_time = None

        self.current_takeoff_frame = None
        self.current_takeoff_time = None

        self.current_peak_frame = None
        self.current_peak_time = None

        self.current_peak_ankle_y = None
        self.current_peak_lift = 0.0

        self.current_airborne_frames = 0

    def update(
        self,
        frame_number: int,
        timestamp: float,
        ankle_y: float | None,
        hip_y: float | None,
    ) -> JumpEvent | None:

        if ankle_y is None or hip_y is None:
            return None

        if self.state == "CALIBRATING":
            self.ankle_baseline_values.append(ankle_y)
            self.hip_baseline_values.append(hip_y)

            if len(self.ankle_baseline_values) >= self.baseline_frames:
                self.baseline_ankle_y = self._median(
                    self.ankle_baseline_values
                )

                self.baseline_hip_y = self._median(
                    self.hip_baseline_values
                )

                self.state = "READY"

            self.previous_ankle_y = ankle_y
            self.previous_hip_y = hip_y

            return None

        if self.state == "COOLDOWN":
            self.cooldown_remaining -= 1

            if self.cooldown_remaining <= 0:
                self.state = "READY"

            self.previous_ankle_y = ankle_y
            self.previous_hip_y = hip_y

            return None

        if (
            self.baseline_ankle_y is None
            or self.baseline_hip_y is None
        ):
            return None

        ankle_lift = self.baseline_ankle_y - ankle_y
        hip_lift = self.baseline_hip_y - hip_y

        if self.state == "READY":
            strong_ankle_lift = (
                ankle_lift >= self.minimum_ankle_lift
            )

            strong_hip_lift = (
                hip_lift >= self.minimum_hip_lift
            )

            if strong_ankle_lift and strong_hip_lift:
                self.candidate_frames += 1

                if self.candidate_frames == 1:
                    self.takeoff_candidate_frame = frame_number
                    self.takeoff_candidate_time = timestamp

                if self.candidate_frames >= self.confirmation_frames:
                    self.state = "AIRBORNE"

                    self.current_takeoff_frame = (
                        self.takeoff_candidate_frame
                    )

                    self.current_takeoff_time = (
                        self.takeoff_candidate_time
                    )

                    self.current_airborne_frames = 0

                    self.current_peak_frame = frame_number
                    self.current_peak_time = timestamp
                    self.current_peak_ankle_y = ankle_y
                    self.current_peak_lift = ankle_lift

                    self.candidate_frames = 0
            else:
                self.candidate_frames = 0

        elif self.state == "AIRBORNE":
            self.current_airborne_frames += 1

            if self.current_takeoff_time is None:
                return None

            current_flight_time = (
                timestamp - self.current_takeoff_time
            )

            if current_flight_time > self.maximum_flight_time:
                self._reset_jump_state()
                self.state = "READY"
                return None

            if ankle_lift > self.current_peak_lift:
                self.current_peak_lift = ankle_lift
                self.current_peak_ankle_y = ankle_y
                self.current_peak_frame = frame_number
                self.current_peak_time = timestamp

            if current_flight_time < self.minimum_flight_time:
                self.previous_ankle_y = ankle_y
                self.previous_hip_y = hip_y
                return None

            ankle_near_ground = (
                abs(
                    ankle_y - self.baseline_ankle_y
                )
                <= self.landing_ankle_tolerance
            )

            hip_near_ground = (
                abs(
                    hip_y - self.baseline_hip_y
                )
                <= self.landing_hip_tolerance
            )

            if ankle_near_ground and hip_near_ground:
                landing_frame = frame_number
                landing_time = timestamp

                flight_time = (
                    landing_time
                    - self.current_takeoff_time
                )

                jump_height_m = (
                    GRAVITY
                    * flight_time
                    * flight_time
                    / 8.0
                )

                jump_height_cm = jump_height_m * 100.0

                jump_number = len(self.jumps) + 1

                valid = (
                    flight_time >= self.minimum_flight_time
                    and self.current_peak_lift
                    >= self.minimum_ankle_lift
                )

                reason = (
                    "Takeoff, peak and landing detected."
                    if valid
                    else "Insufficient jump movement."
                )

                event = JumpEvent(
                    number=jump_number,
                    takeoff_frame=(
                        self.current_takeoff_frame
                        if self.current_takeoff_frame is not None
                        else frame_number
                    ),
                    landing_frame=landing_frame,
                    peak_frame=(
                        self.current_peak_frame
                        if self.current_peak_frame is not None
                        else frame_number
                    ),
                    takeoff_time=(
                        self.current_takeoff_time
                        if self.current_takeoff_time is not None
                        else timestamp
                    ),
                    landing_time=landing_time,
                    peak_time=(
                        self.current_peak_time
                        if self.current_peak_time is not None
                        else timestamp
                    ),
                    flight_time=flight_time,
                    jump_height_m=jump_height_m,
                    jump_height_cm=jump_height_cm,
                    peak_ankle_lift=self.current_peak_lift,
                    valid=valid,
                    reason=reason,
                )

                if valid:
                    self.jumps.append(event)

                self.state = "COOLDOWN"
                self.cooldown_remaining = self.cooldown_frames

                self._reset_jump_state()

                return event

        self.previous_ankle_y = ankle_y
        self.previous_hip_y = hip_y

        return None

    def get_result(self) -> JumpResult:
        if self.baseline_ankle_y is None:
            return JumpResult(
                assessment_valid=False,
                total_jumps_detected=0,
                valid_jumps=0,
                best_jump_number=None,
                best_jump_height_cm=0.0,
                jumps=[],
                flight_time=0.0,
                takeoff_frame=None,
                landing_frame=None,
                peak_frame=None,
                takeoff_time=None,
                landing_time=None,
                peak_time=None,
                baseline_ankle_y=None,
                baseline_hip_y=self.baseline_hip_y,
                confidence=0.0,
                message="Could not establish a standing baseline.",
            )

        if not self.jumps:
            return JumpResult(
                assessment_valid=False,
                total_jumps_detected=0,
                valid_jumps=0,
                best_jump_number=None,
                best_jump_height_cm=0.0,
                jumps=[],
                flight_time=0.0,
                takeoff_frame=None,
                landing_frame=None,
                peak_frame=None,
                takeoff_time=None,
                landing_time=None,
                peak_time=None,
                baseline_ankle_y=self.baseline_ankle_y,
                baseline_hip_y=self.baseline_hip_y,
                confidence=0.0,
                message="No reliable vertical jumps were detected.",
            )

        valid_jumps = [
            jump
            for jump in self.jumps
            if jump.valid
        ]

        best_jump = max(
            valid_jumps,
            key=lambda jump: jump.jump_height_cm,
        )

        confidence = 0.90

        if len(valid_jumps) >= 2:
            confidence = 0.93

        if len(valid_jumps) >= 4:
            confidence = 0.95

        return JumpResult(
            assessment_valid=True,
            total_jumps_detected=len(self.jumps),
            valid_jumps=len(valid_jumps),
            best_jump_number=best_jump.number,
            best_jump_height_cm=best_jump.jump_height_cm,
            jumps=list(self.jumps),
            flight_time=best_jump.flight_time,
            takeoff_frame=best_jump.takeoff_frame,
            landing_frame=best_jump.landing_frame,
            peak_frame=best_jump.peak_frame,
            takeoff_time=best_jump.takeoff_time,
            landing_time=best_jump.landing_time,
            peak_time=best_jump.peak_time,
            baseline_ankle_y=self.baseline_ankle_y,
            baseline_hip_y=self.baseline_hip_y,
            confidence=confidence,
            message=(
                "Vertical jump assessment completed successfully."
            ),
        )

    def to_assessment_result(
        self,
    ) -> AssessmentResult:

        result = self.get_result()

        events = []

        for jump in result.jumps:

            events.append(
                AssessmentEvent(
                    name=f"jump_{jump.number}_takeoff",
                    frame=jump.takeoff_frame,
                    timestamp=jump.takeoff_time,
                    status="valid" if jump.valid else "invalid",
                    details={
                        "jump_number": jump.number,
                    },
                )
            )

            events.append(
                AssessmentEvent(
                    name=f"jump_{jump.number}_peak",
                    frame=jump.peak_frame,
                    timestamp=jump.peak_time,
                    status="valid" if jump.valid else "invalid",
                    details={
                        "jump_number": jump.number,
                        "peak_ankle_lift": (
                            jump.peak_ankle_lift
                        ),
                    },
                )
            )

            events.append(
                AssessmentEvent(
                    name=f"jump_{jump.number}_landing",
                    frame=jump.landing_frame,
                    timestamp=jump.landing_time,
                    status="valid" if jump.valid else "invalid",
                    details={
                        "jump_number": jump.number,
                        "flight_time": jump.flight_time,
                        "jump_height_cm": (
                            jump.jump_height_cm
                        ),
                    },
                )
            )

        return AssessmentResult(
            test_type="vertical_jump",
            status=(
                "verified"
                if result.assessment_valid
                else "rejected"
            ),
            valid=result.assessment_valid,
            score=(
                result.best_jump_height_cm
                if result.assessment_valid
                else None
            ),
            unit="cm",
            confidence=result.confidence,
            message=result.message,
            metrics={
                "total_jumps": (
                    result.total_jumps_detected
                ),
                "valid_jumps": (
                    result.valid_jumps
                ),
                "best_jump_number": (
                    result.best_jump_number
                ),
                "best_jump_height_cm": (
                    result.best_jump_height_cm
                ),
                "best_flight_time": (
                    result.flight_time
                ),
                "baseline_ankle_y": (
                    result.baseline_ankle_y
                ),
                "baseline_hip_y": (
                    result.baseline_hip_y
                ),
            },
            events=events,
            evidence={
                "measurement_type": (
                    "flight_time"
                ),
                "height_formula": (
                    "g * flight_time^2 / 8"
                ),
                "event_sequence": (
                    "takeoff -> peak -> landing"
                ),
            },
        )