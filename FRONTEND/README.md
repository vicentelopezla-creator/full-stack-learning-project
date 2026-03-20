# Frontend base del proyecto

Este frontend usa **React + Vite + TypeScript** y consume el backend en **FastAPI**.

## Estado actual del frontend

La aplicacion ya incluye:

- carga publica de salud, categorias y cursos,
- recuperacion de sesion con token,
- login desde dialogo responsive,
- registro en dos pasos con codigo de verificacion,
- encabezado responsive con drawer para movil,
- bloque de usuario en el header con menu para `Cerrar sesion`.

## Archivos clave

- `.env.example`: URL base de la API.
- `src/App.tsx`: coordinacion principal de estado, header, dialogos y sesion.
- `src/components/AuthDialog.tsx`: login y registro verificado.
- `src/components/UserPanel.tsx`: panel lateral del usuario autenticado.
- `src/lib/api.ts`: cliente base HTTP y manejo de errores.
- `src/lib/storage.ts`: token en `localStorage`.
- `src/services/auth.ts`: login, usuario actual y endpoints de registro.
- `src/types/auth.ts`: contratos TypeScript del flujo de autenticacion.
- `src/styles.css`: layout global, header, dialogo auth y responsive.

## Variables de entorno

Crea `FRONTEND/.env` a partir del ejemplo:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Flujo actual

1. Al arrancar la app se consultan:
   - `/health`
   - `/categories/`
   - `/products/`
2. Si existe un token guardado:
   - se consulta `/auth/me`
   - se consulta el carrito del usuario
3. `Iniciar sesion` usa:
   - `POST /auth/login`
4. `Registrate` usa:
   - `GET /auth/register/challenge`
   - `POST /auth/register/request-code`
   - `POST /auth/register/verify`

## Comandos utiles

```powershell
cd C:\App\VLANDA\projects_python\full-stack\FRONTEND
copy .env.example .env
npm install
npm run dev
```

Compilacion de verificacion:

```powershell
npm run build
```

## Nota sobre el registro

Si el backend no tiene SMTP configurado, el codigo de verificacion no se envia a un correo real. En ese caso debes tomarlo desde:

- `BACKEND/tmp/emails`

## Diseño y responsive

El header fue preparado para comportarse como un sitio comercial real:

- escritorio: header completo en una sola linea,
- tablet: prioriza objetos y oculta acciones secundarias,
- movil: menu lateral izquierdo con la marca arriba y lista de opciones.

El dialogo de autenticacion tambien responde al viewport:

- en escritorio se muestra centrado,
- en pantallas bajas o estrechas hace scroll interno,
- en movil ocupa el ancho completo inferior sin romper el layout.
