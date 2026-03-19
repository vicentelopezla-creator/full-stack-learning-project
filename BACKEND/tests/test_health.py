import os
import unittest

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

from app.main import app, health  # noqa: E402


class HealthRouteTests(unittest.TestCase):
    def test_health_handler_returns_expected_payload(self) -> None:
        self.assertEqual(health(), {"status": "ok"})

    def test_health_route_is_registered(self) -> None:
        route_paths = {route.path for route in app.routes}
        self.assertIn("/health", route_paths)


if __name__ == "__main__":
    unittest.main()
