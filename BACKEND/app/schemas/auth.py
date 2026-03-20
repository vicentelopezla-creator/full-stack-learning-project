from pydantic import BaseModel, Field

from app.schemas.user import UserPublic


class LoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=1, max_length=255)


class RegistrationChallengeResponse(BaseModel):
    challenge_token: str
    question: str


class RegistrationRequestStart(BaseModel):
    name: str = Field(min_length=1, max_length=50)
    surname: str | None = Field(default=None, max_length=100)
    email: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=8, max_length=255)
    consent_accepted: bool
    consent_version: str = Field(min_length=1, max_length=50)
    human_challenge_token: str = Field(min_length=10, max_length=1024)
    human_challenge_answer: str = Field(min_length=1, max_length=20)


class RegistrationRequestStartResponse(BaseModel):
    email: str
    expires_in_seconds: int
    detail: str


class RegistrationVerifyRequest(BaseModel):
    email: str = Field(min_length=3, max_length=255)
    code: str = Field(min_length=4, max_length=12)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic
