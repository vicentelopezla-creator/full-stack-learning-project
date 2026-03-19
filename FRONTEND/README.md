# Frontend base del proyecto

Este frontend fue preparado con una estructura moderna basada en **React + Vite + TypeScript** para consumir tu backend en **FastAPI**.

## Estructura creada

- `package.json`: dependencias y scripts del proyecto.
- `vite.config.ts`: configuracion del servidor de desarrollo.
- `.env.example`: URL base de la API.
- `src/lib/api.ts`: cliente base para hacer peticiones HTTP.
- `src/lib/storage.ts`: manejo del token en `localStorage`.
- `src/services/`: funciones separadas por dominio (`auth`, `catalog`, `video`, `carrito`, `venta`, `me`, `checkbox`, `commentary`, `response`).
- `src/types/`: modelos TypeScript separados por dominio y alineados con tus schemas de FastAPI.
- `src/components/`: componentes reutilizables de interfaz.
- `src/assets/`: imagenes, logos, sonidos y otros recursos importables desde React.
- `src/styles/`: hojas de estilo adicionales del proyecto.
- `src/vendor/`: archivos heredados o de terceros que no forman parte del nucleo del codigo.
- `src/App.tsx`: composicion principal de la aplicacion.

## Estructura sugerida para recursos del curso

Si el curso te entrega carpetas de recursos como `assets1`, `css`, `descargas`, `images`, `js`, `logo` y `sonidos`, la recomendacion es reubicarlas de esta forma:

- `assets1` -> `src/vendor/assets1`
- `css` -> `src/styles/course`
- `descargas` -> `src/assets/images/downloads` o `public/downloads` segun el uso
- `images` -> `src/assets/images/general`
- `js` -> `src/vendor/js`
- `logo` -> `src/assets/images/logos`
- `sonidos` -> `src/assets/audio`

Esto ayuda a separar recursos visuales, estilos, audio y archivos heredados del curso.

## Limpieza aplicada

El `index.html` del proyecto fue limpiado para no cargar por defecto el CSS y JS heredado del template del curso.

Motivo:

- esos archivos todavia referencian imagenes faltantes,
- no forman parte del flujo actual de React,
- y pueden introducir estilos globales o comportamiento inesperado.

Los recursos disponibles y reutilizables quedaron documentados en:

- `src/assets/README.md`

## Flujo actual

1. Al cargar la app se consulta:
   - `/health`
   - `/categories/`
   - `/products/`
2. Si existe un token guardado, tambien se consulta:
   - `/auth/me`
3. El formulario de login consume:
   - `/auth/login`

## Cuando instales Node.js

Ejecuta estos comandos dentro de `FRONTEND`:

```powershell
npm install
npm run dev
```

Si acabas de instalar Node.js y la terminal no reconoce `node` o `npm`, cierra y vuelve a abrir PowerShell. Si el problema sigue, reinicia la sesion de Windows para refrescar el `PATH`.

## Instalaciones necesarias en el equipo

### 1. Node.js

Es obligatorio para ejecutar el frontend con Vite, instalar dependencias y compilar el proyecto.

Pasos:

1. Ir a la web oficial de Node.js.
2. Descargar la version LTS para Windows.
3. Ejecutar el instalador `.msi`.
4. Avanzar con las opciones por defecto.
5. Asegurarse de dejar activada la integracion con `PATH` si aparece.
6. Cerrar y volver a abrir PowerShell.
7. Verificar con `node -v` y `npm -v`.

### 2. Git for Windows

Es muy recomendable para control de versiones, historial de cambios y trabajo ordenado del proyecto.

Pasos:

1. Ir a la web oficial de Git para Windows.
2. Descargar el instalador.
3. Ejecutarlo con las opciones por defecto.
4. Cerrar y volver a abrir la terminal.
5. Verificar con `git --version`.

### 3. Visual Studio Code

Es recomendable para editar el proyecto con extensiones, terminal integrada y depuracion.

Pasos:

1. Ir a la web oficial de Visual Studio Code.
2. Descargar la version para Windows.
3. Ejecutar el instalador.
4. Activar la opcion de agregar `code` al `PATH` si aparece.
5. Abrir una nueva terminal.
6. Verificar con `code --version`.

## Verificacion realizada

Estado verificado en este proyecto:

- `Git` instalado correctamente.
- `Visual Studio Code` instalado correctamente.
- `Node.js` instalado correctamente en `C:\\Program Files\\nodejs\\node.exe`.
- Dependencias del frontend instaladas porque existe `node_modules/` y `package-lock.json`.
- Frontend respondiendo en `http://127.0.0.1:5173` con estado `200`.
- Suite de pruebas del backend ejecutada correctamente: `26 tests OK`.

Observacion importante:

- En esta terminal todavia fue necesario anteponer `C:\\Program Files\\nodejs` al `PATH` para algunos comandos nuevos. Esto suele solucionarse cerrando y reabriendo PowerShell o reiniciando la sesion del sistema.

## URL esperada

El frontend usa por defecto:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Si tu backend corre en otra URL o puerto, cambia ese valor en un archivo `.env`.

## Estado actual del proyecto

- El frontend esta levantado en el puerto `5173`.
- El backend no estaba escuchando en `http://127.0.0.1:8000` en el momento de la ultima verificacion de red.
- Aun asi, el backend si paso su verificacion por pruebas automatizadas.

## Pasos para retomar el proyecto manana

### Frontend

```powershell
cd C:\App\VLANDA\projects_python\full-stack\FRONTEND
npm run dev
```

### Backend

```powershell
cd C:\App\VLANDA\projects_python\full-stack\BACKEND
.\venv\Scripts\activate
uvicorn app.main:app --reload
```

### Verificaciones rapidas

```powershell
git --version
code --version
node -v
npm -v
```
