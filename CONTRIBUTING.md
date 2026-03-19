# Contributing Guide

## Objetivo

Este proyecto busca servir como ejemplo de trabajo ordenado, mantenible y apto para colaboracion.

## Flujo recomendado

1. Crear rama desde `main`.
2. Nombrar la rama segun el cambio:
   - `feature/...`
   - `fix/...`
   - `docs/...`
   - `refactor/...`
3. Hacer cambios pequenos y enfocados.
4. Ejecutar validaciones locales.
5. Abrir Pull Request con contexto suficiente.

## Convencion de commits

Usar mensajes claros, por ejemplo:

- `feat: add frontend auth service`
- `fix: validate uploaded video extensions`
- `docs: add onboarding guide`

## Checklist antes de abrir PR

- El cambio compila o ejecuta correctamente.
- Las pruebas relevantes pasan.
- La documentacion fue actualizada si aplica.
- No se agregaron secretos al repositorio.
- No se subieron archivos generados o temporales innecesarios.

## Validaciones locales

### Backend

```powershell
cd BACKEND
.\venv\Scripts\activate
python run_tests.py
```

### Frontend

```powershell
cd FRONTEND
npm run build
```

## Estilo de documentacion

- Documentacion general en archivos Markdown del repositorio.
- Docstrings en modulos y funciones importantes.
- Comentarios en codigo solo cuando expliquen decisiones no obvias.

## Incorporacion de nuevos desarrolladores

Un nuevo colaborador debe poder:

1. clonar el repositorio,
2. copiar `.env.example`,
3. instalar dependencias,
4. ejecutar backend y frontend,
5. correr pruebas,
6. entender el flujo de trabajo desde este archivo y el `README.md`.
