from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class UserBase(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    surname: str | None = Field(default=None, max_length=100)
    email: str = Field(min_length=3, max_length=255)
    description: str | None = None
    image: str | None = Field(default=None, max_length=255)
    remember_token: str | None = Field(default=None, max_length=255)


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=255)


class UserPublic(UserBase):
    id: int
    role: str | None = Field(default=None, max_length=20)
    deleted_at: datetime | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)
