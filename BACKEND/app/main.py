from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import app.models

from app.core.config import settings
from app.core.exceptions import AppError
from app.routes.auth import router as auth_router
from app.routes.me import router as me_router
from app.routes.products import router as products_router
from app.routes.videos import router as videos_router
from app.routes.carrito import router as cars_routes
from app.routes.commentaries import router as commentaries_router
from app.routes.responses import router as responses_router
from app.routes.ventas import router as ventas_router
from app.routes.checkbox import router as checkbox_router
from app.routes.categories import router as categories_router
from app.routes.users import router as users_router


app = FastAPI(title="BACKEND API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppError)
async def handle_app_error(_: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

app.include_router(auth_router)
app.include_router(me_router)
app.include_router(products_router)
app.include_router(videos_router)
app.include_router(cars_routes)
app.include_router(commentaries_router)
app.include_router(responses_router)
app.include_router(ventas_router)
app.include_router(checkbox_router)
app.include_router(categories_router)
app.include_router(users_router)


@app.get("/health")
def health():
    return {"status": "ok"}
