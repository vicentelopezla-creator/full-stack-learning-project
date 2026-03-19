import os
import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

from app.core.exceptions import ForbiddenError  # noqa: E402
from app.services.commerce_service import ensure_course_access  # noqa: E402


class ContentAccessServiceTests(unittest.TestCase):
    def test_admin_has_access_without_purchase(self) -> None:
        db = MagicMock()
        current_user = SimpleNamespace(id=1, role="admin")

        ensure_course_access(db, current_user, 5)

        db.query.assert_not_called()

    def test_student_requires_purchase(self) -> None:
        db = MagicMock()
        current_user = SimpleNamespace(id=2, role="student")
        db.query.return_value.filter.return_value.first.return_value = None

        with self.assertRaises(ForbiddenError):
            ensure_course_access(db, current_user, 9)

    def test_student_with_purchase_gets_access(self) -> None:
        db = MagicMock()
        current_user = SimpleNamespace(id=3, role="student")
        db.query.return_value.filter.return_value.first.return_value = object()

        ensure_course_access(db, current_user, 4)


if __name__ == "__main__":
    unittest.main()
