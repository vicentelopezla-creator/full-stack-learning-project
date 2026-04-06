# Guia didactica del FRONTEND

## 1. Objetivo de este documento

Este documento explica el `FRONTEND` como si estuvieramos en una clase:

- que carpeta y archivo existe,
- para que sirve,
- por que existe,
- que parte participa hoy en la pantalla actual,
- y cual es el flujo real desde que abres `http://127.0.0.1:5173` hasta que interactuas con la interfaz.

La idea no es solo describir archivos. La idea es ayudarte a pensar como desarrollador frontend.

## 2. La idea central que debes entender primero

Antes de leer archivo por archivo, quedate con esta idea:

1. `main.tsx` arranca React.
2. `App.tsx` coordina casi toda la aplicacion actual.
3. `components/` pinta interfaz reutilizable.
4. `services/` habla con el backend.
5. `lib/` guarda utilidades compartidas.
6. `types/` define la forma de los datos.
7. `styles.css` da el aspecto visual y responsive.

Si entiendes esa separacion, ya tienes la mitad del proyecto dominada.

## 2.5. Refactor reciente de estructura

En esta iteracion se hizo un refactor importante para que `App.tsx` dejara de ser un archivo "todo en uno".

Los cambios clave fueron:

- `App.tsx` ahora coordina estado, efectos y flujo de autenticacion.
- `Topbar.tsx` concentra el header, el menu de perfil y el drawer movil.
- `CatalogFilters.tsx` reutiliza filtro y busqueda en escritorio y movil.
- `AcademyBrand.tsx` evita duplicar logo y copy de marca.
- `HeroSection.tsx` y `AppFooter.tsx` sacan bloques grandes de presentacion fuera del componente raiz.
- `lib/user.ts` encapsula nombre visible e iniciales del usuario.

Por que este cambio es importante:

- reduce el tamano mental de `App.tsx`,
- evita que header y drawer diverjan con el tiempo,
- facilita introducir `React Router` mas adelante,
- deja una arquitectura mas clara para GitHub y colaboracion.

## 3. Regla mental mas importante

El flujo de datos principal del proyecto es este:

```text
Usuario -> evento en la UI -> handler en App.tsx -> servicio -> apiRequest -> backend
backend -> respuesta JSON -> setState en App.tsx -> React re-renderiza -> UI actualizada
```

Esto es lo mas importante que debes aprender del frontend actual.

## 4. Mapa rapido del proyecto

```text
FRONTEND/
|-- dist/
|-- node_modules/
|-- public/
|-- src/
|   |-- App.tsx
|   |-- main.tsx
|   |-- styles.css
|   |-- vite-env.d.ts
|   |-- assets/
|   |-- components/
|   |-- lib/
|   |-- services/
|   |-- styles/
|   |-- types/
|   `-- vendor/
|-- .env
|-- .env.example
|-- .prettierignore
|-- .prettierrc.json
|-- eslint.config.js
|-- frontend_explicacion.docx
|-- frontend_explicacion.md
|-- generate_frontend_docx.py
|-- index.html
|-- package-lock.json
|-- package.json
|-- README.md
|-- tsconfig.app.json
|-- tsconfig.app.tsbuildinfo
|-- tsconfig.json
|-- tsconfig.node.json
|-- tsconfig.node.tsbuildinfo
|-- vite.config.d.ts
|-- vite.config.js
`-- vite.config.ts
```

## 5. Que archivos son fuente de verdad y cuales no

No todos los archivos tienen la misma importancia.

### Fuente de verdad principal

- `src/App.tsx`
- `src/main.tsx`
- `src/styles.css`
- `src/components/*`
- `src/lib/*`
- `src/services/*`
- `src/types/*`
- `package.json`
- `vite.config.ts`
- `tsconfig*.json`
- `.env`
- `.env.example`

### Archivos generados o auxiliares

- `dist/`
- `node_modules/`
- `tsconfig.app.tsbuildinfo`
- `tsconfig.node.tsbuildinfo`
- `vite.config.js`
- `vite.config.d.ts`
- `frontend_explicacion.docx`

### Lo mas importante a tomar en cuenta

- Cuando estudies el funcionamiento, enfocate primero en `src/`.
- `dist/` no es el codigo que editas.
- `node_modules/` no se toca salvo casos muy especiales.
- En desarrollo, Vite sirve el proyecto directamente desde `src/`; no usa `dist/`.

## 6. Explicacion de cada carpeta y archivo en la raiz

### `dist/`

Es la salida de `npm run build`.

Para que sirve:

- guarda el frontend ya compilado para produccion.

Por que existe:

- Vite necesita generar una version empaquetada del proyecto.

Importante:

- cuando abres `http://127.0.0.1:5173`, normalmente NO se esta usando `dist/`;
- Vite sirve el codigo fuente en caliente.

### `node_modules/`

Es la carpeta donde `npm install` guarda las dependencias.

Para que sirve:

- contiene React, Vite, TypeScript, ESLint y todas las librerias instaladas.

Por que existe:

- el proyecto no puede ejecutarse sin esas dependencias.

Importante:

- no debes estudiar la arquitectura del proyecto dentro de `node_modules/`;
- debes estudiar tu codigo, no el de terceros.

### `public/`

Hoy solo contiene `.gitkeep`.

Para que sirve:

- Vite usa `public/` para archivos estaticos que quieres servir tal cual.

Por que existe:

- deja preparado el proyecto para favicons, manifiestos o archivos estaticos futuros.

### `.env`

Es la configuracion real del frontend en tu maquina.

Para que sirve:

- define `VITE_API_BASE_URL`.

Por que existe:

- evita escribir la URL del backend de forma fija en muchos archivos.

### `.env.example`

Es la plantilla publica del `.env`.

Para que sirve:

- muestra que variable necesita el frontend.

Por que existe:

- facilita clonar el proyecto y configurarlo rapido.

### `.prettierignore`

Le dice a Prettier que no debe formatear.

### `.prettierrc.json`

Define reglas de formato automatico.

### `eslint.config.js`

Configura ESLint.

Para que sirve:

- ayuda a detectar errores y malas practicas en TypeScript y React.

Importante:

- ignora `dist`, `node_modules`, `src/assets` y `*.tsbuildinfo`;
- esto tiene sentido porque `src/assets` contiene muchos recursos heredados y no codigo TS/TSX.

### `frontend_explicacion.md`

Es este documento.

Para que sirve:

- documentar la arquitectura y el flujo del frontend.

### `frontend_explicacion.docx`

Es la version Word generada desde el Markdown.

Importante:

- no es la fuente principal;
- la fuente principal es `frontend_explicacion.md`.

### `generate_frontend_docx.py`

Script que convierte el Markdown en `.docx`.

Para que sirve:

- automatiza la generacion del documento Word.

Por que existe:

- evita tener que mantener dos documentos a mano.

### `index.html`

Es el HTML base de entrada.

Para que sirve:

- contiene el elemento `root` donde React monta toda la app.

Lo mas importante:

- aqui no esta la pagina completa;
- aqui solo esta el contenedor donde React va a dibujar la interfaz.

### `package-lock.json`

Bloquea las versiones exactas de dependencias instaladas.

Para que sirve:

- garantiza instalaciones mas consistentes entre equipos.

### `package.json`

Es el manifiesto del frontend.

Para que sirve:

- define nombre del proyecto,
- dependencias,
- devDependencies,
- scripts de trabajo.

Lo mas importante:

- `npm run dev` levanta Vite,
- `npm run build` compila,
- `npm run preview` prueba la build,
- `npm run lint` revisa el codigo,
- `npm run format` formatea.

Detalle clave:

- hoy NO aparece `react-router-dom`, por eso la aplicacion actual no tiene navegacion por rutas reales.

### `README.md`

Guia breve para levantar el frontend y recordar el flujo actual.

### `tsconfig.json`

Archivo maestro de TypeScript.

Para que sirve:

- referencia configuraciones separadas para app y entorno de Node.

### `tsconfig.app.json`

Configuracion TypeScript para el codigo de `src`.

Lo mas importante:

- `strict: true` obliga a programar con mas seguridad;
- `jsx: react-jsx` permite TSX moderno;
- `noEmit: true` indica que aqui solo se valida tipo, no se emite JS final.

### `tsconfig.node.json`

Configuracion TypeScript para archivos de entorno Node como `vite.config.ts`.

### `tsconfig.app.tsbuildinfo`

Cache incremental de TypeScript para la app.

### `tsconfig.node.tsbuildinfo`

Cache incremental de TypeScript para la parte de Node.

### `vite.config.ts`

Es la configuracion principal de Vite.

Para que sirve:

- activa el plugin de React,
- define host,
- define puerto `5173`.

### `vite.config.js`

Version JavaScript generada o derivada de la configuracion.

### `vite.config.d.ts`

Archivo de tipos asociado a la configuracion.

Importante:

- normalmente debes editar `vite.config.ts`, no estas salidas auxiliares.

## 7. Explicacion de la carpeta `src/`

`src/` es el corazon real del frontend.

### `src/main.tsx`

Es el punto de entrada de React.

Hace cuatro cosas:

1. importa React,
2. importa `App`,
3. importa `styles.css`,
4. monta la app dentro de `#root`.

Detalle muy importante:

- `App` esta envuelto en `React.StrictMode`.

Esto significa que en desarrollo React puede ejecutar ciertos ciclos mas de una vez para ayudarte a detectar efectos secundarios inseguros.

Aprendizaje clave:

- si ves dobles peticiones en desarrollo, no siempre significa un bug del backend;
- a veces estas viendo el efecto de `StrictMode`.

### `src/App.tsx`

Es el coordinador central de la aplicacion actual.

Esta es, sin duda, la pieza que mas debes estudiar.

#### Que hace `App.tsx`

- carga datos publicos,
- recupera sesion,
- consulta carrito,
- maneja login,
- maneja registro con codigo,
- controla estados globales de navegacion y overlays,
- filtra cursos por categoria y busqueda,
- reparte datos a componentes como `Topbar`, `HeroSection`, `AuthDialog` y el contenido principal.

#### Por que esta tanta logica aqui

Porque el proyecto todavia esta en una etapa de una sola pantalla principal.

No hay router todavia, asi que `App.tsx` funciona como:

- coordinador de estado,
- shell principal de la pantalla,
- y punto de integracion entre servicios y componentes.

Detalle importante:

- despues del refactor, `App.tsx` ya no contiene el marcado grande del header, el drawer y el hero;
- ahora esos bloques viven en componentes dedicados.

#### Grupos de estado mas importantes dentro de `App.tsx`

Estado de datos:

- `healthStatus`
- `catalogError`
- `categories`
- `courses`
- `loadingCatalog`

Estado de sesion:

- `user`
- `token`
- `loggingIn`
- `loginError`
- `sessionError`

Estado del encabezado y navegacion local:

- `selectedCategoryId`
- `searchDraft`
- `searchTerm`
- `cartCount`
- `isMenuOpen`
- `isAuthDialogOpen`
- `isProfileMenuOpen`

Estado del registro:

- `authDialogMode`
- `registering`
- `registrationError`
- `registrationMessage`
- `registrationChallenge`
- `pendingRegistrationEmail`

Estado de referencias:

- `profileMenuRef`

#### Dos detalles muy didacticos que debes aprender aqui

`searchDraft` vs `searchTerm`:

- `searchDraft` guarda lo que el usuario escribe;
- `searchTerm` se actualiza cuando el usuario envia el formulario.

Eso ensena una tecnica comun: separar el texto tecleado del filtro ya confirmado.

`user` y `token`:

- `token` representa autenticacion tecnica;
- `user` representa la identidad cargada desde backend.

No son exactamente lo mismo, y esa diferencia es importante.

### `src/styles.css`

Es la hoja de estilos global principal.

Para que sirve:

- da forma al layout,
- define el header,
- define el drawer,
- define el dialogo de autenticacion,
- define la grilla del contenido,
- define responsive.

Importante:

- hoy la UI principal depende de este archivo;
- el CSS heredado del template no esta cargado globalmente por defecto.

### `src/vite-env.d.ts`

Es un archivo pequeno pero importante.

Para que sirve:

- le dice a TypeScript que entienda los tipos de Vite, incluyendo `import.meta.env`.

## 8. Explicacion de `src/components/`

La carpeta `components/` contiene piezas visuales reutilizables.

Piensa asi:

- `App.tsx` decide y coordina,
- los componentes muestran y emiten eventos.

### `components/Topbar.tsx`

Es el componente que concentra la navegacion principal.

Para que sirve:

- renderizar el header de escritorio,
- renderizar el drawer movil,
- mostrar buscador, filtro, carrito y bloque de usuario.

Por que existe:

- evita que `App.tsx` mezcle logica con mucho marcado visual,
- mantiene en un solo sitio la navegacion responsive.

### `components/CatalogFilters.tsx`

Extrae el filtro de categorias y la busqueda del catalogo.

Para que sirve:

- compartir el mismo bloque de filtros entre escritorio y movil.

Por que existe:

- evita duplicar JSX,
- reduce el riesgo de que una version quede distinta de la otra.

### `components/AcademyBrand.tsx`

Encapsula la identidad visual de la academia.

Para que sirve:

- renderizar logo, nombre y subtitulo de la marca.

Por que existe:

- evita repetir la marca en header y drawer.

### `components/HeroSection.tsx`

Extrae el bloque superior de presentacion y estadisticas.

Para que sirve:

- mostrar el mensaje principal del frontend,
- mostrar los `StatCard` con salud y datos del catalogo.

Por que existe:

- deja el arranque de la pagina mas modular.

### `components/AppFooter.tsx`

Extrae el pie de pagina.

Para que sirve:

- cerrar la pantalla principal con un componente pequeno y estable.

### `components/AuthDialog.tsx`

Es el componente mas importante despues de `App.tsx`.

Para que sirve:

- mostrar el dialogo de login y registro,
- alternar entre modo `login` y `register`,
- recoger datos del usuario,
- validar parte del formulario en cliente,
- pedir el codigo,
- pedir la verificacion final.

Por que existe:

- encapsula una UI compleja que seria dificil de mantener dentro de `App.tsx`.

Lo mas importante que debes aprender aqui:

- componentes controlados,
- `useState` local para campos del formulario,
- `useEffect` para enfocar inputs,
- `useRef` para foco inicial,
- comunicacion por props con el padre.

Importante:

- `AuthDialog` NO llama directamente al backend;
- usa callbacks recibidos desde `App.tsx`.

Eso es una excelente practica para separar presentacion de coordinacion.

### `components/CategoryList.tsx`

Muestra categorias en formato visual simple.

Para que sirve:

- renderizar categorias ya cargadas.

Aprendizaje:

- componente puramente presentacional.

### `components/CourseList.tsx`

Muestra los cursos filtrados.

Para que sirve:

- pintar tarjetas de cursos,
- traducir `category_id` a nombre de categoria usando el array recibido.

Aprendizaje:

- un componente puede necesitar combinar dos props distintas para renderizar mejor.

Importante:

- no filtra cursos por si mismo;
- recibe los cursos ya filtrados desde `App.tsx`.

### `components/LoginForm.tsx`

Es un segundo punto de entrada para login.

Esto es muy importante de entender.

Hoy existen dos formas visuales de iniciar sesion:

1. el dialogo del header,
2. el panel lateral `LoginForm`.

Ambos terminan usando la misma logica `handleLogin` del padre.

Aprendizaje muy importante:

- una misma logica de negocio puede reutilizarse en varias UIs distintas.

### `components/StatCard.tsx`

Componente pequeno de estadistica o estado.

Para que sirve:

- mostrar API,
- total de categorias,
- total de cursos,
- URL base.

### `components/UserPanel.tsx`

Muestra el estado del usuario autenticado.

Para que sirve:

- ensenar visualmente quien esta logueado,
- mostrar email, rol y token parcial,
- ofrecer logout.

Importante:

- si `user` es `null`, muestra estado vacio;
- si hay `user`, muestra datos reales.

## 9. Explicacion de `src/lib/`

`lib/` guarda utilidades base compartidas.

### `lib/api.ts`

Es una de las piezas mas importantes del proyecto.

Para que sirve:

- leer `VITE_API_BASE_URL`,
- construir URLs,
- enviar `fetch`,
- agregar `Authorization` si hay token,
- manejar JSON,
- centralizar errores,
- soportar `FormData` para subidas de archivos.

Lo mas importante que debes aprender:

- si centralizas la capa HTTP, el resto del frontend queda mas limpio;
- no quieres repetir `fetch` con headers en cada componente.

Detalle tecnico importante:

- si el body es `FormData`, no fuerza `Content-Type: application/json`;
- eso es correcto, porque el navegador debe construir el boundary de `multipart/form-data`.

### `lib/storage.ts`

Encapsula `localStorage`.

Para que sirve:

- leer el token,
- guardar el token,
- borrar el token.

Por que existe:

- evita repetir la clave de almacenamiento en muchos sitios.

Aprendizaje:

- cuando el token vive en un modulo utilitario, es mas facil cambiar la estrategia despues.

### `lib/user.ts`

Encapsula helpers visuales del usuario autenticado.

Para que sirve:

- construir el nombre corto que aparece en el header,
- calcular las iniciales del avatar.

Por que existe:

- evita dejar reglas de presentacion reutilizable enterradas dentro de `App.tsx`.

## 10. Explicacion de `src/services/`

La carpeta `services/` representa la capa de acceso al backend.

Regla mental:

- un servicio sabe a que endpoint llamar;
- el componente no deberia preocuparse por la URL exacta ni por los headers.

### Servicios usados hoy por la pantalla principal

#### `services/auth.ts`

Usado directamente por `App.tsx`.

Funciones:

- `login`
- `getCurrentUser`
- `getRegistrationChallenge`
- `requestRegistrationCode`
- `verifyRegistrationCode`

Por que existe:

- concentra todo el flujo de autenticacion y registro.

#### `services/catalog.ts`

Usado directamente por `App.tsx`.

Funciones:

- `getHealth`
- `getCategories`
- `getCourses`

Por que existe:

- separa el consumo del catalogo publico del resto del frontend.

#### `services/carrito.ts`

Usado directamente por `App.tsx`.

Funciones:

- `getCarrito`
- `createCarritoItem`

Importante:

- hoy `App.tsx` usa `getCarrito` para calcular el contador del header;
- todavia no existe una pagina real de carrito.

### Servicios preparados para futuras vistas

Estos archivos ya existen, aunque la pantalla principal actual todavia no los usa:

#### `services/video.ts`

Gestiona videos:

- listar,
- obtener uno,
- crear,
- actualizar,
- borrar,
- subir archivo,
- construir URL del archivo.

#### `services/venta.ts`

Gestiona compras:

- listar ventas,
- crear venta,
- hacer checkout.

#### `services/me.ts`

Gestiona datos privados del alumno:

- cursos comprados,
- contenido de un curso comprado.

#### `services/checkbox.ts`

Gestiona progreso de marcado o avance por video.

#### `services/commentary.ts`

Gestiona comentarios.

#### `services/response.ts`

Gestiona respuestas a comentarios.

### Lo mas importante a tomar en cuenta

Cuando un proyecto crece, esta capa evita caos.

Si manana cambias una ruta del backend, prefieres tocar:

- un archivo de servicio,

y no:

- veinte componentes distintos.

## 11. Explicacion de `src/types/`

`types/` define contratos TypeScript por dominio.

Eso significa que el frontend sabe como deberian verse los datos.

### Tipos usados hoy por la pantalla principal

#### `types/auth.ts`

Define:

- `AuthDialogMode`
- `LoginRequest`
- `LoginResponse`
- `RegistrationChallenge`
- `RegistrationRequestPayload`
- `RegistrationRequestResponse`
- `RegistrationVerifyPayload`

Es clave para el flujo de login y registro.

#### `types/user.ts`

Define:

- `UserBase`
- `UserCreate`
- `User`

Importante:

- `User` es lo que normalmente recibes del backend;
- `UserCreate` representa datos para crear usuario.

#### `types/category.ts`

Define:

- `CategoryCreate`
- `CategoryUpdate`
- `Category`

#### `types/course.ts`

Define:

- `CourseBase`
- `CourseCreate`
- `CourseUpdate`
- `Course`

#### `types/carrito.ts`

Define carga y forma del carrito.

#### `types/health.ts`

Define `HealthResponse`.

### Tipos preparados para futuras vistas

#### `types/video.ts`

Contratos del modulo de videos.

#### `types/venta.ts`

Contratos del modulo de ventas y checkout.

#### `types/me.ts`

Contratos del panel del alumno.

#### `types/checkbox.ts`

Contratos del progreso.

#### `types/commentary.ts`

Contratos de comentarios.

#### `types/response.ts`

Contratos de respuestas.

### Por que esto es importante

Aprender TypeScript aqui significa aprender a pensar asi:

- que datos envio,
- que datos espero,
- que puede ser `null`,
- y que estructura real tiene la respuesta.

## 12. Explicacion de `src/assets/`

Esta carpeta guarda recursos estaticos.

Pero aqui hay una distincion muy importante:

1. recursos realmente utiles hoy,
2. recursos heredados del template,
3. carpetas placeholder.

### `assets/README.md`

Explica que recursos visuales y de audio estan disponibles.

### `assets/images/`

Guarda imagenes.

Archivos importantes:

- `logo.png`: si se usa hoy en el header.
- `default.jpg`, `default2.jpg`, `fondo1.jpg`, `matrix.gif`, `pildoras.gif`, `novideo.png`, `play.png`, `pause.png`, `slide1-1600x900.jpg`, `slide2-1600x900.jpg`, `slide3-1600x900.jpg`, `tooltip1.jpg`, `tooltip2.jpg`, `tooltip3.jpg`, `video-poster.jpg`: recursos disponibles para futuras secciones.
- `hashes.json`: pequeno mapa auxiliar de hashes a nombres de imagenes.

Subcarpetas:

- `downloads/`, `general/`, `logos/`: hoy mantienen placeholders `.gitkeep`.
- `ecommerce/checkout/`: contiene `cards.png` y `paypal-badge.png` para futuras pantallas de checkout.

### `assets/sonidos/`

Contiene audios listos para usar:

- `caja-registradora dinero.mp3`
- `carrito.mp3`
- `carton.mp3`
- `rayo.mp3`
- `super.mp3`

Hoy no son parte critica del render principal, pero estan listos para interacciones futuras.

### `assets/audio/`

Hoy solo contiene `.gitkeep`.

### `assets/css/`

Contiene CSS heredado y librerias auxiliares:

- `blue.css`
- `green.css`
- `red.css`
- `style.css`
- `iziToast.min.css`
- subcarpeta `jquery-ui/` con varios archivos de esa libreria

Importante:

- este CSS no es la base principal de la pantalla actual;
- la pantalla actual depende sobre todo de `src/styles.css`.

### `assets/js/`

Contiene JavaScript heredado:

- `cleave.min.js`
- `iziToast.min.js`
- `main.js`
- `sticky-sidebar.min.js`
- `jquery-ui/` y sus archivos

Importante:

- este JS no es el motor principal de la app React actual.

### `assets/assets1/`

Es material heredado de un template:

- CSS,
- fuentes,
- JS,
- subcarpetas placeholder.

Por que existe:

- conserva recursos del curso o plantilla original para reutilizar piezas despues.

Importante:

- no esta integrado como dependencia global principal.

### `styles/`

Hoy solo tiene `.gitkeep`.

Sirve como reserva para dividir CSS en el futuro si `styles.css` crece demasiado.

### `vendor/`

Hoy solo tiene `.gitkeep`.

Sirve como posible ubicacion futura para librerias externas manuales.

## 13. El flujo real cuando abres `http://127.0.0.1:5173`

Esta es la parte mas importante del documento.

### Paso 1. El navegador habla con Vite

Cuando abres `http://127.0.0.1:5173`, el navegador no carga una pagina HTML tradicional ya terminada.

Carga:

- `index.html`

Ese HTML trae el contenedor `#root` y el script de entrada del proyecto.

### Paso 2. Se ejecuta `src/main.tsx`

`main.tsx`:

- importa `App`,
- importa los estilos globales,
- monta React en `#root`.

### Paso 3. React monta `App.tsx`

En este momento se crea la primera renderizacion con estados iniciales.

Eso significa que al inicio aun no tienes:

- categorias cargadas,
- cursos cargados,
- usuario validado,
- carrito calculado.

Por eso React primero pinta una estructura inicial y luego la va completando.

### Paso 4. `App.tsx` lee el token desde `localStorage`

El estado `token` se inicializa con:

- `getStoredToken()`

Esto es clave.

Porque significa que el frontend intenta recuperar sesion desde el primer render.

### Paso 5. Se dispara el efecto de datos publicos

`App.tsx` ejecuta un `useEffect` que llama en paralelo a:

- `/health`
- `/categories/`
- `/products/`

Esas respuestas alimentan:

- `healthStatus`
- `categories`
- `courses`

Entonces la UI se vuelve mas completa despues de que llegan esos datos.

### Paso 6. Si hay token, se valida la sesion

Otro `useEffect` mira `token`.

Si existe:

- llama a `/auth/me`

Si la sesion es valida:

- guarda `user`
- limpia errores de sesion

Si la sesion falla:

- borra token de `localStorage`
- pone `token = null`
- pone `user = null`
- muestra error

Esto es muy importante.

El frontend no confia ciegamente en el token guardado. Lo revalida.

### Paso 7. Si hay token, se consulta el carrito

Otro `useEffect` tambien depende de `token`.

Si existe:

- llama a `/cars/`
- suma `cantidad` de cada item
- actualiza `cartCount`

Esto alimenta el contador del carrito del header.

### Paso 8. Se activan efectos de UI

Hay otros `useEffect` que no piden datos al backend, pero si controlan el comportamiento visual:

- cerrar drawer si la pantalla deja de ser movil,
- bloquear scroll del `body` si el drawer o el dialogo estan abiertos,
- cerrar el menu de perfil al hacer click afuera o pulsar `Escape`.

Esto tambien es logica frontend importante, aunque no toque la API.

### Paso 9. React re-renderiza

Cada vez que un `setState` cambia algo:

- React vuelve a renderizar,
- la UI refleja el nuevo estado.

Este es el motor real de React.

La pantalla no se actualiza por "magia".
Se actualiza porque cambian estados.

## 14. Flujo de interaccion despues de cargar la pagina

Aqui empieza la parte dinamica.

### Caso 1. El usuario filtra por categoria

Que pasa:

1. cambia el `select`,
2. se actualiza `selectedCategoryId`,
3. React recalcula `filteredCourses`,
4. `CourseList` recibe menos o mas cursos.

Importante:

- no se hace llamada nueva al backend;
- el filtro es local, en memoria.

### Caso 2. El usuario escribe en la busqueda

Que pasa:

1. al escribir, cambia `searchDraft`,
2. al enviar el formulario, `searchDraft` se copia a `searchTerm`,
3. `filteredCourses` usa `searchTerm`,
4. la lista se actualiza.

Importante:

- la busqueda tambien es local;
- no existe aun una busqueda remota contra backend.

### Caso 3. El usuario abre el menu movil

Que pasa:

1. cambia `isMenuOpen`,
2. aparece el drawer,
3. se bloquea scroll del `body`,
4. el backdrop permite cerrarlo.

### Caso 4. El usuario abre el dialogo de autenticacion

Que pasa:

1. `openAuthDialog` limpia errores anteriores,
2. define si abre en `login` o `register`,
3. abre el dialogo,
4. si es registro, pide un reto humano al backend.

### Caso 5. Login desde dialogo o panel lateral

Que pasa:

1. el usuario envia email y password,
2. `handleLogin` llama `login()` del servicio,
3. si sale bien, `handleAuthSuccess`:
   - guarda token,
   - actualiza `token`,
   - actualiza `user`,
   - cierra dialogo y menus,
   - limpia mensajes de registro
4. luego los efectos dependientes de `token` cargan sesion y carrito.

Lo mas importante:

- el login visible puede venir de dos componentes distintos,
- pero la logica real vive en un solo lugar: `App.tsx`.

### Caso 6. Registro en dos pasos

El flujo del registro es mas interesante y debes estudiarlo con calma.

#### Fase A. Preparacion

Al abrir `Registrate`:

- el frontend pide `GET /auth/register/challenge`

Eso devuelve un reto humano.

#### Fase B. Solicitud de codigo

Cuando el usuario envia el formulario:

- `AuthDialog` valida password repetida y consentimiento,
- `App.tsx` envia `POST /auth/register/request-code`

Si sale bien:

- se guarda `pendingRegistrationEmail`,
- se muestra mensaje de exito,
- se refresca el reto humano.

#### Fase C. Verificacion final

Cuando el usuario escribe el codigo:

- `App.tsx` llama `POST /auth/register/verify`

Si sale bien:

- el backend devuelve token + usuario,
- `handleAuthSuccess` trata el resultado igual que un login correcto.

Lo mas importante:

- el registro NO crea sesion completa hasta que el codigo se verifica.

### Caso 7. Menu de perfil

Si hay usuario autenticado:

- el header muestra iniciales,
- nombre resumido,
- caret,
- dropdown con `Cerrar sesion`.

Ademas, el menu se cierra si:

- haces click fuera,
- pulsas `Escape`.

Aqui debes aprender el uso de `useRef` para detectar click externo.

### Caso 8. Logout

Que pasa:

1. se borra token de `localStorage`,
2. `token` pasa a `null`,
3. `user` pasa a `null`,
4. menus se cierran,
5. el efecto del carrito lo resetea a `0`.

## 15. Lo que hoy NO existe todavia

Tambien es importante entender lo que aun no esta implementado.

- No hay `React Router`.
- No hay paginas separadas por URL.
- `Mi aprendizaje` aun no navega a una vista real.
- `Carrito` aun no abre una pantalla real.
- Muchos servicios y tipos ya existen, pero esperan futuras vistas.

Esto no es un fallo. Es el punto actual del proyecto.

## 16. Los archivos mas importantes para estudiar en orden

Si quieres aprender este frontend de verdad, sigue este orden:

1. `src/main.tsx`
2. `src/App.tsx`
3. `src/components/Topbar.tsx`
4. `src/components/CatalogFilters.tsx`
5. `src/components/HeroSection.tsx`
6. `src/components/AuthDialog.tsx`
7. `src/lib/api.ts`
8. `src/lib/storage.ts`
9. `src/lib/user.ts`
10. `src/services/auth.ts`
11. `src/services/catalog.ts`
12. `src/services/carrito.ts`
13. `src/components/LoginForm.tsx`
14. `src/components/UserPanel.tsx`
15. `src/components/CourseList.tsx`
16. `src/types/auth.ts`
17. `src/types/user.ts`
18. `src/types/course.ts`
19. `src/styles.css`

## 17. Lo que debes aprender para entender bien el funcionamiento

Si yo tuviera que decirte que estudiar si o si, seria esto:

### React basico

- componentes,
- props,
- estado con `useState`,
- efectos con `useEffect`,
- referencias con `useRef`,
- render condicional.

### Flujo de datos

- como un hijo recibe datos del padre,
- como un hijo dispara una accion del padre mediante callbacks.

### Formularios controlados

- cada input tiene su valor ligado a estado.

### Servicios HTTP

- separar `fetch` de la UI,
- centralizar errores,
- manejar token.

### TypeScript

- entender tipos de entrada y salida,
- identificar `null`,
- usar contratos por dominio.

### Estado de sesion

- token en `localStorage`,
- revalidacion con `/auth/me`,
- cierre de sesion limpio.

### Responsive

- drawer movil,
- bloqueo de scroll,
- menu que reacciona al viewport.

## 18. Errores comunes al leer este proyecto

### Error 1. Pensar que `dist/` es la pagina activa en desarrollo

No. En `npm run dev`, Vite trabaja sobre `src/`.

### Error 2. Pensar que el HTML vive repartido en muchos archivos

No. React pinta casi todo desde `App.tsx` y sus componentes.

### Error 3. Pensar que cada click habla con el backend

No siempre.

Ejemplos:

- filtro de categoria: local
- busqueda: local
- abrir drawer: local
- abrir dropdown: local

### Error 4. Pensar que `AuthDialog` contiene toda la logica de autenticacion

No.

`AuthDialog` contiene mucha UI y validacion local, pero la coordinacion importante sigue en `App.tsx`.

### Error 5. Pensar que ya existe navegacion real

No. Aun no hay router.

### Error 6. Pensar que todos los assets heredados ya estan integrados

No. Muchos recursos estan guardados para uso futuro.

## 19. Resumen final como profesor

Si quieres entender este frontend de verdad, no memorices archivos sueltos. Entiende la arquitectura.

La arquitectura actual dice:

- una sola pagina principal,
- `App.tsx` como orquestador,
- componentes para UI,
- servicios para API,
- utilidades para infraestructura,
- tipos para contratos,
- estilos globales para apariencia.

Lo mas importante a retener es esto:

1. el navegador entra por `index.html`,
2. React arranca en `main.tsx`,
3. la app vive en `App.tsx`,
4. `App.tsx` pide datos y maneja la sesion,
5. los componentes muestran esos datos,
6. cada interaccion importante cambia estado,
7. cuando cambia el estado, React vuelve a pintar.

Si aprendes esa secuencia, ya no miraras el frontend como una caja negra. Empezaras a verlo como un sistema entendible.

## 20. Siguiente paso recomendado para aprender aun mejor

Despues de leer este documento, te recomiendo hacer este ejercicio practico:

1. abrir `src/main.tsx`,
2. abrir `src/App.tsx`,
3. seguir cada `useState`,
4. seguir cada `useEffect`,
5. seguir cada handler importante,
6. identificar que servicio llama,
7. comprobar que estado cambia,
8. ver que componente usa ese estado.

Ese ejercicio te va a dar mucho mas dominio que solo leer por encima.
