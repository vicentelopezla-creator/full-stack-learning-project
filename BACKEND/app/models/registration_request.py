from datetime import datetime

from sqlalchemy import BigInteger, String, TIMESTAMP
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class RegistrationRequest(TimestampMixin, Base):
    __tablename__ = "registration_requests"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    surname: Mapped[str | None] = mapped_column(String(100), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    verification_code_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    verification_code_expires_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)
    consent_version: Mapped[str] = mapped_column(String(50), nullable=False)
    consent_accepted_at: Mapped[datetime] = mapped_column(TIMESTAMP, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="pending")
    verified_at: Mapped[datetime | None] = mapped_column(TIMESTAMP, nullable=True)
