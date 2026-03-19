from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CommentaryCreate(BaseModel):
    video_id: int
    course_id: int | None = None
    title: str | None = Field(default=None, max_length=100)
    comment: str | None = Field(default=None, max_length=100)
    image: str | None = Field(default=None, max_length=255)


class CommentaryPublic(CommentaryCreate):
    id: int
    deleted_at: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
