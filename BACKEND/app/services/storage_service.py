from pathlib import Path
from uuid import uuid4


def save_video_file(filename: str, content: bytes, upload_dir: str) -> str:
    base_path = Path(upload_dir)
    base_path.mkdir(parents=True, exist_ok=True)

    original_path = Path(filename)
    safe_stem = original_path.stem or "video"
    safe_suffix = original_path.suffix or ".bin"
    stored_name = f"{safe_stem}_{uuid4().hex}{safe_suffix}"
    stored_path = base_path / stored_name
    stored_path.write_bytes(content)
    return str(stored_path)
