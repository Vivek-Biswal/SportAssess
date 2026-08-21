from dataclasses import dataclass

from app.schemas.results import (
    AssessmentEvent,
    AssessmentResult,
)


@dataclass
class PushUpRepetition:
    number: int

    start_frame: int
    end_frame: int

    start_time: float
    end_time: float

    duration: float

    elbow_min_angle: float

    body_angle_min: float

    valid: bool

    reason: str


@dataclass
class PushUpResult:
    assessment_valid: bool

    total_repetitions: int
    valid_repetitions: int
    invalid_repetitions: int

    minimum_elbow_angle: float
    maximum_elbow_angle: float

    minimum_body_angle: float

    confidence: float

    message: str

    repetitions: list[PushUpRepetition]


class PushUpAnalyzer:
    """
    Streaming push-up detector.

    Movement:

        UP
         ↓
        DOWN
         ↓
        UP
         ↓
        REP COMPLETE
    """

    def __init__(
        self,
        down_threshold: float = 90.0,
        up_threshold: float = 155.0,
        minimum_elbow_range: float = 60.0,
        minimum_body_angle: float = 145.0,
        minimum_rep_duration: float = 0.35,
        maximum_rep_duration: float = 5.0,
    ) -> None:
        self.down_threshold = down_threshold
        self.up_threshold = up_threshold

        self.minimum_elbow_range = (
            minimum_elbow_range
        )

        self.minimum_body_angle = (
            minimum_body_angle
        )

        self.minimum_rep_duration = (
            minimum_rep_duration
        )

        self.maximum_rep_duration = (
            maximum_rep_duration
        )

        self.reset()

    def reset(self) -> None:
        self.state = "UP"

        self.current_rep_start_frame = None
        self.current_rep_start_time = None

        self.current_rep_min_elbow = 180.0
        self.current_rep_min_body = 180.0

        self.elbow_angles: list[float] = []
        self.body_angles: list[float] = []

        self.repetitions: list[
            PushUpRepetition
        ] = []

    def update(
        self,
        frame_number: int,
        timestamp: float,
        elbow_angle: float | None,
        body_angle: float | None,
    ) -> PushUpRepetition | None:

        if elbow_angle is None:
            return None

        self.elbow_angles.append(
            elbow_angle
        )

        if body_angle is not None:
            self.body_angles.append(
                body_angle
            )

        if self.state == "UP":

            if elbow_angle <= self.down_threshold:

                self.state = "DOWN"

                self.current_rep_start_frame = (
                    frame_number
                )

                self.current_rep_start_time = (
                    timestamp
                )

                self.current_rep_min_elbow = (
                    elbow_angle
                )

                self.current_rep_min_body = (
                    body_angle
                    if body_angle is not None
                    else 180.0
                )

        elif self.state == "DOWN":

            self.current_rep_min_elbow = min(
                self.current_rep_min_elbow,
                elbow_angle,
            )

            if body_angle is not None:
                self.current_rep_min_body = min(
                    self.current_rep_min_body,
                    body_angle,
                )

            if elbow_angle >= self.up_threshold:

                if (
                    self.current_rep_start_frame is None
                    or self.current_rep_start_time is None
                ):
                    self.state = "UP"
                    return None

                duration = (
                    timestamp
                    - self.current_rep_start_time
                )

                elbow_range = (
                    self.up_threshold
                    - self.current_rep_min_elbow
                )

                valid_duration = (
                    duration
                    >= self.minimum_rep_duration
                    and duration
                    <= self.maximum_rep_duration
                )

                valid_depth = (
                    elbow_range
                    >= self.minimum_elbow_range
                )

                valid_body = (
                    self.current_rep_min_body
                    >= self.minimum_body_angle
                )

                valid = (
                    valid_duration
                    and valid_depth
                    and valid_body
                )

                if valid:
                    reason = (
                        "Full push-up with "
                        "acceptable body alignment."
                    )
                elif not valid_depth:
                    reason = (
                        "Insufficient push-up depth."
                    )
                elif not valid_body:
                    reason = (
                        "Body alignment was "
                        "outside the accepted range."
                    )
                else:
                    reason = (
                        "Rep duration outside "
                        "accepted range."
                    )

                repetition = PushUpRepetition(
                    number=len(self.repetitions) + 1,
                    start_frame=(
                        self.current_rep_start_frame
                    ),
                    end_frame=frame_number,
                    start_time=(
                        self.current_rep_start_time
                    ),
                    end_time=timestamp,
                    duration=duration,
                    elbow_min_angle=(
                        self.current_rep_min_elbow
                    ),
                    body_angle_min=(
                        self.current_rep_min_body
                    ),
                    valid=valid,
                    reason=reason,
                )

                self.repetitions.append(
                    repetition
                )

                self.state = "UP"

                self.current_rep_start_frame = None
                self.current_rep_start_time = None
                self.current_rep_min_elbow = 180.0
                self.current_rep_min_body = 180.0

                return repetition

        return None

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

    def get_result(self) -> PushUpResult:
        if not self.elbow_angles:
            return PushUpResult(
                assessment_valid=False,
                total_repetitions=0,
                valid_repetitions=0,
                invalid_repetitions=0,
                minimum_elbow_angle=0.0,
                maximum_elbow_angle=0.0,
                minimum_body_angle=0.0,
                confidence=0.0,
                message=(
                    "No valid elbow-angle data found."
                ),
                repetitions=[],
            )

        minimum_elbow = min(
            self.elbow_angles
        )

        maximum_elbow = max(
            self.elbow_angles
        )

        minimum_body = (
            min(self.body_angles)
            if self.body_angles
            else 0.0
        )

        elbow_range = (
            maximum_elbow
            - minimum_elbow
        )

        if self.total_repetitions == 0:
            return PushUpResult(
                assessment_valid=False,
                total_repetitions=0,
                valid_repetitions=0,
                invalid_repetitions=0,
                minimum_elbow_angle=minimum_elbow,
                maximum_elbow_angle=maximum_elbow,
                minimum_body_angle=minimum_body,
                confidence=0.20,
                message=(
                    "No complete push-up repetitions "
                    "were detected."
                ),
                repetitions=[],
            )

        form_ratio = (
            self.valid_repetitions
            / self.total_repetitions
        )

        movement_quality = min(
            elbow_range / 90.0,
            1.0,
        )

        confidence = (
            0.65 * form_ratio
            + 0.35 * movement_quality
        )

        confidence = max(
            0.0,
            min(1.0, confidence),
        )

        return PushUpResult(
            assessment_valid=True,
            total_repetitions=self.total_repetitions,
            valid_repetitions=self.valid_repetitions,
            invalid_repetitions=self.invalid_repetitions,
            minimum_elbow_angle=minimum_elbow,
            maximum_elbow_angle=maximum_elbow,
            minimum_body_angle=minimum_body,
            confidence=confidence,
            message=(
                "Push-up assessment completed "
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
                        "minimum_elbow_angle": (
                            repetition.elbow_min_angle
                        ),
                        "minimum_body_angle": (
                            repetition.body_angle_min
                        ),
                        "reason": (
                            repetition.reason
                        ),
                    },
                )
            )

        return AssessmentResult(
            test_type="pushups",
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
                "minimum_elbow_angle": (
                    result.minimum_elbow_angle
                ),
                "maximum_elbow_angle": (
                    result.maximum_elbow_angle
                ),
                "minimum_body_angle": (
                    result.minimum_body_angle
                ),
            },
            events=events,
            evidence={
                "measurement_type": (
                    "elbow_angle"
                ),
                "form_metric": (
                    "shoulder_hip_ankle_angle"
                ),
                "rep_count_method": (
                    "state_machine"
                ),
            },
        )