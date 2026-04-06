# Full Stack Learning Project

Proyecto full stack para una plataforma educativa con backend en FastAPI y frontend en React + Vite + TypeScript.

## Estado actual

- Backend con autenticacion por token, validacion de sesion, carrito, cursos, categorias, videos y flujo de registro verificado por email.
- Frontend con encabezado responsive, menu lateral para movil, login, registro en dos pasos y bloque de usuario con menu para cerrar sesion.
- El frontend ya fue refactorizado para dejar `App.tsx` como coordinador y mover navegacion y layout a componentes dedicados.
- Si no se configura SMTP, los codigos de verificacion del registro se guardan como vista previa en `BACKEND/tmp/emails`.

## Estructura del repositorio

- `BACKEND/`: API, modelos, servicios, rutas y pruebas.
- `FRONTEND/`: interfaz web, cliente HTTP, componentes y documentacion del frontend.
- `PROJECT_MEMORY.md`: memoria operativa para retomar el trabajo rapidamente.

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
python -m app.init_db
python run_tests.py
uvicorn app.main:app --reload
```

Notas:

- `python run_tests.py` es recomendable, pero si solo quieres levantar la API puedes omitirlo.
- `python -m app.init_db` es importante cuando agregamos tablas nuevas, por ejemplo `registration_requests`.

### Frontend

```powershell
cd FRONTEND
copy .env.example .env
npm install
npm run dev
```

## Flujo actual de autenticacion

1. `Iniciar sesion` abre un dialogo responsive.
2. `Registrate` abre un flujo en dos pasos:
   - solicitud de codigo con consentimiento de datos y verificacion humana,
   - verificacion del codigo enviado al email.
3. Si el usuario inicia sesion correctamente:
   - el encabezado muestra sus iniciales,
   - se presenta primer nombre + primer apellido,
   - el bloque del usuario despliega un menu con `Cerrar sesion`.

## Estado de retomada

- La rama de trabajo actual es `feature/frontend-types-refactor`.
- El refactor del frontend y su documentacion quedaron verificados y sincronizados con GitHub.
- Si quieres retomar rapido el contexto operativo, revisa primero [PROJECT_MEMORY.md](c:/App/VLANDA/projects_python/full-stack/PROJECT_MEMORY.md).

## Documentacion disponible

- Backend: [backend_explicacion.md](c:/App/VLANDA/projects_python/full-stack/BACKEND/backend_explicacion.md)
- Frontend: [frontend_explicacion.md](c:/App/VLANDA/projects_python/full-stack/FRONTEND/frontend_explicacion.md)
- Memoria operativa: [PROJECT_MEMORY.md](c:/App/VLANDA/projects_python/full-stack/PROJECT_MEMORY.md)
- Guia de colaboracion: [CONTRIBUTING.md](c:/App/VLANDA/projects_python/full-stack/CONTRIBUTING.md)
- Seguridad: [SECURITY.md](c:/App/VLANDA/projects_python/full-stack/SECURITY.md)

## Preparado para GitHub

Para no subir archivos temporales o de depuracion:

- los previews de email deben quedar fuera de Git,
- los temporales de Word no deben versionarse,
- el `.env` real no debe subirse.
