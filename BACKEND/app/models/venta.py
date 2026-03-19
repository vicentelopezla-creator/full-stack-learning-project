from sqlalchemy import BigInteger, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Venta(TimestampMixin, Base):
    __tablename__ = "ventas"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False)
    course_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("courses.id"), nullable=False)
    progreso: Mapped[int | None] = mapped_column(Integer, nullable=True)
    cantidad_v: Mapped[int | None] = mapped_column(Integer, nullable=True)

    user = relationship("User", back_populates="ventas")
    course = relationship("Course", back_populates="ventas")
