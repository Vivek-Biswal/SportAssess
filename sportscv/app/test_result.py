from app.assessments.situps import SitUpAnalyzer


def main() -> None:
    analyzer = SitUpAnalyzer()

    result = analyzer.to_assessment_result()

    print(result.to_dict())


if __name__ == "__main__":
    main()