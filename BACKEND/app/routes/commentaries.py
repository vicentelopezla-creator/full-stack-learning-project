from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.commentary import CommentaryCreate, CommentaryPublic
from app.services.community_service import (
    create_commentary as create_commentary_service,
    list_commentaries as list_commentaries_service,
)

router = APIRouter(
    prefix="/commentaries",
    tags=["commentaries"]
)


@router.get("/", response_model=list[CommentaryPublic])
def get_commentaries(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    return list_commentaries_service(db)


@router.post("/", response_model=CommentaryPublic, status_code=201)
def create_commentary(
    data: CommentaryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_commentary_service(db, data, current_user)
