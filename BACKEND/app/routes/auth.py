from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RegistrationChallengeResponse,
    RegistrationRequestStart,
    RegistrationRequestStartResponse,
    RegistrationVerifyRequest,
    TokenResponse,
)
from app.schemas.user import UserPublic
from app.services.auth_service import (
    create_registration_challenge,
    login_user as login_user_service,
    start_registration,
    verify_registration_code,
)


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    return login_user_service(db, payload)


@router.get("/register/challenge", response_model=RegistrationChallengeResponse)
def get_registration_challenge():
    return create_registration_challenge()


@router.post("/register/request-code", response_model=RegistrationRequestStartResponse)
def request_registration_code(payload: RegistrationRequestStart, db: Session = Depends(get_db)):
    return start_registration(db, payload)


@router.post("/register/verify", response_model=TokenResponse)
def verify_registration(payload: RegistrationVerifyRequest, db: Session = Depends(get_db)):
    return verify_registration_code(db, payload)


@router.get("/me", response_model=UserPublic)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
