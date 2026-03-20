import base64
import hashlib
import hmac
import json
import secrets
import time
from datetime import datetime, timedelta

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.exceptions import AppError, AuthenticationError, ConflictError, NotFoundError
from app.core.security import (
    create_access_token,
    hash_password,
    is_password_hashed,
    verify_password,
)
from app.models.registration_request import RegistrationRequest
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RegistrationChallengeResponse,
    RegistrationRequestStart,
    RegistrationRequestStartResponse,
    RegistrationVerifyRequest,
    TokenResponse,
)
from app.services.email_service import send_email


HUMAN_CHALLENGE_EXPIRE_SECONDS = 10 * 60


def _normalize_email(value: str) -> str:
    return value.strip().lower()


def _utcnow() -> datetime:
    return datetime.utcnow()


def _b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("utf-8")


def _b64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode((value + padding).encode("utf-8"))


def _create_signed_payload(payload: dict[str, str | int]) -> str:
    payload_segment = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signature = hmac.new(
        settings.secret_key.encode("utf-8"),
        payload_segment.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    signature_segment = _b64url_encode(signature)
    return f"{payload_segment}.{signature_segment}"


def _decode_signed_payload(token: str) -> dict[str, str | int] | None:
    try:
        payload_segment, signature_segment = token.split(".", 1)
        expected_signature = hmac.new(
            settings.secret_key.encode("utf-8"),
            payload_segment.encode("utf-8"),
            hashlib.sha256,
        ).digest()
        provided_signature = _b64url_decode(signature_segment)
        if not hmac.compare_digest(expected_signature, provided_signature):
            return None

        payload = json.loads(_b64url_decode(payload_segment).decode("utf-8"))
        if payload.get("exp", 0) < int(time.time()):
            return None

        return payload
    except (ValueError, json.JSONDecodeError, TypeError):
        return None


def _create_human_challenge() -> RegistrationChallengeResponse:
    left = secrets.randbelow(8) + 2
    right = secrets.randbelow(7) + 1
    answer = left + right
    payload = {
        "type": "human_challenge",
        "answer": answer,
        "exp": int(time.time()) + HUMAN_CHALLENGE_EXPIRE_SECONDS,
    }
    token = _create_signed_payload(payload)
    question = f"Cuanto es {left} + {right}?"
    return RegistrationChallengeResponse(challenge_token=token, question=question)


def create_registration_challenge() -> RegistrationChallengeResponse:
    return _create_human_challenge()


def _ensure_human_verified(token: str, answer: str) -> None:
    payload = _decode_signed_payload(token)
    if payload is None or payload.get("type") != "human_challenge":
        raise AppError("La verificacion humana ya no es valida. Intentalo de nuevo.")

    expected_answer = str(payload.get("answer", "")).strip()
    if expected_answer != answer.strip():
        raise AppError("La verificacion humana no es correcta.")


def _build_registration_email(*, name: str, code: str) -> str:
    return (
        f"Hola {name},\n\n"
        "Recibimos tu solicitud de registro en Vicenweb Academy.\n"
        f"Tu codigo de verificacion es: {code}\n\n"
        f"Este codigo caduca en {settings.registration_code_expire_minutes} minutos.\n"
        "Si no solicitaste este registro, puedes ignorar este mensaje.\n"
    )


def _create_or_update_registration_request(
    db: Session,
    payload: RegistrationRequestStart,
) -> tuple[RegistrationRequest, str]:
    email = _normalize_email(payload.email)
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user is not None:
        raise ConflictError("Ya existe un usuario registrado con este email.")

    code = f"{secrets.randbelow(1_000_000):06d}"
    now = _utcnow()
    expires_at = now + timedelta(minutes=settings.registration_code_expire_minutes)
    request = db.query(RegistrationRequest).filter(RegistrationRequest.email == email).first()

    if request is None:
        request = RegistrationRequest(
            name=payload.name.strip(),
            surname=payload.surname.strip() if payload.surname else None,
            email=email,
            password_hash=hash_password(payload.password),
            verification_code_hash=hash_password(code),
            verification_code_expires_at=expires_at,
            consent_version=payload.consent_version.strip(),
            consent_accepted_at=now,
            status="pending",
            verified_at=None,
        )
        db.add(request)
    else:
        request.name = payload.name.strip()
        request.surname = payload.surname.strip() if payload.surname else None
        request.password_hash = hash_password(payload.password)
        request.verification_code_hash = hash_password(code)
        request.verification_code_expires_at = expires_at
        request.consent_version = payload.consent_version.strip()
        request.consent_accepted_at = now
        request.status = "pending"
        request.verified_at = None

    db.commit()
    db.refresh(request)
    return request, code


def start_registration(
    db: Session,
    payload: RegistrationRequestStart,
) -> RegistrationRequestStartResponse:
    if not payload.consent_accepted:
        raise AppError("Debes aceptar el tratamiento de datos para continuar.")

    _ensure_human_verified(payload.human_challenge_token, payload.human_challenge_answer)

    request, code = _create_or_update_registration_request(db, payload)
    send_email(
        to_email=request.email,
        subject="Codigo de verificacion de Vicenweb Academy",
        body_text=_build_registration_email(name=request.name, code=code),
    )

    return RegistrationRequestStartResponse(
        email=request.email,
        expires_in_seconds=settings.registration_code_expire_minutes * 60,
        detail="Hemos enviado un codigo de verificacion al email indicado.",
    )


def verify_registration_code(db: Session, payload: RegistrationVerifyRequest) -> TokenResponse:
    email = _normalize_email(payload.email)
    request = db.query(RegistrationRequest).filter(RegistrationRequest.email == email).first()
    if request is None or request.status != "pending":
        raise NotFoundError("No existe un registro pendiente para este email.")

    if request.verification_code_expires_at < _utcnow():
        raise AppError("El codigo de verificacion ha caducado. Solicita uno nuevo.")

    if not verify_password(payload.code.strip(), request.verification_code_hash):
        raise AuthenticationError("El codigo de verificacion no es valido.")

    user = User(
        name=request.name,
        surname=request.surname,
        role="student",
        email=request.email,
        password=request.password_hash,
        description=None,
        image=None,
        remember_token=None,
    )
    db.add(user)
    db.flush()

    request.status = "completed"
    request.verified_at = _utcnow()
    db.add(request)
    db.commit()
    db.refresh(user)

    token = create_access_token(subject=str(user.id), role=user.role)
    return TokenResponse(access_token=token, user=user)


def login_user(db: Session, payload: LoginRequest) -> TokenResponse:
    user = db.query(User).filter(User.email == _normalize_email(payload.email)).first()
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
