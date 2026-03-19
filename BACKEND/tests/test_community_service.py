import os
import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

from app.core.exceptions import ForbiddenError, NotFoundError  # noqa: E402
from app.schemas.commentary import CommentaryCreate  # noqa: E402
from app.services.community_service import create_commentary  # noqa: E402


class CommunityServiceTests(unittest.TestCase):
    def test_create_commentary_requires_existing_video(self) -> None:
        db = MagicMock()
        current_user = SimpleNamespace(id=1, role="student")
        db.query.return_value.filter.return_value.first.return_value = None

        with self.assertRaises(NotFoundError):
            create_commentary(
                db,
                CommentaryCreate(video_id=9, course_id=2, title="Hola", comment="Test"),
                current_user,
            )

    def test_create_commentary_requires_course_access(self) -> None:
        db = MagicMock()
        current_user = SimpleNamespace(id=1, role="student")
        video = SimpleNamespace(course_id=2)
        filter_mock = db.query.return_value.filter.return_value
        filter_mock.first.side_effect = [video, None]

        with self.assertRaises(ForbiddenError):
            create_commentary(
                db,
                CommentaryCreate(video_id=9, course_id=2, title="Hola", comment="Test"),
                current_user,
            )


if __name__ == "__main__":
    unittest.main()
