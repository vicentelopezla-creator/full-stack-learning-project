from datetime import datetime, UTC
from pathlib import Path

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import NotFoundError
from app.models.category import Category
from app.models.course import Course
from app.models.user import User
from app.models.video import Video
from app.schemas.category import CategoryCreate, CategoryUpdate
from app.schemas.course import CourseCreate, CourseUpdate
from app.schemas.video import VideoCreate
from app.schemas.video import VideoUpdate
from app.services.commerce_service import ensure_course_access
from app.services.storage_service import save_video_file


def list_products(db: Session) -> list[Course]:
    return db.query(Course).filter(Course.deleted_at.is_(None)).all()


def get_course_by_id(db: Session, course_id: int) -> Course:
    course = (
        db.query(Course)
        .filter(Course.id == course_id, Course.deleted_at.is_(None))
        .first()
    )
    if course is None:
        raise NotFoundError("Course not found.")
    return course


def list_categories(db: Session) -> list[Category]:
    return db.query(Category).filter(Category.deleted_at.is_(None)).all()


def get_category_by_id(db: Session, category_id: int) -> Category:
    category = (
        db.query(Category)
        .filter(Category.id == category_id, Category.deleted_at.is_(None))
        .first()
    )
    if category is None:
        raise NotFoundError("Category not found.")
    return category


def create_category(db: Session, data: CategoryCreate) -> Category:
    category = Category(**data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update_category(db: Session, category_id: int, data: CategoryUpdate) -> Category:
    category = get_category_by_id(db, category_id)

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(category, field, value)

    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def delete_category(db: Session, category_id: int) -> Category:
    category = get_category_by_id(db, category_id)
    category.deleted_at = datetime.now(UTC).replace(tzinfo=None)

    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def list_videos(
    db: Session,
    current_user: User,
    course_id: int | None = None,
) -> list[Video]:
    query = db.query(Video).filter(Video.deleted_at.is_(None))

    if current_user.role == "admin":
        if course_id is not None:
            query = query.filter(Video.course_id == course_id)
        return query.all()

    if course_id is None:
        raise NotFoundError("course_id is required for non-admin users.")

    ensure_course_access(db, current_user, course_id)
    return query.filter(Video.course_id == course_id).all()


def get_video_by_id(db: Session, video_id: int, current_user: User) -> Video:
    video = (
        db.query(Video)
        .filter(Video.id == video_id, Video.deleted_at.is_(None))
        .first()
    )
    if video is None:
        raise NotFoundError("Video not found.")
    ensure_course_access(db, current_user, video.course_id)
    return video


def create_course(db: Session, data: CourseCreate) -> Course:
    get_category_by_id(db, data.category_id)

    course = Course(**data.model_dump())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


def update_course(db: Session, course_id: int, data: CourseUpdate) -> Course:
    course = get_course_by_id(db, course_id)
    payload = data.model_dump(exclude_unset=True)

    if "category_id" in payload and payload["category_id"] is not None:
        get_category_by_id(db, payload["category_id"])

    for field, value in payload.items():
        setattr(course, field, value)

    db.add(course)
    db.commit()
    db.refresh(course)
    return course


def delete_course(db: Session, course_id: int) -> Course:
    course = get_course_by_id(db, course_id)
    course.deleted_at = datetime.now(UTC).replace(tzinfo=None)

    db.add(course)
    db.commit()
    db.refresh(course)
    return course


def create_video(db: Session, payload: VideoCreate, current_user: User) -> Video:
    get_course_by_id(db, payload.course_id)

    video = Video(user_id=current_user.id, **payload.model_dump())
    db.add(video)
    db.commit()
    db.refresh(video)
    return video


def upload_video_file(
    db: Session,
    current_user: User,
    payload: VideoCreate,
    filename: str,
    content: bytes,
) -> Video:
    stored_path = save_video_file(filename, content, settings.videos_upload_dir)
    create_payload = payload.model_copy(update={"file": stored_path})
    return create_video(db, create_payload, current_user)


def update_video(
    db: Session,
    video_id: int,
    payload: VideoUpdate,
) -> Video:
    video = (
        db.query(Video)
        .filter(Video.id == video_id, Video.deleted_at.is_(None))
        .first()
    )
    if video is None:
        raise NotFoundError("Video not found.")
    data = payload.model_dump(exclude_unset=True)

    if "course_id" in data and data["course_id"] is not None:
        get_course_by_id(db, data["course_id"])

    for field, value in data.items():
        setattr(video, field, value)

    db.add(video)
    db.commit()
    db.refresh(video)
    return video


def delete_video(db: Session, video_id: int) -> Video:
    video = (
        db.query(Video)
        .filter(Video.id == video_id, Video.deleted_at.is_(None))
        .first()
    )
    if video is None:
        raise NotFoundError("Video not found.")
    video.deleted_at = datetime.now(UTC).replace(tzinfo=None)

    db.add(video)
    db.commit()
    db.refresh(video)
    return video


def get_video_file_path(db: Session, video_id: int, current_user: User) -> str:
    video = get_video_by_id(db, video_id, current_user)
    if not video.file:
        raise NotFoundError("This video does not have an uploaded file.")

    file_path = Path(video.file)
    if not file_path.exists():
        raise NotFoundError("Uploaded video file was not found on disk.")

    return str(file_path)
