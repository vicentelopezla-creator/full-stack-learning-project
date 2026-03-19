from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CategoryCreate(BaseModel):
    name: str | None = Field(default=None, max_length=100)


class CategoryUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=100)


class CategoryPublic(CategoryCreate):
    id: int
    deleted_at: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
