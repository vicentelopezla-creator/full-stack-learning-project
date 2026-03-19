from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.carrito import CarritoCreate, CarritoPublic
from app.services.commerce_service import (
    create_car as create_car_service,
    list_cars as list_cars_service,
)

router = APIRouter(prefix="/cars", tags=["cars"])


@router.get("/", response_model=list[CarritoPublic])
def get_cars(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_cars_service(db, current_user)


@router.post("/", response_model=CarritoPublic, status_code=201)
def create_car(
    payload: CarritoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_car_service(db, payload, current_user)
