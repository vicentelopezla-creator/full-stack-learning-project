# Project Memory

## Estado general

Proyecto full stack basado en curso de API RESTful.

- Backend: FastAPI + SQLAlchemy + PostgreSQL
- Frontend: React + Vite + TypeScript
- Repositorio Git inicializado y conectado a GitHub
- Rama principal protegida en GitHub con PR y checks `backend` y `frontend`

## Rama de trabajo actual

- `feature/frontend-types-refactor`

## Lo que ya se hizo

### Backend

- Se agrego `CORS` configurable por entorno.
- Se agrego validacion basica de uploads de video.
- Se creo `BACKEND/.env.example`.
- Se dejo documentacion de colaboracion y seguridad en la raiz del repo.

### Frontend

- Se creo la base React + Vite + TypeScript.
- Se conecto con FastAPI usando `src/lib/api.ts`.
- Se implemento login y recuperacion de sesion.
- Se separaron todos los modelos TypeScript por dominio en `src/types/`.
- Se crearon servicios por dominio en `src/services/`.
- Se organizo la carpeta de assets.
- Se revisaron los assets heredados del curso y se decidio no cargar globalmente el template CSS heredado.
- Se rediseño el encabezado:
  - branding arriba a la izquierda,
  - segunda fila con categorias, busqueda, aprendizaje, carrito y acceso de sesion,
  - contador real del carrito si existe token.

## Decisiones importantes

1. La fuente de verdad para modelos del frontend son los `schemas` y rutas del backend, no directamente la base de datos.
2. Los tipos del frontend se separan por dominio, no en un solo archivo global.
3. Los componentes no deben hacer `fetch` directo cuando ya exista un servicio.
4. Los assets heredados del curso solo se integraran de forma selectiva.
5. El CSS heredado del template no debe cargarse globalmente mientras tenga rutas rotas o comportamiento no controlado.

## Recursos ya identificados

### Assets utiles confirmados

- `FRONTEND/src/assets/images/`
- `FRONTEND/src/assets/images/ecommerce/checkout/`
- `FRONTEND/src/assets/sonidos/`

### Assets heredados

- `FRONTEND/src/assets/assets1/`

Este material existe como apoyo, pero no se carga automaticamente en `index.html`.

## Servicios disponibles en frontend

- `auth`
- `catalog`
- `video`
- `carrito`
- `venta`
- `me`
- `checkbox`
- `commentary`
- `response`

## Modelos disponibles en frontend

- `auth`
- `user`
- `category`
- `course`
- `video`
- `carrito`
- `venta`
- `checkbox`
- `commentary`
- `response`
- `me`
- `health`

## Comandos utiles

### Backend

```powershell
cd C:\App\VLANDA\projects_python\full-stack\BACKEND
.\venv\Scripts\activate
python run_tests.py
uvicorn app.main:app --reload
```

### Frontend

```powershell
cd C:\App\VLANDA\projects_python\full-stack\FRONTEND
npm run dev
npm run build
```

## Proximo paso natural

Conectar visualmente el encabezado con navegacion real:

- `Mi aprendizaje`
- `Carrito`
- `Iniciar sesion`
- `Registrate`

y despues avanzar hacia React Router y vistas separadas.
