from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.deps import get_current_user, get_db, require_roles
from app.models.user import User
from app.schemas.video import VideoCreate, VideoPublic, VideoUpdate
from app.services.catalog_service import (
    create_video as create_video_service,
    delete_video as delete_video_service,
    get_video_file_path as get_video_file_path_service,
    get_video_by_id as get_video_by_id_service,
    list_videos as list_videos_service,
    upload_video_file as upload_video_file_service,
    update_video as update_video_service,
)

router = APIRouter(prefix="/videos", tags=["videos"])


def validate_upload(file: UploadFile, file_content: bytes) -> None:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in settings.allowed_upload_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unsupported file extension. Allowed values: "
                + ", ".join(settings.allowed_upload_extensions)
            ),
        )

    if file.content_type not in settings.allowed_upload_content_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Unsupported file content type. Allowed values: "
                + ", ".join(settings.allowed_upload_content_types)
            ),
        )

    if len(file_content) > settings.max_upload_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=(
                "File is too large. Max size is "
                f"{settings.max_upload_size_bytes} bytes."
            ),
        )


@router.get("/", response_model=list[VideoPublic])
def get_videos(
    course_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_videos_service(db, current_user, course_id)


@router.get("/{video_id}", response_model=VideoPublic)
def get_video(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_video_by_id_service(db, video_id, current_user)


@router.post("/", response_model=VideoPublic, status_code=201)
def create_video(
    payload: VideoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    return create_video_service(db, payload, current_user)


@router.post("/upload", response_model=VideoPublic, status_code=201)
async def upload_video(
    course_id: int = Form(...),
    title: str = Form(...),
    content: str = Form(...),
    seccion: int = Form(...),
    url: str | None = Form(default=None),
    descarga: str | None = Form(default=None),
    title_accordion: str | None = Form(default=None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("admin")),
):
    payload = VideoCreate(
        course_id=course_id,
        title=title,
        content=content,
        url=url,
        file=None,
        descarga=descarga,
        seccion=seccion,
        title_accordion=title_accordion,
    )
    file_content = await file.read()
    validate_upload(file, file_content)
    return upload_video_file_service(
        db,
        current_user,
        payload,
        file.filename or "video.bin",
        file_content,
    )


@router.patch("/{video_id}", response_model=VideoPublic)
def update_video(
    video_id: int,
    payload: VideoUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("admin")),
):
    return update_video_service(db, video_id, payload)


@router.delete("/{video_id}", response_model=VideoPublic)
def delete_video(
    video_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles("admin")),
):
    return delete_video_service(db, video_id)


@router.get("/{video_id}/file")
def get_video_file(
    video_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    file_path = get_video_file_path_service(db, video_id, current_user)
    return FileResponse(file_path)
