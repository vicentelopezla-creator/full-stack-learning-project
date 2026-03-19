from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class VideoCreate(BaseModel):
    course_id: int
    title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1)
    url: str | None = Field(default=None, max_length=255)
    file: str | None = None
    descarga: str | None = None
    seccion: int
    title_accordion: str | None = Field(default=None, max_length=255)


class VideoUpdate(BaseModel):
    course_id: int | None = None
    title: str | None = Field(default=None, min_length=1, max_length=255)
    content: str | None = Field(default=None, min_length=1)
    url: str | None = Field(default=None, max_length=255)
    file: str | None = None
    descarga: str | None = None
    seccion: int | None = None
    title_accordion: str | None = Field(default=None, max_length=255)


class VideoPublic(VideoCreate):
    id: int
    user_id: int
    deleted_at: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
