import subprocess
import sys


COMMANDS = [
    [sys.executable, "app/test_db.py"],
    [sys.executable, "app/test_models.py"],
    [sys.executable, "-m", "unittest", "discover", "-s", "tests"],
]


def main() -> int:
    for command in COMMANDS:
        print(f"Running: {' '.join(command)}")
        result = subprocess.run(command, check=False)
        if result.returncode != 0:
            return result.returncode
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
