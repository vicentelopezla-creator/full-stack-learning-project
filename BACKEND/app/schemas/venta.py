from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class VentaCreate(BaseModel):
    course_id: int
    progreso: int | None = Field(default=None, ge=0)
    cantidad_v: int | None = Field(default=None, ge=0)


class VentaPublic(VentaCreate):
    id: int
    deleted_at: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class CheckoutResultPublic(BaseModel):
    purchased: list[VentaPublic]
    skipped_course_ids: list[int] = []
