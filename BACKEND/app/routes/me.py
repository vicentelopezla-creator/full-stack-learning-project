from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.me import CourseContentPublic, PurchasedCoursePublic
from app.services.commerce_service import get_course_content, list_my_courses


router = APIRouter(prefix="/me", tags=["me"])


@router.get("/courses", response_model=list[PurchasedCoursePublic])
def get_my_courses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_my_courses(db, current_user)


@router.get("/courses/{course_id}/content", response_model=CourseContentPublic)
def get_my_course_content(
    course_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_course_content(db, current_user, course_id)
