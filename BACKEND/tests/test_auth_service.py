import os
import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

from app.core.exceptions import AuthenticationError  # noqa: E402
from app.core.security import hash_password  # noqa: E402
from app.schemas.auth import LoginRequest  # noqa: E402
from app.services.auth_service import login_user  # noqa: E402


class AuthServiceTests(unittest.TestCase):
    def test_login_returns_token_for_valid_credentials(self) -> None:
        db = MagicMock()
        user = SimpleNamespace(
            id=10,
            name="Admin",
            surname="User",
            role="admin",
            email="admin@example.com",
            password=hash_password("secret123"),
            description=None,
            image=None,
            remember_token=None,
            deleted_at=None,
            created_at=None,
            updated_at=None,
        )

        db.query.return_value.filter.return_value.first.return_value = user

        result = login_user(db, LoginRequest(email="admin@example.com", password="secret123"))

        self.assertTrue(result.access_token)
        self.assertEqual(result.user.id, user.id)
        self.assertEqual(result.user.email, user.email)
        self.assertEqual(result.user.role, user.role)
        db.commit.assert_not_called()

    def test_login_rehashes_legacy_plaintext_password(self) -> None:
        db = MagicMock()
        user = SimpleNamespace(
            id=5,
            name="Legacy",
            surname="User",
            role="student",
            email="legacy@example.com",
            password="legacy-password",
            description=None,
            image=None,
            remember_token=None,
            deleted_at=None,
            created_at=None,
            updated_at=None,
        )

        db.query.return_value.filter.return_value.first.return_value = user

        result = login_user(
            db,
            LoginRequest(email="legacy@example.com", password="legacy-password"),
        )

        self.assertTrue(result.access_token)
        self.assertNotEqual(user.password, "legacy-password")
        db.add.assert_called_once_with(user)
        db.commit.assert_called_once()
        db.refresh.assert_called_once_with(user)

    def test_login_fails_for_invalid_credentials(self) -> None:
        db = MagicMock()
        db.query.return_value.filter.return_value.first.return_value = None

        with self.assertRaises(AuthenticationError):
            login_user(
                db,
                LoginRequest(email="nobody@example.com", password="wrong"),
            )


if __name__ == "__main__":
    unittest.main()
