from sqlalchemy import BigInteger, String, Integer, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Video(TimestampMixin, Base):
    __tablename__ = "videos"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False)
    course_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("courses.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    file: Mapped[str | None] = mapped_column(Text, nullable=True)
    descarga: Mapped[str | None] = mapped_column(Text, nullable=True)
    seccion: Mapped[int] = mapped_column(Integer, nullable=False)
    title_accordion: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    user = relationship("User", back_populates="videos")
    course = relationship("Course", back_populates="videos")
    commentaries = relationship("Commentary", back_populates="video")    
    checkboxes = relationship("Checkbox", back_populates="video")
