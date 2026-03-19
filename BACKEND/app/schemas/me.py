from pydantic import BaseModel, Field

from app.schemas.course import CoursePublic


class PurchasedCoursePublic(BaseModel):
    venta_id: int
    course_id: int
    name: str | None = None
    detalle: str | None = None
    image: str | None = None
    progreso: int = Field(default=0, ge=0, le=100)
    cantidad_v: int = Field(default=0, ge=0)


class VideoProgressPublic(BaseModel):
    id: int
    title: str
    content: str
    seccion: int
    title_accordion: str | None = None
    url: str | None = None
    file: str | None = None
    descarga: str | None = None
    completed: bool = False


class CourseContentPublic(BaseModel):
    course: CoursePublic
    videos: list[VideoProgressPublic]
    progreso: int = Field(default=0, ge=0, le=100)
    cantidad_v: int = Field(default=0, ge=0)
    total_videos: int = Field(default=0, ge=0)
