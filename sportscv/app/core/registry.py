from app.core.pushup_runner import PushUpVideoRunner
from app.core.video_runner import SitUpVideoRunner
from app.core.vertical_jump_runner import (
    VerticalJumpVideoRunner,
)


ASSESSMENT_REGISTRY = {
    "situps": SitUpVideoRunner,
    "pushups": PushUpVideoRunner,
    "vertical_jump": VerticalJumpVideoRunner,
}