# Recursos disponibles

## Imagenes actualmente utiles

En `src/assets/images/` ya existen recursos que pueden reutilizarse sin depender del template heredado:

- `logo.png`
- `default.jpg`
- `default2.jpg`
- `fondo1.jpg`
- `matrix.gif`
- `pildoras.gif`
- `novideo.png`
- `play.png`
- `pause.png`
- `slide1-1600x900.jpg`
- `slide2-1600x900.jpg`
- `slide3-1600x900.jpg`
- `tooltip1.jpg`
- `tooltip2.jpg`
- `tooltip3.jpg`
- `video-poster.jpg`

En `src/assets/images/ecommerce/checkout/` existen:

- `cards.png`
- `paypal-badge.png`

## Audio disponible

En `src/assets/sonidos/` existen:

- `caja-registradora dinero.mp3`
- `carrito.mp3`
- `carton.mp3`
- `rayo.mp3`
- `super.mp3`

## Material heredado del curso

La carpeta `src/assets/assets1/` contiene CSS, fuentes y JS de un template heredado.

Por ahora ese template no se carga globalmente en `index.html` porque:

1. referencia imagenes que no estan completas en el proyecto,
2. puede interferir con la interfaz actual en React,
3. conviene integrar solo las partes realmente necesarias cuando se usen.

## Recomendacion actual

- Usa primero las imagenes de `src/assets/images/`.
- Usa `src/assets/sonidos/` cuando integremos interacciones reales.
- Mantén `assets1/` como fuente de recursos heredados, no como dependencia global por defecto.
