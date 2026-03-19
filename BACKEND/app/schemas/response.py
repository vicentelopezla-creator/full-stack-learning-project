from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ResponseCreate(BaseModel):
    commentary_id: int
    response: str | None = Field(default=None, max_length=100)
    image: str | None = Field(default=None, max_length=255)


class ResponsePublic(ResponseCreate):
    id: int
    deleted_at: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
