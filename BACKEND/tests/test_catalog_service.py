import os
import unittest
from datetime import datetime
from unittest.mock import MagicMock

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

from app.core.exceptions import NotFoundError  # noqa: E402
from app.schemas.category import CategoryUpdate  # noqa: E402
from app.services.catalog_service import delete_category, update_category  # noqa: E402


class CatalogServiceTests(unittest.TestCase):
    def test_update_category_applies_changes_and_persists(self) -> None:
        db = MagicMock()
        category = MagicMock()
        category.name = "Old Name"

        db.query.return_value.filter.return_value.first.return_value = category

        result = update_category(db, 1, CategoryUpdate(name="New Name"))

        self.assertEqual(category.name, "New Name")
        self.assertEqual(result, category)
        db.add.assert_called_once_with(category)
        db.commit.assert_called_once()
        db.refresh.assert_called_once_with(category)

    def test_delete_category_sets_deleted_at(self) -> None:
        db = MagicMock()
        category = MagicMock()
        category.deleted_at = None

        db.query.return_value.filter.return_value.first.return_value = category

        result = delete_category(db, 1)

        self.assertIsInstance(category.deleted_at, datetime)
        self.assertEqual(result, category)
        db.add.assert_called_once_with(category)
        db.commit.assert_called_once()
        db.refresh.assert_called_once_with(category)

    def test_update_category_raises_not_found_when_missing(self) -> None:
        db = MagicMock()
        db.query.return_value.filter.return_value.first.return_value = None

        with self.assertRaises(NotFoundError):
            update_category(db, 99, CategoryUpdate(name="Missing"))


if __name__ == "__main__":
    unittest.main()
