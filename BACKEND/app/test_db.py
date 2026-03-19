import sys
from pathlib import Path

from sqlalchemy import text

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.database import engine


try:
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        print("Conexion OK:", result.scalar())
        print(
            "Motor conectado a:",
            connection.engine.url.render_as_string(hide_password=True),
        )
except Exception as e:
    print("Error de conexion:", e)
