# Full Stack Learning Project

Proyecto full stack basado en un curso de API RESTful. El backend fue implementado con Python y FastAPI, y el frontend con React, Vite y TypeScript.

## Estructura del repositorio

- `BACKEND/`: API, modelos, servicios, rutas y pruebas.
- `FRONTEND/`: interfaz web, cliente HTTP y documentacion del frontend.

## Stack principal

- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Frontend: React, Vite, TypeScript
- Herramientas: Git, VS Code, Python 3.12, Node.js LTS

## Arranque rapido

### Backend

```powershell
cd BACKEND
copy .env.example .env
.\venv\Scripts\activate
python run_tests.py
uvicorn app.main:app --reload
```

### Frontend

```powershell
cd FRONTEND
copy .env.example .env
npm install
npm run dev
```

## Documentacion existente

- Backend: [backend_explicacion.md](c:/App/VLANDA/projects_python/full-stack/BACKEND/backend_explicacion.md)
- Frontend: [frontend_explicacion.md](c:/App/VLANDA/projects_python/full-stack/FRONTEND/frontend_explicacion.md)
- Memoria operativa del proyecto: [PROJECT_MEMORY.md](c:/App/VLANDA/projects_python/full-stack/PROJECT_MEMORY.md)

## Flujo de trabajo recomendado

1. Crear una rama por cambio.
2. Mantener `main` estable.
3. Ejecutar pruebas antes de abrir PR.
4. Actualizar documentacion si cambian arquitectura, comandos o seguridad.

Mas detalles en [CONTRIBUTING.md](c:/App/VLANDA/projects_python/full-stack/CONTRIBUTING.md).
