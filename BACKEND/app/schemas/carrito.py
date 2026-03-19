from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CarritoCreate(BaseModel):
    course_id: int
    cantidad: int = Field(ge=1)


class CarritoPublic(CarritoCreate):
    id: int
    deleted_at: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
