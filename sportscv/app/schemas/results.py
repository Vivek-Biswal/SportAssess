from dataclasses import dataclass, field
from typing import Any


@dataclass
class AssessmentEvent:
    name: str

    frame: int | None = None
    timestamp: float | None = None

    status: str | None = None

    details: dict[str, Any] = field(
        default_factory=dict
    )


@dataclass
class AssessmentResult:
    test_type: str

    status: str

    valid: bool

    score: float | None

    unit: str | None

    confidence: float

    message: str

    metrics: dict[str, Any] = field(
        default_factory=dict
    )

    events: list[AssessmentEvent] = field(
        default_factory=list
    )

    evidence: dict[str, Any] = field(
        default_factory=dict
    )

    def to_dict(self) -> dict[str, Any]:
        return {
            "test_type": self.test_type,
            "status": self.status,
            "valid": self.valid,
            "score": self.score,
            "unit": self.unit,
            "confidence": self.confidence,
            "message": self.message,
            "metrics": self.metrics,
            "events": [
                {
                    "name": event.name,
                    "frame": event.frame,
                    "timestamp": event.timestamp,
                    "status": event.status,
                    "details": event.details,
                }
                for event in self.events
            ],
            "evidence": self.evidence,
        }