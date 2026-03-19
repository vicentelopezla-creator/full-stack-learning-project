import os
import unittest
from datetime import datetime
from types import SimpleNamespace
from unittest.mock import MagicMock

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

from app.core.exceptions import NotFoundError  # noqa: E402
from app.schemas.course import CourseCreate, CourseUpdate  # noqa: E402
from app.services.catalog_service import (  # noqa: E402
    create_course,
    delete_course,
    update_course,
)


class CourseServiceTests(unittest.TestCase):
    def test_create_course_requires_existing_category(self) -> None:
        db = MagicMock()
        db.query.return_value.filter.return_value.first.return_value = None

        with self.assertRaises(NotFoundError):
            create_course(
                db,
                CourseCreate(
                    category_id=99,
                    name="Python",
                    detalle="Curso",
                    image=None,
                    url=None,
                    accordion=1,
                    precio_ahora=10,
                    precio_antes=20,
                    num_ventas=0,
                ),
            )

    def test_update_course_validates_new_category(self) -> None:
        db = MagicMock()
        course = SimpleNamespace(category_id=1, name="Old")
        filter_mock = db.query.return_value.filter.return_value
        filter_mock.first.side_effect = [course, None]

        with self.assertRaises(NotFoundError):
            update_course(db, 1, CourseUpdate(category_id=7))

    def test_delete_course_sets_deleted_at(self) -> None:
        db = MagicMock()
        course = SimpleNamespace(deleted_at=None)
        db.query.return_value.filter.return_value.first.return_value = course

        result = delete_course(db, 1)

        self.assertEqual(result, course)
        self.assertIsInstance(course.deleted_at, datetime)
        db.add.assert_called_once_with(course)
        db.commit.assert_called_once()
        db.refresh.assert_called_once_with(course)


if __name__ == "__main__":
    unittest.main()
