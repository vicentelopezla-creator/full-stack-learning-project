from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_roles
from app.models.user import User
from app.schemas.user import UserCreate, UserPublic
from app.services.user_service import (
    list_users as list_users_service,
    register_user as register_user_service,
)

router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("/", response_model=list[UserPublic])
def get_users(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("admin")),
):
    return list_users_service(db)


@router.post("/", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("admin")),
):
    return register_user_service(db, data)
