from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.response import ResponseCreate, ResponsePublic
from app.services.community_service import (
    create_response as create_response_service,
    list_responses as list_responses_service,
)

router = APIRouter(
    prefix="/responses",
    tags=["responses"]
)


@router.get("/", response_model=list[ResponsePublic])
def get_responses(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return list_responses_service(db)


@router.post("/", response_model=ResponsePublic, status_code=201)
def create_response(
    data: ResponseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_response_service(db, data, current_user)
