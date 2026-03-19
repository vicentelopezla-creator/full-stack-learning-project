from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_db, require_roles
from app.models.user import User
from app.schemas.category import CategoryCreate, CategoryPublic, CategoryUpdate
from app.services.catalog_service import (
    create_category as create_category_service,
    delete_category as delete_category_service,
    get_category_by_id as get_category_by_id_service,
    list_categories as list_categories_service,
    update_category as update_category_service,
)

router = APIRouter(
    prefix="/categories",
    tags=["categories"]
)


@router.get("/", response_model=list[CategoryPublic])
def get_categories(db: Session = Depends(get_db)):
    return list_categories_service(db)


@router.get("/{category_id}", response_model=CategoryPublic)
def get_category(category_id: int, db: Session = Depends(get_db)):
    return get_category_by_id_service(db, category_id)


@router.post("/", response_model=CategoryPublic, status_code=201)
def create_category(
    data: CategoryCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("admin")),
):
    return create_category_service(db, data)


@router.patch("/{category_id}", response_model=CategoryPublic)
def update_category(
    category_id: int,
    data: CategoryUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("admin")),
):
    return update_category_service(db, category_id, data)


@router.delete("/{category_id}", response_model=CategoryPublic)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("admin")),
):
    return delete_category_service(db, category_id)
