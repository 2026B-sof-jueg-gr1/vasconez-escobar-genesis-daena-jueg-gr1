# Tres Regiones: Tierra en Ruinas

Runner 2D de acción hecho con [Phaser 3](https://phaser.io). Aru Chasqui, mensajero de la Guardia Cóndor, recorre Ecuador para recuperar tres componentes y reactivar la red de comunicación tras la caída de Quito.

El documento de diseño completo está en [`GDD.md`](GDD.md).

## Cómo jugar

El juego carga imágenes, por lo que **no se abre con doble clic** sobre `juego/index.html`. Hay que servirlo desde un servidor local:

- **VS Code:** instalar la extensión *Live Server* y pulsar «Go Live».
- **Terminal:** en esta carpeta, ejecutar `npx serve` (o `python -m http.server`) y abrir la dirección que muestra.

Controles: `Espacio` / `↑` saltar (doble salto) · `↓` / `S` deslizarse · `X` / `Z` / `Shift` / clic derecho atacar (o el botón en pantalla) · `Esc` pausa. Cuatro niveles: Atacames, Ambato, Pailón del Diablo y Misahuallí.

## Estructura

| Carpeta | Contenido |
|---|---|
| `juego/assets/sprites`, `juego/assets/fondos` | Imágenes PNG del juego |
| `juego/assets/fuentes` | SVG originales |
| `juego/src/datos` | Configuración, niveles y catálogo de imágenes |
| `juego/src/sistemas` | Récord y progreso |
| `juego/src/escenas` | Pantallas del juego |
| `docs` | Imágenes del GDD |
| `tools/arte` | Script que genera las imágenes |

## Cambiar el arte

Cualquier PNG de `juego/assets/sprites/` se puede reemplazar por una ilustración propia con el **mismo nombre**: el juego la ajusta al tamaño definido en `juego/src/datos/assets.js`. Para volver a generar las imágenes incluidas: `cd tools && npm install && npm run arte`.

## Landing page

`index.html` (raíz) es la página de presentación (logline, historia, clasificación y Muro de Honor) con un botón que lleva al juego en `juego/`. Se publica en GitHub Pages.

## Rendimiento

El juego es 100 % estático (sin servidor ni base de datos): un `juego/index.html`, ~45 KB de código propio, ~0,5 MB de imágenes PNG y Phaser incluido en `juego/lib`. Los objetos fuera de pantalla se destruyen y los fondos se repiten con un solo `tileSprite` por capa.

## Publicación

Cada `push` a `main` publica el juego en GitHub Pages mediante `.github/workflows/deploy.yml`.
