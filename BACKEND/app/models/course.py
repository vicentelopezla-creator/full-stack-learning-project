from sqlalchemy import BigInteger, String, Integer, Numeric, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from decimal import Decimal

from app.models.base import Base, TimestampMixin


class Course(TimestampMixin, Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    category_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("categories.id"), nullable=False)
    name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    detalle: Mapped[str | None] = mapped_column(String(100), nullable=True)
    image: Mapped[str | None] = mapped_column(String(255), nullable=True)
    url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    accordion: Mapped[int] = mapped_column(Integer, nullable=False)
    precio_ahora: Mapped[Decimal | None] = mapped_column(Numeric(7, 2), nullable=True)
    precio_antes: Mapped[Decimal | None] = mapped_column(Numeric(7, 2), nullable=True)
    num_ventas: Mapped[int] = mapped_column(Integer, nullable=False)
    
    category = relationship("Category", back_populates="courses")
    videos = relationship("Video", back_populates="course")
    carritos = relationship("Carrito", back_populates="course")
    ventas = relationship("Venta", back_populates="course")
    checkboxes = relationship("Checkbox", back_populates="course")
    commentaries = relationship("Commentary", back_populates="course")
