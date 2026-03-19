import os
from dataclasses import dataclass
from pathlib import Path


def parse_csv_env(value: str | None, *, default: list[str]) -> list[str]:
    if value is None:
        return default

    items = [item.strip() for item in value.split(",")]
    return [item for item in items if item]


def load_env_file() -> None:
    """Load simple KEY=VALUE pairs from BACKEND/.env if the file exists."""
    env_path = Path(__file__).resolve().parents[2] / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


@dataclass(frozen=True)
class Settings:
    database_url: str
    secret_key: str
    access_token_expire_minutes: int
    videos_upload_dir: str
    cors_allowed_origins: list[str]
    max_upload_size_bytes: int
    allowed_upload_extensions: list[str]
    allowed_upload_content_types: list[str]


def get_settings() -> Settings:
    load_env_file()

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError(
            "DATABASE_URL is not configured. Set it in the environment or BACKEND/.env."
        )

    secret_key = os.getenv("SECRET_KEY")
    if not secret_key:
        raise RuntimeError(
            "SECRET_KEY is not configured. Set it in the environment or BACKEND/.env."
        )

    expire_minutes = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))
    videos_upload_dir = os.getenv(
        "VIDEOS_UPLOAD_DIR",
        str(Path(__file__).resolve().parents[2] / "uploads" / "videos"),
    )
    cors_allowed_origins = parse_csv_env(
        os.getenv("CORS_ALLOWED_ORIGINS"),
        default=[
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ],
    )
    max_upload_size_bytes = int(os.getenv("MAX_UPLOAD_SIZE_BYTES", str(250 * 1024 * 1024)))
    allowed_upload_extensions = parse_csv_env(
        os.getenv("ALLOWED_UPLOAD_EXTENSIONS"),
        default=[".mp4", ".mov", ".m4v", ".webm"],
    )
    allowed_upload_content_types = parse_csv_env(
        os.getenv("ALLOWED_UPLOAD_CONTENT_TYPES"),
        default=[
            "video/mp4",
            "video/quicktime",
            "video/x-m4v",
            "video/webm",
        ],
    )

    return Settings(
        database_url=database_url,
        secret_key=secret_key,
        access_token_expire_minutes=expire_minutes,
        videos_upload_dir=videos_upload_dir,
        cors_allowed_origins=cors_allowed_origins,
        max_upload_size_bytes=max_upload_size_bytes,
        allowed_upload_extensions=allowed_upload_extensions,
        allowed_upload_content_types=allowed_upload_content_types,
    )


settings = get_settings()
