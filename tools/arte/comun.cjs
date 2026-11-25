// Utilidades compartidas para dibujar el arte del juego en SVG.
const S = 2;                 // los sprites se exportan al doble de su tamaño en pantalla (nitidez)
const OUT = '#2b1d16';       // color de contorno

const DEFS = `
<linearGradient id="piedra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b4aea4"/><stop offset="1" stop-color="#77716a"/></linearGradient>
<linearGradient id="piedraOsc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f897f"/><stop offset="1" stop-color="#5c5750"/></linearGradient>
<linearGradient id="madera" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c58a54"/><stop offset="1" stop-color="#8f5a30"/></linearGradient>
<linearGradient id="ladrillo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cf8a5c"/><stop offset="1" stop-color="#a65f3a"/></linearGradient>
<linearGradient id="cristal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#bff9ff"/><stop offset="0.5" stop-color="#3fd6e0"/><stop offset="1" stop-color="#14868f"/></linearGradient>
<linearGradient id="ambar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd978"/><stop offset="1" stop-color="#e8962a"/></linearGradient>
<filter id="brillo" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="brilloFuerte" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<pattern id="peligro" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="5" height="10" fill="#f2b138"/><rect x="5" width="5" height="10" fill="#2b1d16"/></pattern>
`;

// oy: margen extra por arriba (para plumas, cadenas, etc. que sobresalen).
function svg(w, h, cuerpo, escala = S, oy = 0, ox = 0) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-ox} ${-oy} ${w + ox} ${h + oy}" width="${(w + ox) * escala}" height="${(h + oy) * escala}"><defs>${DEFS}</defs>${cuerpo}</svg>`;
}

// Extremidad gruesa con contorno: puntos [[x,y],...]
function miembro(puntos, ancho, color, contorno = OUT) {
  const d = 'M' + puntos.map(p => p.join(' ')).join(' L');
  return `<path d="${d}" stroke="${contorno}" stroke-width="${ancho + 3}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
         `<path d="${d}" stroke="${color}" stroke-width="${ancho}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
}

// Ojos brillantes de los Colosos (cian).
function ojoBrillante(cx, cy, rx = 3.2, ry = 2.2) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#8ffaff" filter="url(#brillo)"/>` +
         `<ellipse cx="${cx}" cy="${cy}" rx="${rx * 0.5}" ry="${ry * 0.5}" fill="#ffffff"/>`;
}

module.exports = { S, OUT, DEFS, svg, miembro, ojoBrillante };
