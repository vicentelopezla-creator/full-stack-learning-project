from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_roles
from app.models.user import User
from app.schemas.course import CourseCreate, CoursePublic, CourseUpdate
from app.services.catalog_service import (
    create_course as create_course_service,
    delete_course as delete_course_service,
    get_course_by_id as get_course_by_id_service,
    list_products as list_products_service,
    update_course as update_course_service,
)

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=list[CoursePublic])
def get_products(db: Session = Depends(get_db)):
    return list_products_service(db)


@router.get("/{course_id}", response_model=CoursePublic)
def get_product(course_id: int, db: Session = Depends(get_db)):
    return get_course_by_id_service(db, course_id)


@router.post("/", response_model=CoursePublic, status_code=201)
def create_product(
    data: CourseCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("admin")),
):
    return create_course_service(db, data)


@router.patch("/{course_id}", response_model=CoursePublic)
def update_product(
    course_id: int,
    data: CourseUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("admin")),
):
    return update_course_service(db, course_id, data)


@router.delete("/{course_id}", response_model=CoursePublic)
def delete_product(
    course_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("admin")),
):
    return delete_course_service(db, course_id)
