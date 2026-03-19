import app.models

from app.core.database import engine
from app.models.base import Base


def init_db() -> None:
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    init_db()
    print("Database tables verified/created successfully.")
