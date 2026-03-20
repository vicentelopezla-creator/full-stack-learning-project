# Project Memory

## Fecha de actualizacion

- 2026-03-20

## Estado general

Proyecto full stack para academia online.

- Backend: FastAPI + SQLAlchemy + PostgreSQL
- Frontend: React + Vite + TypeScript
- El flujo de autenticacion y registro ya es funcional de punta a punta
- La documentacion principal quedo actualizada para continuar manana

## Rama de trabajo

- `feature/frontend-types-refactor`

## Lo que ya se hizo

### Backend

- Se dejo `CORS` configurable por entorno.
- Se incorporo configuracion de registro:
  - `REGISTRATION_CODE_EXPIRE_MINUTES`
  - `PRIVACY_CONSENT_VERSION`
  - configuracion SMTP
  - carpeta de debug `BACKEND/tmp/emails`
- Se agrego la tabla `registration_requests`.
- Se creo `app/services/email_service.py`.
- Se actualizo `auth_service.py` para soportar:
  - reto humano firmado,
  - solicitud de codigo de registro,
  - verificacion por codigo,
  - login con compatibilidad para passwords antiguas.
- Se agregaron rutas nuevas en `app/routes/auth.py`:
  - `GET /auth/register/challenge`
  - `POST /auth/register/request-code`
  - `POST /auth/register/verify`
- `POST /users/` ya no es registro publico; ahora queda protegido para admin.
- Se corrigio un bug de fechas en la verificacion del codigo de registro.

### Frontend

- Se rediseño el encabezado para que responda correctamente en escritorio, tablet y movil.
- El drawer lateral del movil ya funciona como capa global y no queda tapado por el body.
- Se creo `src/components/AuthDialog.tsx`.
- `Iniciar sesion` y `Registrate` del encabezado abren un dialogo responsive real.
- El registro ahora funciona en dos pasos:
  - solicitud de codigo,
  - verificacion del email.
- El formulario de registro:
  - reinicia sus campos al cerrar,
  - tiene mejor ancho,
  - mantiene scroll interno si el contenido es alto.
- Cuando el usuario inicia sesion:
  - el encabezado muestra avatar con iniciales,
  - solo se muestra primer nombre + primer apellido,
  - el bloque del usuario despliega un menu con `Cerrar sesion`.
- `src/lib/api.ts` ya devuelve un mensaje de error mas claro cuando el navegador no puede conectar con el backend.

## Archivos clave recientes

### Backend

- `BACKEND/app/core/config.py`
- `BACKEND/app/models/registration_request.py`
- `BACKEND/app/routes/auth.py`
- `BACKEND/app/routes/users.py`
- `BACKEND/app/schemas/auth.py`
- `BACKEND/app/services/auth_service.py`
- `BACKEND/app/services/email_service.py`
- `BACKEND/.env.example`

### Frontend

- `FRONTEND/src/App.tsx`
- `FRONTEND/src/components/AuthDialog.tsx`
- `FRONTEND/src/components/UserPanel.tsx`
- `FRONTEND/src/lib/api.ts`
- `FRONTEND/src/services/auth.ts`
- `FRONTEND/src/types/auth.ts`
- `FRONTEND/src/styles.css`
- `FRONTEND/.env.example`

## Comandos utiles para retomar manana

### Backend

```powershell
cd C:\App\VLANDA\projects_python\full-stack\BACKEND
copy .env.example .env
.\venv\Scripts\activate
python -m app.init_db
uvicorn app.main:app --reload
```

### Frontend

```powershell
cd C:\App\VLANDA\projects_python\full-stack\FRONTEND
copy .env.example .env
npm install
npm run dev
```

### Verificaciones rapidas

- `http://127.0.0.1:8000/health`
- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:5173`

## Notas operativas importantes

- Si no configuras SMTP, el codigo de verificacion no llega a una bandeja real.
- En ese caso debes revisar el ultimo archivo generado en `BACKEND/tmp/emails`.
- Despues de agregar tablas nuevas conviene ejecutar `python -m app.init_db`.
- El backend y el frontend deben seguir usando `http://127.0.0.1:8000` y `http://127.0.0.1:5173` para que CORS siga alineado.

## Punto exacto donde quedamos

La autenticacion ya esta integrada en el encabezado:

- login funcional,
- registro con codigo,
- verificacion del email,
- menu de cuenta con cierre de sesion.

El sistema quedo en un punto estable para pasar al siguiente bloque funcional.

## Siguiente paso natural

1. Convertir `Mi aprendizaje` y `Carrito` en navegacion real.
2. Crear una vista de perfil o cuenta para el usuario autenticado.
3. Añadir mas opciones al menu del perfil:
   - `Mi perfil`
   - `Mis cursos`
   - `Configuracion`
4. Preparar React Router para separar vistas.
