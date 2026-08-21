from pathlib import Path

from app.core.registry import ASSESSMENT_REGISTRY
from app.schemas.results import AssessmentResult


class AssessmentRunner:
    """
    Central entry point for all sports assessments.

    The runner looks up the requested assessment
    in the registry and executes its VideoRunner.
    """

    def run(
        self,
        test_type: str,
        video_path: str,
    ) -> AssessmentResult:

        test_type = (
            test_type
            .lower()
            .strip()
            .replace(" ", "_")
        )

        # Mapping variations from DB seed data to internal algorithm names
        slug_map = {
            "sit-ups_(1_min)": "situps",
            "push-ups": "pushups"
        }
        test_type = slug_map.get(test_type, test_type)

        if test_type not in ASSESSMENT_REGISTRY:
            supported = ", ".join(
                sorted(
                    ASSESSMENT_REGISTRY.keys()
                )
            )

            raise ValueError(
                f"Unsupported test: {test_type}. "
                f"Supported tests: {supported}"
            )

        path = Path(video_path)

        if not path.exists():
            raise FileNotFoundError(
                f"Video not found: {path}"
            )

        runner_class = (
            ASSESSMENT_REGISTRY[test_type]
        )

        runner = runner_class(
            str(path)
        )

        return runner.run()

    @staticmethod
    def supported_tests() -> list[str]:
        return sorted(
            ASSESSMENT_REGISTRY.keys()
        )