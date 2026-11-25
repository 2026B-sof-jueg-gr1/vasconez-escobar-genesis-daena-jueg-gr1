# Tres Regiones: Tierra en Ruinas

Runner 2D de acción hecho con [Phaser 3](https://phaser.io). Aru Chasqui, mensajero de la Guardia Cóndor, recorre Ecuador para recuperar tres componentes y reactivar la red de comunicación tras la caída de Quito.

El documento de diseño completo está en [`GDD.md`](GDD.md).

## Cómo jugar

El juego carga imágenes, por lo que **no se abre con doble clic** sobre `index.html`. Hay que servirlo desde un servidor local:

- **VS Code:** instalar la extensión *Live Server* y pulsar «Go Live».
- **Terminal:** en esta carpeta, ejecutar `npx serve` (o `python -m http.server`) y abrir la dirección que muestra.

Controles: `Espacio` / `↑` saltar (doble salto) · `↓` / `S` deslizarse · `X` / `Z` / `Shift` / clic derecho atacar (o el botón en pantalla) · `Esc` pausa. Cuatro niveles: Atacames, Ambato, Pailón del Diablo y Misahuallí.

## Estructura

| Carpeta | Contenido |
|---|---|
| `assets/sprites`, `assets/fondos` | Imágenes PNG del juego |
| `assets/fuentes` | SVG originales |
| `src/datos` | Configuración, niveles y catálogo de imágenes |
| `src/sistemas` | Récord y progreso |
| `src/escenas` | Pantallas del juego |
| `docs` | Imágenes del GDD |
| `tools/arte` | Script que genera las imágenes |

## Cambiar el arte

Cualquier PNG de `assets/sprites/` se puede reemplazar por una ilustración propia con el **mismo nombre**: el juego la ajusta al tamaño definido en `src/datos/assets.js`. Para volver a generar las imágenes incluidas: `cd tools && npm install && npm run arte`.

## Landing page

`landing/index.html` es la página de presentación del juego (descripción, controles, regiones y jefes). Se publica junto al juego en GitHub Pages, en la ruta `/landing/`.

## Rendimiento

El juego es 100 % estático (sin servidor ni base de datos): un `index.html`, ~45 KB de código propio y ~0,5 MB de imágenes PNG; Phaser se descarga desde un CDN. Los objetos fuera de pantalla se destruyen y los fondos se repiten con un solo `tileSprite` por capa.

## Publicación

Cada `push` a `main` publica el juego en GitHub Pages mediante `.github/workflows/deploy.yml`.
