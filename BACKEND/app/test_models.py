import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.models.carrito import Carrito
from app.models.category import Category
from app.models.checkbox import Checkbox
from app.models.commentary import Commentary
from app.models.course import Course
from app.models.response import Response
from app.models.user import User
from app.models.venta import Venta
from app.models.video import Video

models = [
    User,
    Category,
    Course,
    Video,
    Carrito,
    Venta,
    Checkbox,
    Commentary,
    Response,
]

print("Modelos importados correctamente")
for model in models:
    print(model.__tablename__)
