from dataclasses import dataclass

from app.schemas.results import (
    AssessmentEvent,
    AssessmentResult,
)


@dataclass
class Repetition:
    number: int

    start_frame: int
    end_frame: int

    start_time: float
    end_time: float

    duration: float

    valid: bool

    reason: str


@dataclass
class SitUpResult:
    total_repetitions: int
    valid_repetitions: int
    invalid_repetitions: int

    minimum_angle: float
    maximum_angle: float
    range_of_motion: float

    assessment_valid: bool
    confidence: float

    message: str

    repetitions: list[Repetition]


class SitUpAnalyzer:
    def __init__(
        self,
        up_threshold: float = 75.0,
        down_threshold: float = 150.0,
        minimum_range_of_motion: float = 50.0,
        minimum_rep_duration: float = 0.5,
        maximum_rep_duration: float = 5.0,
    ) -> None:
        self.up_threshold = up_threshold
        self.down_threshold = down_threshold

        self.minimum_range_of_motion = (
            minimum_range_of_motion
        )

        self.minimum_rep_duration = (
            minimum_rep_duration
        )

        self.maximum_rep_duration = (
            maximum_rep_duration
        )

        self.reset()

    def reset(self) -> None:
        self.state = "DOWN"

        self.current_rep_start_frame = None
        self.current_rep_start_time = None

        self.repetitions: list[Repetition] = []

        self.angles: list[float] = []

        self.last_completed_rep = None

    def update(
        self,
        frame_number: int,
        timestamp: float,
        angle: float | None,
    ) -> Repetition | None:

        self.last_completed_rep = None

        if angle is None:
            return None

        self.angles.append(angle)

        if self.state == "DOWN":

            if angle <= self.up_threshold:

                self.state = "UP"

                self.current_rep_start_frame = (
                    frame_number
                )

                self.current_rep_start_time = (
                    timestamp
                )

        elif self.state == "UP":

            if angle >= self.down_threshold:

                if (
                    self.current_rep_start_frame
                    is not None
                    and self.current_rep_start_time
                    is not None
                ):

                    duration = (
                        timestamp
                        - self.current_rep_start_time
                    )

                    movement_range = (
                        max(self.angles)
                        - min(self.angles)
                        if self.angles
                        else 0.0
                    )

                    valid_duration = (
                        duration
                        >= self.minimum_rep_duration
                        and duration
                        <= self.maximum_rep_duration
                    )

                    valid_range = (
                        movement_range
                        >= self.minimum_range_of_motion
                    )

                    valid = (
                        valid_duration
                        and valid_range
                    )

                    if valid:
                        reason = (
                            "Complete sit-up movement."
                        )

                    elif not valid_duration:
                        reason = (
                            "Rep duration outside "
                            "accepted range."
                        )

                    else:
                        reason = (
                            "Insufficient movement range."
                        )

                    repetition = Repetition(
                        number=(
                            len(self.repetitions) + 1
                        ),

                        start_frame=(
                            self.current_rep_start_frame
                        ),

                        end_frame=frame_number,

                        start_time=(
                            self.current_rep_start_time
                        ),

                        end_time=timestamp,

                        duration=duration,

                        valid=valid,

                        reason=reason,
                    )

                    self.repetitions.append(
                        repetition
                    )

                    self.last_completed_rep = (
                        repetition
                    )

                self.state = "DOWN"

                self.current_rep_start_frame = None
                self.current_rep_start_time = None

        return self.last_completed_rep

    @property
    def total_repetitions(self) -> int:
        return len(self.repetitions)

    @property
    def valid_repetitions(self) -> int:
        return sum(
            1
            for repetition in self.repetitions
            if repetition.valid
        )

    @property
    def invalid_repetitions(self) -> int:
        return (
            self.total_repetitions
            - self.valid_repetitions
        )

    @property
    def movement_range(self) -> float:
        if not self.angles:
            return 0.0

        return (
            max(self.angles)
            - min(self.angles)
        )

    @property
    def minimum_angle(self) -> float:
        if not self.angles:
            return 0.0

        return min(self.angles)

    @property
    def maximum_angle(self) -> float:
        if not self.angles:
            return 0.0

        return max(self.angles)

    def get_result(self) -> SitUpResult:

        if not self.angles:

            return SitUpResult(
                total_repetitions=0,
                valid_repetitions=0,
                invalid_repetitions=0,

                minimum_angle=0.0,
                maximum_angle=0.0,
                range_of_motion=0.0,

                assessment_valid=False,
                confidence=0.0,

                message=(
                    "No valid hip-angle data "
                    "available."
                ),

                repetitions=[],
            )

        if (
            self.movement_range
            < self.minimum_range_of_motion
        ):

            return SitUpResult(
                total_repetitions=0,
                valid_repetitions=0,
                invalid_repetitions=0,

                minimum_angle=self.minimum_angle,
                maximum_angle=self.maximum_angle,
                range_of_motion=self.movement_range,

                assessment_valid=False,
                confidence=0.0,

                message=(
                    "Insufficient hip movement "
                    "detected. Please repeat "
                    "the sit-up assessment."
                ),

                repetitions=list(
                    self.repetitions
                ),
            )

        if self.total_repetitions == 0:

            return SitUpResult(
                total_repetitions=0,
                valid_repetitions=0,
                invalid_repetitions=0,

                minimum_angle=self.minimum_angle,
                maximum_angle=self.maximum_angle,
                range_of_motion=self.movement_range,

                assessment_valid=False,
                confidence=0.2,

                message=(
                    "Movement was detected, "
                    "but no complete sit-up "
                    "repetitions were found."
                ),

                repetitions=list(
                    self.repetitions
                ),
            )

        form_ratio = (
            self.valid_repetitions
            / self.total_repetitions
        )

        movement_quality = min(
            self.movement_range / 90.0,
            1.0,
        )

        confidence = (
            0.6 * form_ratio
            + 0.4 * movement_quality
        )

        confidence = max(
            0.0,
            min(1.0, confidence),
        )

        return SitUpResult(
            total_repetitions=(
                self.total_repetitions
            ),

            valid_repetitions=(
                self.valid_repetitions
            ),

            invalid_repetitions=(
                self.invalid_repetitions
            ),

            minimum_angle=self.minimum_angle,

            maximum_angle=self.maximum_angle,

            range_of_motion=self.movement_range,

            assessment_valid=True,

            confidence=confidence,

            message=(
                "Sit-up assessment completed "
                "successfully."
            ),

            repetitions=list(
                self.repetitions
            ),
        )

    def to_assessment_result(
        self,
    ) -> AssessmentResult:

        result = self.get_result()

        events = []

        for repetition in result.repetitions:

            events.append(
                AssessmentEvent(
                    name=(
                        f"rep_{repetition.number}"
                    ),

                    frame=repetition.end_frame,

                    timestamp=repetition.end_time,

                    status=(
                        "valid"
                        if repetition.valid
                        else "invalid"
                    ),

                    details={
                        "start_frame": (
                            repetition.start_frame
                        ),

                        "end_frame": (
                            repetition.end_frame
                        ),

                        "start_time": (
                            repetition.start_time
                        ),

                        "end_time": (
                            repetition.end_time
                        ),

                        "duration": (
                            repetition.duration
                        ),

                        "reason": (
                            repetition.reason
                        ),
                    },
                )
            )

        return AssessmentResult(
            test_type="situps",

            status=(
                "verified"
                if result.assessment_valid
                else "rejected"
            ),

            valid=result.assessment_valid,

            score=(
                float(result.valid_repetitions)
                if result.assessment_valid
                else None
            ),

            unit="reps",

            confidence=result.confidence,

            message=result.message,

            metrics={
                "total_reps": (
                    result.total_repetitions
                ),

                "valid_reps": (
                    result.valid_repetitions
                ),

                "invalid_reps": (
                    result.invalid_repetitions
                ),

                "minimum_angle": (
                    result.minimum_angle
                ),

                "maximum_angle": (
                    result.maximum_angle
                ),

                "range_of_motion": (
                    result.range_of_motion
                ),
            },

            events=events,

            evidence={
                "measurement_type": (
                    "hip_angle"
                ),

                "rep_count_method": (
                    "state_machine"
                ),
            },
        )