import os
import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

from app.schemas.venta import CheckoutResultPublic  # noqa: E402
from app.services.commerce_service import checkout_cart  # noqa: E402


class CheckoutServiceTests(unittest.TestCase):
    def test_checkout_skips_already_purchased_courses(self) -> None:
        db = MagicMock()
        current_user = SimpleNamespace(id=1, role="student")
        cart_item = SimpleNamespace(course_id=3, deleted_at=None)

        filter_mock = db.query.return_value.filter.return_value
        filter_mock.all.return_value = [cart_item]
        filter_mock.first.return_value = object()

        result = checkout_cart(db, current_user)

        self.assertIsInstance(result, CheckoutResultPublic)
        self.assertEqual(result.skipped_course_ids, [3])


if __name__ == "__main__":
    unittest.main()
