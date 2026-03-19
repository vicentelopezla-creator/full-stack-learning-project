from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class CourseBase(BaseModel):
    category_id: int
    name: str | None = Field(default=None, max_length=100)
    detalle: str | None = Field(default=None, max_length=100)
    image: str | None = Field(default=None, max_length=255)
    url: str | None = Field(default=None, max_length=255)
    accordion: int
    precio_ahora: Decimal | None = None
    precio_antes: Decimal | None = None
    num_ventas: int


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    category_id: int | None = None
    name: str | None = Field(default=None, max_length=100)
    detalle: str | None = Field(default=None, max_length=100)
    image: str | None = Field(default=None, max_length=255)
    url: str | None = Field(default=None, max_length=255)
    accordion: int | None = None
    precio_ahora: Decimal | None = None
    precio_antes: Decimal | None = None
    num_ventas: int | None = None


class CoursePublic(CourseBase):
    id: int
    deleted_at: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
