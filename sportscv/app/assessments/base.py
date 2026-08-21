from abc import ABC, abstractmethod

from app.schemas.results import AssessmentResult


class BaseAssessment(ABC):
    """
    Common interface for every sports assessment.
    """

    @abstractmethod
    def reset(self) -> None:
        """
        Reset the assessment state.
        """
        raise NotImplementedError

    @abstractmethod
    def update(
        self,
        frame_number: int,
        timestamp: float,
        landmarks,
    ):
        """
        Process one video frame.
        """
        raise NotImplementedError

    @abstractmethod
    def get_result(self) -> AssessmentResult:
        """
        Return the final standardized result.
        """
        raise NotImplementedError