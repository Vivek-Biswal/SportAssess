from dataclasses import dataclass


@dataclass
class Landmark:
    name: str
    x: float
    y: float
    z: float
    visibility: float


class LandmarkExtractor:
    def __init__(self) -> None:
        # MediaPipe Pose Landmarker returns 33 landmarks.
        self.landmark_names = [
            "NOSE",
            "LEFT_EYE_INNER",
            "LEFT_EYE",
            "LEFT_EYE_OUTER",
            "RIGHT_EYE_INNER",
            "RIGHT_EYE",
            "RIGHT_EYE_OUTER",
            "LEFT_EAR",
            "RIGHT_EAR",
            "MOUTH_LEFT",
            "MOUTH_RIGHT",
            "LEFT_SHOULDER",
            "RIGHT_SHOULDER",
            "LEFT_ELBOW",
            "RIGHT_ELBOW",
            "LEFT_WRIST",
            "RIGHT_WRIST",
            "LEFT_PINKY",
            "RIGHT_PINKY",
            "LEFT_INDEX",
            "RIGHT_INDEX",
            "LEFT_THUMB",
            "RIGHT_THUMB",
            "LEFT_HIP",
            "RIGHT_HIP",
            "LEFT_KNEE",
            "RIGHT_KNEE",
            "LEFT_ANKLE",
            "RIGHT_ANKLE",
            "LEFT_HEEL",
            "RIGHT_HEEL",
            "LEFT_FOOT_INDEX",
            "RIGHT_FOOT_INDEX",
        ]

    def extract(self, result) -> list[Landmark]:
        if not result.pose_landmarks:
            return []

        # We configured num_poses=1, so use the first person.
        person = result.pose_landmarks[0]

        landmarks = []

        for index, point in enumerate(person):
            landmarks.append(
                Landmark(
                    name=self.landmark_names[index],
                    x=point.x,
                    y=point.y,
                    z=point.z,
                    visibility=point.visibility,
                )
            )

        return landmarks