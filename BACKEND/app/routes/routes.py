from fastapi import APIRouter, HTTPException
from app.core.database import SessionLocal
from app.models.carrito import Carrito

router = APIRouter()

@router.get("/cars", tags=["cars"])
def get_cars():
    db = SessionLocal()
    try:
        return db.query(Carrito).all()
    finally:
        db.close()

@router.post("/cars", tags=["cars"])
def create_car(payload: dict):
    db = SessionLocal()
    try:
        new_car = Carrito(
            user_id=payload["user_id"],
            course_id=payload["course_id"],
            cantidad=payload["cantidad"],
        )
        db.add(new_car)
        db.commit()
        db.refresh(new_car)
        return {
            "message": "Carrito creado correctamente",
            "id": new_car.id,
            "user_id": new_car.user_id,
            "course_id": new_car.course_id,
            "cantidad": new_car.cantidad
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()