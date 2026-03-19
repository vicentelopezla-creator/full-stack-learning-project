from sqlalchemy import BigInteger, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Checkbox(TimestampMixin, Base):
    __tablename__ = "checkbox"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False)
    course_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("courses.id"), nullable=False)
    video_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("videos.id"), nullable=False)
    checkbox: Mapped[int] = mapped_column(Integer, nullable=False)
    
    user = relationship("User", back_populates="checkboxes")
    course = relationship("Course", back_populates="checkboxes")
    video = relationship("Video", back_populates="checkboxes")
