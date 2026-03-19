from sqlalchemy import BigInteger, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class Response(TimestampMixin, Base):
    __tablename__ = "responses"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("users.id"), nullable=False)
    commentary_id: Mapped[int] = mapped_column(BigInteger, ForeignKey("commentaries.id"), nullable=False)
    response: Mapped[str | None] = mapped_column(String(100), nullable=True)
    image: Mapped[str | None] = mapped_column(String(255), nullable=True)
    
    user = relationship("User", back_populates="responses")
    commentary = relationship("Commentary", back_populates="responses")
