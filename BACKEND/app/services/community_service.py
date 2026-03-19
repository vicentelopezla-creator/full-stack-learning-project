from sqlalchemy.orm import Session

from app.core.exceptions import NotFoundError
from app.models.commentary import Commentary
from app.models.response import Response
from app.models.video import Video
from app.models.user import User
from app.schemas.commentary import CommentaryCreate
from app.schemas.response import ResponseCreate
from app.services.commerce_service import ensure_course_access


def list_commentaries(db: Session) -> list[Commentary]:
    return db.query(Commentary).all()


def create_commentary(
    db: Session,
    data: CommentaryCreate,
    current_user: User,
) -> Commentary:
    video = (
        db.query(Video)
        .filter(Video.id == data.video_id, Video.deleted_at.is_(None))
        .first()
    )
    if video is None:
        raise NotFoundError("Video not found.")

    course_id = data.course_id or video.course_id
    ensure_course_access(db, current_user, course_id)

    commentary = Commentary(user_id=current_user.id, **data.model_dump())
    db.add(commentary)
    db.commit()
    db.refresh(commentary)
    return commentary


def list_responses(db: Session) -> list[Response]:
    return db.query(Response).all()


def create_response(
    db: Session,
    data: ResponseCreate,
    current_user: User,
) -> Response:
    commentary = (
        db.query(Commentary)
        .filter(Commentary.id == data.commentary_id, Commentary.deleted_at.is_(None))
        .first()
    )
    if commentary is None:
        raise NotFoundError("Commentary not found.")

    if commentary.course_id is not None:
        ensure_course_access(db, current_user, commentary.course_id)

    response = Response(user_id=current_user.id, **data.model_dump())
    db.add(response)
    db.commit()
    db.refresh(response)
    return response
