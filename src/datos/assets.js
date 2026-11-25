// Catálogo de imágenes. Cada sprite se dibuja en pantalla al tamaño {w, h} (en píxeles del juego),
// sin importar la resolución del PNG. Así se puede reemplazar cualquier archivo de assets/sprites/
// por una ilustración propia con el mismo nombre y el juego la ajusta sola.
const SPRITES = {
  aru_correr1: { w: 64, h: 100 },
  aru_correr2: { w: 64, h: 100 },
  aru_salto: { w: 64, h: 100 },
  aru_desliz: { w: 80, h: 56 },
  civil: { w: 40, h: 64 },
  errante: { w: 62, h: 72 },
  trepador: { w: 64, h: 64 },
  estibador: { w: 176, h: 190 },
  canon: { w: 190, h: 150 },
  apu: { w: 232, h: 220 },
  muro: { w: 64, h: 56 },
  roca: { w: 64, h: 56 },
  tronco: { w: 72, h: 52 },
  hueco: { w: 140, h: 40 },
  colgante: { w: 110, h: 130 },
  pincho: { w: 40, h: 32 },
  pilar: { w: 56, h: 120 },
  caja: { w: 48, h: 48 },
  viveres: { w: 36, h: 36 },
  componente: { w: 52, h: 52 },
  tajo: { w: 110, h: 80 },
  corazon: { w: 28, h: 26 },
  corazon_vacio: { w: 28, h: 26 },
  icono_aliado: { w: 26, h: 26 },
  icono_comp: { w: 26, h: 26 },
  icono_comp_vacio: { w: 26, h: 26 }
};

// Capas de fondo por nivel jugable.
const CAPAS_FONDO = ['cielo', 'nubes', 'lejos', 'cerca', 'suelo'];
