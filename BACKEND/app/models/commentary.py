from sqlalchemy import BigInteger, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Commentary(TimestampMixin, Base):
    __tablename__ = "commentaries"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False)
    video_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("videos.id"), nullable=False)
    course_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("courses.id"), nullable=True)
    title: Mapped[str | None] = mapped_column(String(100), nullable=True)
    comment: Mapped[str | None] = mapped_column(String(100), nullable=True)
    image: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    user = relationship("User", back_populates="commentaries")
    video = relationship("Video", back_populates="commentaries")
    course = relationship("Course", back_populates="commentaries")
    responses = relationship("Response", back_populates="commentary")
    
