import os
import unittest
from datetime import datetime
from types import SimpleNamespace
from unittest.mock import MagicMock

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

from app.core.exceptions import NotFoundError  # noqa: E402
from app.schemas.video import VideoCreate, VideoUpdate  # noqa: E402
from app.services.catalog_service import (  # noqa: E402
    create_video,
    delete_video,
    update_video,
)


class VideoServiceTests(unittest.TestCase):
    def test_create_video_requires_existing_course(self) -> None:
        db = MagicMock()
        db.query.return_value.filter.return_value.first.return_value = None
        current_user = SimpleNamespace(id=1, role="admin")

        with self.assertRaises(NotFoundError):
            create_video(
                db,
                VideoCreate(
                    course_id=8,
                    title="Intro",
                    content="Contenido",
                    url=None,
                    file=None,
                    descarga=None,
                    seccion=1,
                    title_accordion=None,
                ),
                current_user,
            )

    def test_update_video_validates_new_course(self) -> None:
        db = MagicMock()
        video = SimpleNamespace(course_id=1, title="Old")
        filter_mock = db.query.return_value.filter.return_value
        filter_mock.first.side_effect = [video, None]

        with self.assertRaises(NotFoundError):
            update_video(db, 1, VideoUpdate(course_id=77))

    def test_delete_video_sets_deleted_at(self) -> None:
        db = MagicMock()
        video = SimpleNamespace(deleted_at=None)
        db.query.return_value.filter.return_value.first.return_value = video

        result = delete_video(db, 1)

        self.assertEqual(result, video)
        self.assertIsInstance(video.deleted_at, datetime)
        db.add.assert_called_once_with(video)
        db.commit.assert_called_once()
        db.refresh.assert_called_once_with(video)


if __name__ == "__main__":
    unittest.main()
