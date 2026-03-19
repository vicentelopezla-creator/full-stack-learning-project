from sqlalchemy.orm import Session
from datetime import datetime, UTC

from app.core.exceptions import ConflictError, ForbiddenError, NotFoundError
from app.models.carrito import Carrito
from app.models.checkbox import Checkbox
from app.models.course import Course
from app.models.user import User
from app.models.venta import Venta
from app.models.video import Video
from app.schemas.carrito import CarritoCreate
from app.schemas.checkbox import CheckboxCreate
from app.schemas.me import CourseContentPublic, PurchasedCoursePublic, VideoProgressPublic
from app.schemas.venta import CheckoutResultPublic, VentaCreate


def list_cars(db: Session, current_user: User) -> list[Carrito]:
    return db.query(Carrito).filter(Carrito.user_id == current_user.id).all()


def create_car(db: Session, payload: CarritoCreate, current_user: User) -> Carrito:
    existing = (
        db.query(Carrito)
        .filter(
            Carrito.user_id == current_user.id,
            Carrito.course_id == payload.course_id,
            Carrito.deleted_at.is_(None),
        )
        .first()
    )
    if existing is not None:
        existing.cantidad = payload.cantidad
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return existing

    car = Carrito(user_id=current_user.id, **payload.model_dump())
    db.add(car)
    db.commit()
    db.refresh(car)
    return car


def list_ventas(db: Session, current_user: User) -> list[Venta]:
    if current_user.role == "admin":
        return db.query(Venta).all()
    return db.query(Venta).filter(Venta.user_id == current_user.id).all()


def create_venta(db: Session, data: VentaCreate, current_user: User) -> Venta:
    course = (
        db.query(Course)
        .filter(Course.id == data.course_id, Course.deleted_at.is_(None))
        .first()
    )
    if course is None:
        raise NotFoundError("Course not found.")

    existing = (
        db.query(Venta)
        .filter(
            Venta.user_id == current_user.id,
            Venta.course_id == data.course_id,
            Venta.deleted_at.is_(None),
        )
        .first()
    )
    if existing is not None:
        raise ConflictError("You already purchased this course.")

    venta = Venta(user_id=current_user.id, **data.model_dump())
    course.num_ventas += 1
    db.add(course)
    db.add(venta)
    db.commit()
    db.refresh(venta)
    return venta


def checkout_cart(db: Session, current_user: User) -> CheckoutResultPublic:
    cart_items = (
        db.query(Carrito)
        .filter(Carrito.user_id == current_user.id, Carrito.deleted_at.is_(None))
        .all()
    )

    purchased: list[Venta] = []
    skipped_course_ids: list[int] = []

    for item in cart_items:
        existing = (
            db.query(Venta)
            .filter(
                Venta.user_id == current_user.id,
                Venta.course_id == item.course_id,
                Venta.deleted_at.is_(None),
            )
            .first()
        )
        if existing is not None:
            skipped_course_ids.append(item.course_id)
            item.deleted_at = item.deleted_at or getattr(
                existing,
                "updated_at",
                datetime.now(UTC).replace(tzinfo=None),
            )
            db.add(item)
            continue

        venta = create_venta(
            db,
            VentaCreate(course_id=item.course_id, progreso=0, cantidad_v=0),
            current_user,
        )
        purchased.append(venta)
        item.deleted_at = venta.created_at
        db.add(item)

    db.commit()
    return CheckoutResultPublic(purchased=purchased, skipped_course_ids=skipped_course_ids)


def list_checkboxes(db: Session, current_user: User) -> list[Checkbox]:
    return db.query(Checkbox).filter(Checkbox.user_id == current_user.id).all()


def create_checkbox(db: Session, data: CheckboxCreate, current_user: User) -> Checkbox:
    ensure_course_access(db, current_user, data.course_id)

    video = (
        db.query(Video)
        .filter(
            Video.id == data.video_id,
            Video.course_id == data.course_id,
            Video.deleted_at.is_(None),
        )
        .first()
    )
    if video is None:
        raise NotFoundError("Video not found for this course.")

    checkbox = (
        db.query(Checkbox)
        .filter(
            Checkbox.user_id == current_user.id,
            Checkbox.course_id == data.course_id,
            Checkbox.video_id == data.video_id,
            Checkbox.deleted_at.is_(None),
        )
        .first()
    )

    if checkbox is None:
        checkbox = Checkbox(user_id=current_user.id, **data.model_dump())
        db.add(checkbox)
    else:
        checkbox.checkbox = data.checkbox
        db.add(checkbox)

    sync_venta_progress(db, current_user, data.course_id, auto_commit=False)
    db.commit()
    db.refresh(checkbox)
    return checkbox


def _get_active_venta(db: Session, current_user: User, course_id: int) -> Venta | None:
    return (
        db.query(Venta)
        .filter(
            Venta.user_id == current_user.id,
            Venta.course_id == course_id,
            Venta.deleted_at.is_(None),
        )
        .first()
    )


def sync_venta_progress(
    db: Session,
    current_user: User,
    course_id: int,
    *,
    auto_commit: bool = True,
) -> Venta | None:
    venta = _get_active_venta(db, current_user, course_id)
    if venta is None:
        return None

    total_videos = len(
        db.query(Video)
        .filter(Video.course_id == course_id, Video.deleted_at.is_(None))
        .all()
    )
    completed_count = len(
        db.query(Checkbox)
        .filter(
            Checkbox.user_id == current_user.id,
            Checkbox.course_id == course_id,
            Checkbox.checkbox == 1,
            Checkbox.deleted_at.is_(None),
        )
        .all()
    )

    progress = int((completed_count / total_videos) * 100) if total_videos else 0
    venta.progreso = progress
    venta.cantidad_v = completed_count
    db.add(venta)
    if auto_commit:
        db.commit()
        db.refresh(venta)
    return venta


def list_my_courses(db: Session, current_user: User) -> list[PurchasedCoursePublic]:
    if current_user.role == "admin":
        ventas = db.query(Venta).filter(Venta.deleted_at.is_(None)).all()
    else:
        ventas = (
            db.query(Venta)
            .filter(Venta.user_id == current_user.id, Venta.deleted_at.is_(None))
            .all()
        )

    result: list[PurchasedCoursePublic] = []
    for venta in ventas:
        course = venta.course
        result.append(
            PurchasedCoursePublic(
                venta_id=venta.id,
                course_id=course.id,
                name=course.name,
                detalle=course.detalle,
                image=course.image,
                progreso=venta.progreso or 0,
                cantidad_v=venta.cantidad_v or 0,
            )
        )
    return result


def get_course_content(
    db: Session,
    current_user: User,
    course_id: int,
) -> CourseContentPublic:
    ensure_course_access(db, current_user, course_id)

    course = (
        db.query(Course)
        .filter(Course.id == course_id, Course.deleted_at.is_(None))
        .first()
    )
    if course is None:
        raise NotFoundError("Course not found.")

    videos = (
        db.query(Video)
        .filter(Video.course_id == course_id, Video.deleted_at.is_(None))
        .all()
    )
    completed_video_ids = {
        checkbox.video_id
        for checkbox in db.query(Checkbox)
        .filter(
            Checkbox.user_id == current_user.id,
            Checkbox.course_id == course_id,
            Checkbox.checkbox == 1,
            Checkbox.deleted_at.is_(None),
        )
        .all()
    }

    venta = sync_venta_progress(db, current_user, course_id)
    total_videos = len(videos)

    return CourseContentPublic(
        course=course,
        videos=[
            VideoProgressPublic(
                id=video.id,
                title=video.title,
                content=video.content,
                seccion=video.seccion,
                title_accordion=video.title_accordion,
                url=video.url,
                file=video.file,
                descarga=video.descarga,
                completed=video.id in completed_video_ids,
            )
            for video in videos
        ],
        progreso=(venta.progreso if venta else 0) or 0,
        cantidad_v=(venta.cantidad_v if venta else 0) or 0,
        total_videos=total_videos,
    )


def ensure_course_access(db: Session, current_user: User, course_id: int) -> None:
    if current_user.role == "admin":
        return

    venta = (
        db.query(Venta)
        .filter(
            Venta.user_id == current_user.id,
            Venta.course_id == course_id,
            Venta.deleted_at.is_(None),
        )
        .first()
    )
    if venta is None:
        raise ForbiddenError("You must purchase this course to access its videos.")
