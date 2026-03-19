from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.exceptions import ConflictError
from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserCreate


def list_users(db: Session) -> list[User]:
    return db.query(User).all()


def register_user(db: Session, data: UserCreate) -> User:
    user = User(
        name=data.name,
        surname=data.surname,
        role="student",
        email=data.email,
        password=hash_password(data.password),
        description=data.description,
        image=data.image,
        remember_token=data.remember_token,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise ConflictError("A user with this email already exists.") from exc

    db.refresh(user)
    return user
