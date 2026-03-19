from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.venta import CheckoutResultPublic, VentaCreate, VentaPublic
from app.services.commerce_service import (
    checkout_cart as checkout_cart_service,
    create_venta as create_venta_service,
    list_ventas as list_ventas_service,
)

router = APIRouter(
    prefix="/ventas",
    tags=["ventas"]
)


@router.get("/", response_model=list[VentaPublic])
def get_ventas(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_ventas_service(db, current_user)


@router.post("/", response_model=VentaPublic, status_code=201)
def create_venta(
    data: VentaCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_venta_service(db, data, current_user)


@router.post("/checkout", response_model=CheckoutResultPublic)
def checkout_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return checkout_cart_service(db, current_user)
