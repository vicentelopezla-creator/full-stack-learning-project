from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.checkbox import CheckboxCreate, CheckboxPublic
from app.services.commerce_service import (
    create_checkbox as create_checkbox_service,
    list_checkboxes as list_checkboxes_service,
)

router = APIRouter(
    prefix="/checkbox",
    tags=["checkbox"]
)


@router.get("/", response_model=list[CheckboxPublic])
def get_checkbox(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_checkboxes_service(db, current_user)


@router.post("/", response_model=CheckboxPublic, status_code=201)
def create_checkbox(
    data: CheckboxCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_checkbox_service(db, data, current_user)
