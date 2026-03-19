# Documentacion explicativa del BACKEND

## 1. Vision general

Este backend esta construido con FastAPI y SQLAlchemy. Su funcion principal es exponer una API para autenticar usuarios, administrar cursos y categorias, servir videos, gestionar carrito y compras, registrar progreso de aprendizaje y habilitar una pequena capa de comunidad con comentarios y respuestas.

La arquitectura esta organizada por responsabilidades:

- `app/main.py` arranca la API y registra las rutas.
- `app/core/` concentra configuracion, base de datos, seguridad y dependencias comunes.
- `app/models/` define las tablas y relaciones de la base de datos.
- `app/schemas/` define los contratos de entrada y salida con Pydantic.
- `app/services/` contiene la logica de negocio.
- `app/routes/` expone endpoints HTTP y delega en los servicios.
- `tests/` valida el comportamiento del sistema.

## 2. Flujo general de una peticion

Cuando llega una peticion HTTP, el flujo normal del proyecto es este:

1. FastAPI recibe la peticion en `app/main.py`.
2. La peticion entra en una ruta de `app/routes/`.
3. La ruta inyecta dependencias como la sesion de base de datos o el usuario autenticado.
4. La ruta llama a una funcion de `app/services/`.
5. El servicio consulta o modifica entidades de `app/models/`.
6. La respuesta se serializa usando clases de `app/schemas/`.
7. Si ocurre un error de negocio, se lanza una excepcion de `app/core/exceptions.py` y `main.py` la convierte en respuesta JSON.

## 3. Carpeta raiz BACKEND

### `.env`

Guarda variables de entorno del proyecto, como la conexion a base de datos, la clave secreta para tokens y la carpeta de subida de videos.

### `requirements.txt`

Lista las dependencias principales del backend. Entre las mas importantes estan:

- `fastapi` para crear la API.
- `SQLAlchemy` para mapear tablas y hacer consultas.
- `pydantic` para validar datos.
- `uvicorn` para ejecutar el servidor.
- `python-multipart` para soportar subida de archivos.
- `psycopg2-binary` para conectarse a PostgreSQL.

### `requiriments.txt`

Existe una segunda variante del archivo de dependencias con un nombre escrito de forma distinta. Por como esta organizado el proyecto, parece un archivo redundante u obsoleto.

### `run_tests.py`

Ejecuta la secuencia de pruebas del proyecto:

- `app/test_db.py`
- `app/test_models.py`
- `python -m unittest discover -s tests`

Sirve como atajo para comprobar rapidamente el estado del backend.

### `app/init_db.py`

Importa todos los modelos y ejecuta `Base.metadata.create_all(bind=engine)` para verificar o crear las tablas en la base de datos.

### `venv/`

Entorno virtual local del backend. Contiene el interprete de Python y los paquetes instalados.

## 4. Carpeta `app/`

### `app/main.py`

Es el punto de entrada principal. Hace tres cosas clave:

- crea la aplicacion FastAPI con el titulo `BACKEND API`,
- registra un manejador global para errores de tipo `AppError`,
- incluye todos los routers funcionales del proyecto.

Tambien expone `GET /health`, que devuelve `{"status": "ok"}` y sirve como comprobacion rapida de salud del servicio.

## 5. Carpeta `app/core/`

### `config.py`

Gestiona la configuracion del proyecto.

Paso a paso:

1. Busca el archivo `BACKEND/.env`.
2. Lee pares `KEY=VALUE` si existen.
3. Carga variables necesarias como `DATABASE_URL` y `SECRET_KEY`.
4. Calcula valores por defecto, por ejemplo la carpeta de subida de videos.
5. Construye el objeto inmutable `Settings`.

Es el centro de configuracion del backend.

### `database.py`

Define la conexion a la base de datos:

- crea el `engine` con `create_engine(settings.database_url)`,
- crea `SessionLocal`, que es la fabrica de sesiones SQLAlchemy usada en rutas y servicios.

### `deps.py`

Reune dependencias reutilizables de FastAPI:

- `get_db()` abre y cierra la sesion de base de datos,
- `get_current_user()` valida el token, busca el usuario y lo devuelve,
- `require_roles()` restringe endpoints por rol, por ejemplo solo `admin`.

Este archivo es clave para autenticacion y autorizacion.

### `security.py`

Implementa la seguridad base del proyecto sin depender de librerias externas de JWT o hashing.

Lo que hace:

- cifra contrasenas con PBKDF2 SHA-256,
- verifica contrasenas cifradas,
- detecta si una contrasena aun esta en texto plano,
- crea tokens de acceso con firma HMAC SHA-256,
- valida tokens y revisa expiracion.

Detalle importante: el login soporta una ruta temporal de compatibilidad para usuarios antiguos cuya contrasena aun no estaba hasheada.

### `exceptions.py`

Define excepciones de negocio reutilizables:

- `AuthenticationError`
- `AuthorizationError`
- `ConflictError`
- `NotFoundError`
- `ForbiddenError`

Estas clases permiten que la logica de negocio sea mas limpia, porque los servicios lanzan errores semanticos y `main.py` los transforma en respuestas HTTP coherentes.

## 6. Carpeta `app/models/`

Esta carpeta define las entidades de base de datos con SQLAlchemy.

### `base.py`

Incluye:

- `Base`, la clase base declarativa de SQLAlchemy,
- `TimestampMixin`, que agrega `created_at`, `updated_at` y `deleted_at`.

El proyecto usa `deleted_at` para borrado logico en varios modulos, en lugar de eliminar filas fisicamente.

### `__init__.py`

Importa todos los modelos para que SQLAlchemy conozca el mapa completo antes de crear tablas o inicializar relaciones.

### `user.py`

Representa usuarios del sistema.

Campos destacados:

- datos personales: nombre, apellido, email,
- autenticacion: password, role, remember_token,
- perfil: description, image.

Relaciones:

- videos creados,
- elementos del carrito,
- ventas,
- comentarios,
- respuestas,
- checkboxes de progreso.

### `category.py`

Agrupa cursos por categoria. Se relaciona con `Course`.

### `course.py`

Representa cursos publicados.

Campos importantes:

- `category_id`,
- nombre, detalle, imagen y URL,
- configuracion visual como `accordion`,
- precios actual y anterior,
- contador `num_ventas`.

Relaciones:

- categoria,
- videos,
- carrito,
- ventas,
- progreso,
- comentarios.

### `video.py`

Guarda las lecciones o piezas de contenido de un curso.

Campos importantes:

- usuario creador,
- curso al que pertenece,
- titulo y contenido,
- URL externa,
- ruta de archivo subido,
- recurso descargable,
- seccion y titulo del acordeon.

### `carrito.py`

Modela los cursos que un usuario agrega al carrito antes de comprar.

### `venta.py`

Representa la compra de un curso por un usuario.

Tambien almacena dos indicadores de aprendizaje:

- `progreso` en porcentaje,
- `cantidad_v` con cantidad de videos completados.

### `checkbox.py`

Registra si un usuario marco como completado un video concreto dentro de un curso. Es la base para calcular el progreso.

### `commentary.py`

Modela comentarios sobre videos o cursos.

### `response.py`

Modela respuestas asociadas a comentarios.

## 7. Carpeta `app/schemas/`

Aqui estan los contratos de la API con Pydantic. Estos esquemas validan la entrada y definen la forma de salida.

### `auth.py`

- `LoginRequest`: email y password para iniciar sesion.
- `TokenResponse`: devuelve `access_token`, `token_type` y el usuario autenticado.

### `user.py`

- `UserCreate`: datos requeridos para registrar un usuario.
- `UserPublic`: representacion segura para respuestas, incluyendo timestamps.

### `category.py`

- `CategoryCreate`
- `CategoryUpdate`
- `CategoryPublic`

Separan creacion, actualizacion parcial y salida publica.

### `course.py`

- `CourseCreate`
- `CourseUpdate`
- `CoursePublic`

Define las reglas para cursos y ayuda a evitar que entren datos incompletos o invalidos.

### `video.py`

- `VideoCreate`
- `VideoUpdate`
- `VideoPublic`

Se usa tanto para videos normales como para subidas de archivos.

### `carrito.py`

- `CarritoCreate`
- `CarritoPublic`

### `venta.py`

- `VentaCreate`
- `VentaPublic`
- `CheckoutResultPublic`

Este ultimo resume que cursos se compraron y cuales se omitieron en el checkout.

### `checkbox.py`

- `CheckboxCreate`
- `CheckboxPublic`

### `commentary.py`

- `CommentaryCreate`
- `CommentaryPublic`

### `response.py`

- `ResponseCreate`
- `ResponsePublic`

### `me.py`

Expone modelos pensados para el panel del alumno:

- `PurchasedCoursePublic`,
- `VideoProgressPublic`,
- `CourseContentPublic`.

Estos esquemas agregan informacion compuesta, no solo una tabla aislada.

## 8. Carpeta `app/services/`

Es la capa mas importante de logica de negocio. Las rutas idealmente delegan aqui y evitan contener reglas complejas.

### `auth_service.py`

Gestiona el login:

1. busca un usuario por email,
2. valida la contrasena,
3. si detecta una contrasena antigua en texto plano, la reemplaza por una hasheada,
4. crea un token de acceso,
5. devuelve token y usuario.

### `user_service.py`

Se encarga de usuarios:

- listar usuarios,
- registrar nuevos usuarios,
- hashear password antes de guardar,
- controlar conflicto por email duplicado.

### `catalog_service.py`

Centraliza el catalogo de cursos, categorias y videos.

Responsabilidades principales:

- listar y obtener cursos,
- crear, editar y borrar cursos de forma logica,
- listar y obtener categorias,
- crear, editar y borrar categorias,
- listar videos segun permisos,
- crear videos,
- subir y asociar archivos de video,
- actualizar y borrar videos,
- devolver la ruta del archivo fisico para descarga o reproduccion.

Tambien llama a `ensure_course_access()` cuando el usuario no es admin y quiere ver videos.

### `commerce_service.py`

Agrupa la logica de negocio de compra y aprendizaje.

Funciones clave:

- `list_cars()` y `create_car()` para el carrito,
- `list_ventas()` y `create_venta()` para compras,
- `checkout_cart()` para convertir carrito en ventas,
- `list_checkboxes()` y `create_checkbox()` para marcar progreso,
- `sync_venta_progress()` para recalcular porcentaje completado,
- `list_my_courses()` para el panel del alumno,
- `get_course_content()` para devolver un curso con sus videos y progreso,
- `ensure_course_access()` para impedir acceso a contenido no comprado.

Este modulo conecta la parte comercial con la experiencia de aprendizaje.

### `community_service.py`

Gestiona comunidad y permisos de participacion:

- lista comentarios,
- crea comentarios solo si el usuario tiene acceso al curso,
- lista respuestas,
- crea respuestas validando primero el comentario padre.

### `storage_service.py`

Guarda archivos de video en disco:

- crea la carpeta de destino si no existe,
- genera un nombre unico con `uuid4`,
- escribe el contenido binario en disco,
- devuelve la ruta almacenada.

## 9. Carpeta `app/routes/`

Aqui vive la capa HTTP. Cada archivo define endpoints y delega en servicios.

### `auth.py`

Endpoints:

- `POST /auth/login`
- `GET /auth/me`

Permite autenticarse y consultar el usuario actual a partir del token.

### `users.py`

Endpoints:

- `GET /users/` solo para admin,
- `POST /users/` para registrar usuarios.

### `products.py`

Trabaja realmente con cursos.

Endpoints:

- `GET /products/`
- `GET /products/{course_id}`
- `POST /products/` solo admin
- `PATCH /products/{course_id}` solo admin
- `DELETE /products/{course_id}` solo admin

### `categories.py`

CRUD de categorias con lectura publica y escritura restringida a admin.

### `videos.py`

Maneja el contenido audiovisual.

Endpoints importantes:

- listar videos,
- obtener un video,
- crear video,
- subir archivo con `POST /videos/upload`,
- editar y borrar videos,
- descargar o servir archivo con `GET /videos/{video_id}/file`.

### `carrito.py`

Expone el carrito del usuario autenticado:

- `GET /cars/`
- `POST /cars/`

### `ventas.py`

Expone compras y checkout:

- `GET /ventas/`
- `POST /ventas/`
- `POST /ventas/checkout`

### `checkbox.py`

Permite leer y actualizar el progreso del usuario por video.

### `me.py`

Endpoints enfocados en experiencia del alumno:

- `GET /me/courses`
- `GET /me/courses/{course_id}/content`

### `commentaries.py`

Lista y crea comentarios.

### `responses.py`

Lista y crea respuestas a comentarios.

### `routes.py`

Existe un archivo adicional con endpoints de carrito implementados de forma mas directa usando `SessionLocal` y `payload: dict`. No esta incluido en `main.py`, por lo que actualmente parece una version antigua o de apoyo y no forma parte del flujo activo principal.

## 10. Carpeta `tests/`

Contiene pruebas unitarias y de integracion ligera para los modulos principales.

Segun `tests/README.md`, las pruebas cubren:

- seguridad y tokens,
- autenticacion,
- catalogo,
- cursos,
- videos,
- acceso a contenido comprado,
- almacenamiento de archivos,
- progreso de aprendizaje,
- checkout,
- comunidad,
- salud de la API.

Esto indica que el proyecto esta intentando validar tanto reglas tecnicas como reglas de negocio.

## 11. Flujo funcional del sistema por casos de uso

### Registro de usuario

1. El cliente envia datos a `POST /users/`.
2. `routes/users.py` valida el cuerpo con `UserCreate`.
3. `user_service.register_user()` hashea la contrasena.
4. Se crea la fila en la tabla `users`.
5. Se devuelve `UserPublic`.

### Inicio de sesion

1. El cliente llama a `POST /auth/login`.
2. `auth_service.login_user()` busca el usuario por email.
3. Verifica la password.
4. Si hacia falta, migra una password vieja a hash seguro.
5. Genera un token JWT-like firmado.
6. Devuelve token y datos del usuario.

### Publicacion de cursos y videos

1. Un admin crea categorias y cursos.
2. Un admin crea videos o sube un archivo con `/videos/upload`.
3. `storage_service` guarda el archivo.
4. `catalog_service` registra la metadata del video en base de datos.

### Compra y acceso al contenido

1. El usuario agrega cursos al carrito con `/cars/`.
2. Ejecuta `/ventas/checkout` o compra directamente.
3. Se generan filas en `ventas`.
4. `ensure_course_access()` usa esa tabla para decidir si puede ver videos.
5. `GET /me/courses/{course_id}/content` devuelve curso, videos y progreso.

### Seguimiento del progreso

1. El usuario marca un video en `/checkbox/`.
2. Se crea o actualiza un registro `Checkbox`.
3. `sync_venta_progress()` recalcula porcentaje y videos completados.
4. La compra asociada se actualiza en la tabla `ventas`.

### Comunidad

1. El usuario con acceso al curso crea un comentario.
2. Otros usuarios con acceso pueden responder.
3. Todo se guarda en `commentaries` y `responses`.

## 12. Decisiones tecnicas destacables

- El proyecto aplica separacion por capas: rutas, servicios, modelos y esquemas.
- Usa borrado logico con `deleted_at` en lugar de eliminar registros directamente.
- La autenticacion se implementa manualmente y no con una libreria de JWT externa.
- El progreso del alumno se calcula a partir de checkboxes por video.
- El backend combina una parte comercial, una parte de aprendizaje y una parte social.

## 13. Observaciones utiles para mantenimiento

- `app/routes/routes.py` parece codigo legado no conectado al arranque principal.
- Existe duplicidad potencial entre `requirements.txt` y `requiriments.txt`.
- El proyecto ya tiene buena base para documentacion porque la logica esta bastante separada en servicios.
- Si en el futuro crece, seria util agregar migraciones formales con Alembic y una documentacion de endpoints por dominio.

## 14. Conclusion

El backend esta disenado como una API de plataforma educativa con comercio y seguimiento de progreso. La parte mas importante de entender es la relacion entre rutas, servicios, modelos y esquemas:

- las rutas reciben peticiones,
- los servicios aplican reglas,
- los modelos representan la base de datos,
- los esquemas validan la entrada y salida.

Si entiendes ese recorrido y los modulos `auth_service`, `catalog_service` y `commerce_service`, entiendes el nucleo funcional del proyecto.
