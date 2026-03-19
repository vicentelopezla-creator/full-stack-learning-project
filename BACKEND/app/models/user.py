from sqlalchemy import BigInteger, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class User(TimestampMixin, Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    surname: Mapped[str | None] = mapped_column(String(100), nullable=True)
    role: Mapped[str | None] = mapped_column(String(20), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image: Mapped[str | None] = mapped_column(String(255), nullable=True)
    remember_token: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    videos = relationship("Video", back_populates="user")
    carritos = relationship("Carrito", back_populates="user")
    ventas = relationship("Venta", back_populates="user")
    commentaries = relationship("Commentary", back_populates="user")
    responses = relationship("Response", back_populates="user")
    checkboxes = relationship("Checkbox", back_populates="user")
