from sqlalchemy.orm import Session

from app.core.exceptions import AuthenticationError
from app.core.security import (
    create_access_token,
    hash_password,
    is_password_hashed,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse


def login_user(db: Session, payload: LoginRequest) -> TokenResponse:
    user = db.query(User).filter(User.email == payload.email).first()
    if user is None or not verify_password(payload.password, user.password):
        raise AuthenticationError("Invalid email or password.")

    # Temporary compatibility path for legacy plaintext passwords.
    if not is_password_hashed(user.password):
        user.password = hash_password(payload.password)
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token(subject=str(user.id), role=user.role)
    return TokenResponse(access_token=token, user=user)
