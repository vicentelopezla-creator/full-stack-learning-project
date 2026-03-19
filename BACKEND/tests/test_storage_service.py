import os
import unittest
from pathlib import Path
from shutil import rmtree

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

from app.services.storage_service import save_video_file  # noqa: E402


class StorageServiceTests(unittest.TestCase):
    def test_save_video_file_persists_content(self) -> None:
        temp_dir = Path("tests/.tmp-storage")
        if temp_dir.exists():
            rmtree(temp_dir)
        temp_dir.mkdir(parents=True, exist_ok=True)

        try:
            file_path = save_video_file("lesson.mp4", b"video-bytes", str(temp_dir))

            path = Path(file_path)
            self.assertTrue(path.exists())
            self.assertEqual(path.read_bytes(), b"video-bytes")
            self.assertEqual(path.suffix, ".mp4")
        finally:
            if temp_dir.exists():
                rmtree(temp_dir)


if __name__ == "__main__":
    unittest.main()
