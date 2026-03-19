import os
import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock

os.environ.setdefault("DATABASE_URL", "sqlite://")
os.environ.setdefault("SECRET_KEY", "test-secret-key")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "60")

from app.core.exceptions import ConflictError  # noqa: E402
from app.schemas.checkbox import CheckboxCreate  # noqa: E402
from app.schemas.venta import VentaCreate  # noqa: E402
from app.services.commerce_service import (  # noqa: E402
    create_checkbox,
    create_venta,
    list_my_courses,
)


class LearningServiceTests(unittest.TestCase):
    def test_create_venta_rejects_duplicate_purchase(self) -> None:
        db = MagicMock()
        current_user = SimpleNamespace(id=1, role="student")
        course = SimpleNamespace(id=2, num_ventas=3, deleted_at=None)
        filter_mock = db.query.return_value.filter.return_value
        filter_mock.first.side_effect = [course, object()]

        with self.assertRaises(ConflictError):
            create_venta(db, VentaCreate(course_id=2, progreso=0, cantidad_v=0), current_user)

    def test_create_checkbox_updates_existing_record(self) -> None:
        db = MagicMock()
        current_user = SimpleNamespace(id=1, role="student")
        existing_checkbox = SimpleNamespace(checkbox=0)
        video = SimpleNamespace(id=3, course_id=2)
        venta = SimpleNamespace(progreso=0, cantidad_v=0)
        filter_mock = db.query.return_value.filter.return_value
        filter_mock.first.side_effect = [object(), video, existing_checkbox, venta]
        filter_mock.all.side_effect = [[video], [existing_checkbox]]

        result = create_checkbox(
            db,
            CheckboxCreate(course_id=2, video_id=3, checkbox=1),
            current_user,
        )

        self.assertEqual(result.checkbox, 1)
        self.assertEqual(venta.progreso, 100)
        self.assertEqual(venta.cantidad_v, 1)

    def test_list_my_courses_returns_purchase_summary(self) -> None:
        db = MagicMock()
        current_user = SimpleNamespace(id=1, role="student")
        venta = SimpleNamespace(
            id=10,
            progreso=60,
            cantidad_v=3,
            course=SimpleNamespace(
                id=7,
                name="Python",
                detalle="Curso",
                image="cover.png",
            ),
        )
        db.query.return_value.filter.return_value.all.return_value = [venta]

        result = list_my_courses(db, current_user)

        self.assertEqual(len(result), 1)
        self.assertEqual(result[0].course_id, 7)
        self.assertEqual(result[0].progreso, 60)


if __name__ == "__main__":
    unittest.main()
