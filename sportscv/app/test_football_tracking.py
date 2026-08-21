from app.core.football_juggling_runner import (
    FootballJugglingVideoRunner,
)


VIDEO_PATH = (
    "input/football_juggling_test.mp4"
)


def main() -> None:

    runner = FootballJugglingVideoRunner(
        video_path=VIDEO_PATH
    )

    result = runner.run()

    print()
    print("FOOTBALL TRACKING RESULT")
    print("=========================")

    print(
        f"Frames processed : "
        f"{result['frames_processed']}"
    )

    print(
        f"Ball detections  : "
        f"{result['ball_detections']}"
    )

    print(
        f"Detection rate   : "
        f"{result['detection_rate'] * 100:.2f}%"
    )

    print(
        f"Output           : "
        f"{result['output_path']}"
    )


if __name__ == "__main__":
    main()