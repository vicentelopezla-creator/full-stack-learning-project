# Documentacion explicativa del FRONTEND

## 1. Vision general

Este frontend fue creado como base moderna para consumir tu backend en FastAPI. La idea principal es que tengas una estructura clara, profesional y facil de ampliar mientras avanzas en tu curso de API RESTful.

La base usa:

- React para construir la interfaz.
- Vite para el entorno de desarrollo y empaquetado.
- TypeScript para trabajar con tipos y reducir errores al consumir la API.

El objetivo no fue crear una plantilla vacia, sino dejar una primera version util que ya:

- consulta el estado de la API,
- carga categorias,
- carga cursos,
- permite iniciar sesion,
- recupera la sesion desde un token guardado.

## 2. Por que se eligio React + Vite + TypeScript

### React

React es una opcion moderna, muy extendida y excelente para proyectos que consumen APIs REST. Permite crear componentes reutilizables y escalar desde una pantalla simple hasta una aplicacion completa con paneles, autenticacion y flujos mas complejos.

### Vite

Vite acelera mucho el desarrollo porque inicia rapido y ofrece recarga inmediata durante los cambios. Es una de las herramientas mas recomendadas hoy para proyectos frontend modernos.

### TypeScript

TypeScript ayuda a que el frontend se alinee mejor con los esquemas del backend. Como tu API ya define estructuras claras para usuarios, categorias, cursos y autenticacion, usar tipos en frontend hace que todo sea mas mantenible.

## 3. Estructura general creada

La carpeta `FRONTEND/` contiene estos archivos principales:

- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `.env.example`
- `index.html`
- `README.md`
- `generate_frontend_docx.py`
- `frontend_explicacion.md`
- `frontend_explicacion.docx`

Dentro de `src/` la estructura esta separada por responsabilidades:

- `App.tsx`
- `main.tsx`
- `styles.css`
- `components/`
- `services/`
- `lib/`
- `types/`

## 4. Explicacion archivo por archivo

### `package.json`

Define el proyecto frontend y sus dependencias.

Incluye:

- `react`
- `react-dom`
- `vite`
- `typescript`
- `@vitejs/plugin-react`
- tipos de React

Tambien incluye scripts:

- `npm run dev`
- `npm run build`
- `npm run preview`

Este archivo es la puerta de entrada para instalar dependencias y ejecutar el proyecto.

### `vite.config.ts`

Configura Vite.

En esta base:

- activa el plugin de React,
- define el puerto `5173`,
- habilita acceso por host local.

Se eligio ese puerto porque es el valor comun de Vite y ademas se alineo el backend con CORS para ese origen.

### `.env.example`

Sirve como ejemplo de configuracion para la URL base de la API:

- `VITE_API_BASE_URL=http://127.0.0.1:8000`

Esto evita dejar la URL fija en muchos archivos. Si en el futuro cambias el puerto o despliegas la API en otro entorno, solo tendras que ajustar esta configuracion.

### `index.html`

Es el documento base que carga el frontend. Contiene el nodo `root` donde React monta toda la aplicacion.

### `src/main.tsx`

Es el punto de arranque del frontend.

Su trabajo es:

1. importar React,
2. importar `App.tsx`,
3. importar los estilos globales,
4. montar la aplicacion en el nodo `root`.

### `src/App.tsx`

Es el centro de la aplicacion actual.

Aqui se coordina todo el flujo inicial:

1. consultar `GET /health`,
2. consultar `GET /categories/`,
3. consultar `GET /products/`,
4. recuperar token guardado,
5. consultar `GET /auth/me` si existe token,
6. manejar login desde `POST /auth/login`,
7. mostrar datos en componentes visuales.

Se eligio centralizar la primera version aqui porque te permite entender el flujo completo sin repartir demasiada logica desde el principio.

### `src/styles.css`

Contiene el estilo visual base del frontend.

La interfaz se diseno para que no se vea como una plantilla vacia:

- tarjetas,
- paneles,
- tipografia clara,
- bloques visuales para metricas,
- grid responsive,
- estilo util tanto en escritorio como en movil.

La intencion fue que desde el primer dia el proyecto se sienta como una aplicacion real.

## 5. Carpeta `src/lib/`

### `src/lib/api.ts`

Este archivo concentra la logica base para hacer peticiones HTTP.

Su funcion es:

- leer la URL base desde `VITE_API_BASE_URL`,
- construir la URL final,
- enviar `fetch`,
- adjuntar `Authorization: Bearer ...` cuando haya token,
- manejar errores HTTP de forma centralizada.

Esto evita repetir codigo en cada componente.

### `src/lib/storage.ts`

Se encarga de guardar, leer y eliminar el token del navegador usando `localStorage`.

Esto es importante porque el usuario puede iniciar sesion una vez y mantener la sesion incluso si recarga la pagina.

## 6. Carpeta `src/services/`

Esta carpeta separa la comunicacion con la API por dominio funcional.

### `src/services/auth.ts`

Contiene funciones relacionadas con autenticacion:

- `login()`
- `getCurrentUser()`

De esta manera, los componentes no hacen llamadas HTTP directas con detalles de rutas y headers. Solo invocan funciones de negocio frontend.

### `src/services/catalog.ts`

Contiene funciones publicas para consultar:

- salud del backend,
- categorias,
- cursos.

Esto prepara una base ordenada para seguir agregando servicios despues, por ejemplo carrito, ventas, videos o panel del alumno.

## 7. Carpeta `src/types/`

### `src/types/api.ts`

Aqui se definieron tipos TypeScript inspirados en los esquemas del backend.

Se crearon tipos para:

- `User`
- `LoginRequest`
- `LoginResponse`
- `Category`
- `Course`
- `HealthResponse`

Esto aporta tres ventajas:

1. autocompletado,
2. mayor seguridad al programar,
3. mejor alineacion entre frontend y backend.

## 8. Carpeta `src/components/`

En esta carpeta se crearon componentes reutilizables.

### `LoginForm.tsx`

Muestra el formulario de acceso.

Recibe:

- estado de carga,
- posibles errores,
- funcion para enviar email y password.

Su responsabilidad es solo la interfaz del login.

### `UserPanel.tsx`

Muestra el usuario autenticado y el token parcial cuando la sesion esta activa. Tambien incorpora el boton de cerrar sesion.

### `CategoryList.tsx`

Renderiza las categorias recibidas desde FastAPI.

### `CourseList.tsx`

Renderiza los cursos del endpoint `/products/` y muestra informacion importante como categoria, ventas, descripcion corta y enlace.

### `StatCard.tsx`

Es un componente visual pequeno para mostrar metricas o estados como:

- estado de la API,
- numero de categorias,
- numero de cursos,
- URL base configurada.

Separar estas piezas en componentes hace que el proyecto sea mas legible y mas facil de crecer.

## 9. Flujo funcional actual

Cuando el frontend arranca, ocurre este flujo:

1. React monta `App.tsx`.
2. Se lanzan peticiones publicas a:
   - `/health`
   - `/categories/`
   - `/products/`
3. Si existe un token guardado, se consulta `/auth/me`.
4. Si el usuario usa el formulario de login, se envia la peticion a `/auth/login`.
5. Si el login es correcto:
   - se guarda el token,
   - se actualiza el estado del usuario,
   - el panel de sesion muestra los datos recibidos.
6. Si el token falla, se elimina del almacenamiento local para evitar sesiones rotas.

Este flujo cubre la base minima de una app conectada a una API real.

## 10. Ajuste realizado en el backend

Para que el frontend pueda hablar con FastAPI desde `http://localhost:5173`, se actualizo `BACKEND/app/main.py` agregando `CORSMiddleware`.

Se permitieron estos origenes:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

Sin este cambio, el navegador bloquearia las peticiones del frontend al backend.

## 11. Por que esta base es buena para crecer

Esta base fue pensada para que el siguiente paso sea natural. Desde aqui puedes agregar sin reorganizar todo:

- rutas con React Router,
- pagina de inicio,
- pagina de login separada,
- pagina de cursos,
- detalle de curso,
- carrito,
- checkout,
- panel del alumno,
- panel de administrador,
- consumo de videos,
- progreso de aprendizaje.

La estructura ya esta separada de forma suficiente como para evolucionar con orden.

## 12. Como ejecutar el frontend cuando tengas Node.js

Desde la carpeta `FRONTEND/`:

1. ejecutar `npm install`
2. ejecutar `npm run dev`

Luego abrir la URL que Vite muestre en consola, normalmente:

- `http://localhost:5173`

Y mantener el backend FastAPI levantado en:

- `http://127.0.0.1:8000`

## 13. Instalaciones necesarias en el equipo

Para continuar con el proyecto de manera profesional, se recomienda tener estas herramientas instaladas:

### Node.js

Es obligatorio para ejecutar Vite, instalar dependencias y compilar el frontend.

Paso a paso:

1. Entrar en la web oficial de Node.js.
2. Descargar la version LTS para Windows.
3. Ejecutar el instalador `.msi`.
4. Seguir las opciones por defecto.
5. Confirmar que Node se agregue al `PATH` si el instalador lo ofrece.
6. Cerrar y volver a abrir PowerShell.
7. Verificar con `node -v` y `npm -v`.

### Git for Windows

Es recomendable para control de versiones, historial de cambios y trabajo con ramas.

Paso a paso:

1. Entrar en la web oficial de Git para Windows.
2. Descargar el instalador.
3. Ejecutarlo con las opciones por defecto.
4. Abrir una nueva terminal.
5. Verificar con `git --version`.

### Visual Studio Code

Es recomendable para editar, ejecutar terminal integrada, instalar extensiones y depurar.

Paso a paso:

1. Entrar en la web oficial de Visual Studio Code.
2. Descargar la version para Windows.
3. Ejecutar el instalador.
4. Activar la opcion para agregar `code` al `PATH` si aparece.
5. Abrir una nueva terminal.
6. Verificar con `code --version`.

## 14. Verificacion realizada en el ambiente

Se comprobo lo siguiente:

- `Git` instalado correctamente.
- `Visual Studio Code` instalado correctamente.
- `Node.js` instalado correctamente en `C:\Program Files\nodejs\node.exe`.
- `npm` disponible junto a Node.js.
- `node_modules/` presente en `FRONTEND`, lo que confirma que `npm install` ya fue ejecutado.
- El frontend responde en `http://127.0.0.1:5173` con estado `200`.
- El backend paso sus pruebas automaticas con `26 tests OK`.

Tambien se detecto una observacion importante:

- algunas terminales abiertas antes de instalar Node.js pueden no reconocer `node` o `npm` hasta que se cierren y se vuelvan a abrir.
- en este ambiente fue necesario refrescar temporalmente el `PATH` para ciertos comandos nuevos.

## 15. Estado actual del proyecto

En la ultima verificacion:

- el frontend estaba corriendo en el puerto `5173`,
- el backend no estaba escuchando en `http://127.0.0.1:8000`,
- aun asi el backend se valido correctamente con su suite de pruebas.

Esto significa que el frontend esta vivo, pero para conectar ambos lados necesitas volver a levantar FastAPI si vas a trabajar de forma interactiva.

## 16. Pasos para retomar el proyecto

### Levantar frontend

1. Abrir PowerShell.
2. Ir a la carpeta `FRONTEND`.
3. Ejecutar `npm run dev`.

### Levantar backend

1. Abrir PowerShell.
2. Ir a la carpeta `BACKEND`.
3. Activar el entorno virtual.
4. Ejecutar `uvicorn app.main:app --reload`.

### Verificaciones utiles

- `git --version`
- `code --version`
- `node -v`
- `npm -v`
- `http://127.0.0.1:5173`
- `http://127.0.0.1:8000/health`

## 17. Como actualizar esta documentacion en el futuro

La documentacion fuente esta en:

- `FRONTEND/frontend_explicacion.md`

Y el documento Word se genera con:

- `FRONTEND/generate_frontend_docx.py`

Si en el futuro cambias la arquitectura, agregas nuevas paginas, nuevas rutas o nuevos servicios, solo tienes que:

1. editar el archivo Markdown,
2. ejecutar el script Python,
3. regenerar el `.docx`.

Asi podras mantener una documentacion viva y facil de actualizar.

## 18. Conclusion

El frontend creado no es solo una plantilla de inicio. Es una base practica para una plataforma educativa conectada con FastAPI.

Lo mas importante de entender es esta separacion:

- `components` para interfaz,
- `services` para llamadas a la API,
- `lib` para utilidades base,
- `types` para contratos,
- `App.tsx` como coordinador inicial.

Si entiendes esa estructura, podras extender el proyecto con mucha mas seguridad y orden.
