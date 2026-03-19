from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CheckboxCreate(BaseModel):
    course_id: int
    video_id: int
    checkbox: int = Field(ge=0)


class CheckboxPublic(CheckboxCreate):
    id: int
    deleted_at: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
