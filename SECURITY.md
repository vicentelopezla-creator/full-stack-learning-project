# Security Policy

## Alcance

Este proyecto maneja autenticacion, carga de archivos y datos de usuarios, por lo que cualquier cambio debe considerar impacto de seguridad.

## Principios actuales

- Secretos fuera del repositorio.
- Variables de entorno documentadas en archivos `.env.example`.
- CORS controlado desde configuracion.
- Validacion basica de archivos subidos.
- Pruebas backend ejecutables antes de integrar cambios.

## Reglas para colaboradores

- No subir `.env` reales.
- No incluir tokens, passwords o cadenas de conexion en commits.
- No ampliar CORS con comodines en entornos reales.
- No guardar datos sensibles en el frontend salvo necesidad justificada.

## Hallazgos conocidos

- El frontend usa `localStorage` para el token de acceso. Para produccion se recomienda migrar a cookies `HttpOnly`.
- La autenticacion del backend usa un token firmado de forma manual. A futuro conviene evaluar librerias estandarizadas y soporte de revocacion.

## Reporte de vulnerabilidades

Si se detecta una vulnerabilidad:

1. documentar el problema,
2. describir impacto y reproduccion,
3. proponer mitigacion,
4. corregir primero en una rama aislada,
5. evitar exponer secretos o datos reales en issues publicos.
