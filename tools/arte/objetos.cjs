// Obstáculos (madera, ladrillo y franjas amarillas/negras), objetos recogibles e iconos.
const { OUT, svg, miembro } = require('./comun.cjs');

function muro() {
  let ladrillos = '';
  for (let f = 0; f < 4; f += 1) {
    for (let k = 0; k < 4; k += 1) {
      const x = 5 + k * 14 + (f % 2 ? -7 : 0);
      ladrillos += `<rect x="${x}" y="${18 + f * 9}" width="13" height="8" rx="1.5" fill="url(#ladrillo)" stroke="${OUT}" stroke-width="1.4"/>`;
    }
  }
  const c = `
    <ellipse cx="32" cy="54" rx="29" ry="2.6" fill="#000" opacity="0.16"/>
    <clipPath id="cm"><path d="M4 18 L12 14 L20 18 L28 12 L38 17 L46 11 L54 16 L60 14 L60 55 L4 55Z"/></clipPath>
    <g clip-path="url(#cm)"><rect x="2" y="10" width="60" height="46" fill="#c07a4c"/>${ladrillos}</g>
    <path d="M4 18 L12 14 L20 18 L28 12 L38 17 L46 11 L54 16 L60 14 L60 55 L4 55Z" fill="none" stroke="${OUT}" stroke-width="2.6" stroke-linejoin="round"/>
    <rect x="3" y="44" width="58" height="9" fill="url(#peligro)" stroke="${OUT}" stroke-width="2"/>
    <path d="M30 14 L26 26 L31 33" stroke="${OUT}" stroke-width="1.6" fill="none" opacity="0.55"/>`;
  return svg(64, 56, c);
}

function colgante() {
  const cadena = x => Array.from({ length: 8 }, (_, i) => `<ellipse cx="${x}" cy="${4 + i * 10}" rx="3.2" ry="5.2" fill="none" stroke="#6b6e78" stroke-width="2.6" transform="rotate(${i % 2 ? 90 : 0} ${x} ${4 + i * 10})"/>`).join('');
  const c = `
    ${cadena(20)}${cadena(90)}
    <rect x="2" y="84" width="106" height="40" rx="6" fill="url(#madera)" stroke="${OUT}" stroke-width="3"/>
    <path d="M2 98 H108 M2 111 H108" stroke="#6b4223" stroke-width="2"/>
    <rect x="2" y="84" width="106" height="9" fill="url(#peligro)" stroke="${OUT}" stroke-width="2"/>
    <circle cx="12" cy="104" r="2.6" fill="#d0d4de" stroke="${OUT}" stroke-width="1.3"/><circle cx="98" cy="104" r="2.6" fill="#d0d4de" stroke="${OUT}" stroke-width="1.3"/>
    <path d="M55 120 l-10 -14 h20z" fill="#f2b138" stroke="${OUT}" stroke-width="2.2" stroke-linejoin="round"/>`;
  return svg(110, 130, c);
}

function pincho() {
  const estaca = (x, h) => `<path d="M${x} 30 L${x + 6} ${30 - h} L${x + 12} 30Z" fill="url(#madera)" stroke="${OUT}" stroke-width="2.2" stroke-linejoin="round"/>`;
  const c = `
    <ellipse cx="20" cy="30" rx="18" ry="2" fill="#000" opacity="0.16"/>
    ${estaca(3, 26)}${estaca(14, 29)}${estaca(25, 24)}
    <rect x="2" y="24" width="36" height="7" rx="1.5" fill="url(#peligro)" stroke="${OUT}" stroke-width="1.8"/>`;
  return svg(40, 32, c);
}

function pilar() {
  let piedras = '';
  for (let f = 0; f < 8; f += 1) {
    for (let k = 0; k < 3; k += 1) {
      piedras += `<rect x="${8 + k * 14 + (f % 2 ? -6 : 0)}" y="${18 + f * 12}" width="14" height="12" fill="${(f + k) % 2 ? '#a39e95' : '#b5afa5'}" stroke="${OUT}" stroke-width="1.3"/>`;
    }
  }
  const c = `
    <ellipse cx="28" cy="118" rx="25" ry="3" fill="#000" opacity="0.16"/>
    <clipPath id="cp"><rect x="7" y="14" width="42" height="106" rx="3"/></clipPath>
    <g clip-path="url(#cp)"><rect x="6" y="14" width="44" height="106" fill="#a39e95"/>${piedras}</g>
    <rect x="7" y="14" width="42" height="106" rx="3" fill="none" stroke="${OUT}" stroke-width="2.6"/>
    <rect x="1" y="2" width="54" height="14" rx="3" fill="url(#madera)" stroke="${OUT}" stroke-width="2.6"/>
    <rect x="1" y="2" width="54" height="5" fill="url(#peligro)" stroke="${OUT}" stroke-width="1.6"/>
    <rect x="7" y="106" width="42" height="12" fill="url(#peligro)" stroke="${OUT}" stroke-width="2"/>`;
  return svg(56, 120, c);
}

function caja() {
  const c = `
    <ellipse cx="24" cy="46" rx="20" ry="2" fill="#000" opacity="0.14"/>
    <rect x="3" y="3" width="42" height="42" rx="4" fill="url(#madera)" stroke="${OUT}" stroke-width="3"/>
    <path d="M7 7 L41 41 M41 7 L7 41" stroke="#6b4223" stroke-width="3"/>
    <rect x="3" y="33" width="42" height="9" fill="url(#peligro)" stroke="${OUT}" stroke-width="2"/>
    <circle cx="9" cy="9" r="2.2" fill="#d0d4de" stroke="${OUT}" stroke-width="1.2"/><circle cx="39" cy="9" r="2.2" fill="#d0d4de" stroke="${OUT}" stroke-width="1.2"/>`;
  return svg(48, 48, c);
}

function viveres() {
  const banano = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0 Q14 4 20 18 Q22 26 18 28 Q18 16 -2 8Z" fill="#ffd93b" stroke="${OUT}" stroke-width="2" stroke-linejoin="round"/><path d="M18 27 l3 3" stroke="#5a3a24" stroke-width="3" stroke-linecap="round"/><path d="M4 4 Q12 8 15 16" stroke="#fff3a0" stroke-width="1.6" fill="none" stroke-linecap="round"/></g>`;
  const c = `
    <circle cx="18" cy="18" r="17" fill="#fff6c8" opacity="0.5"/>
    ${banano(6, 4, -8)}${banano(10, 3, 8)}
    <path d="M6 4 l6 -3 5 4" stroke="#6b8e23" stroke-width="3" stroke-linecap="round" fill="none"/>`;
  return svg(36, 36, c);
}

function componente() {
  const c = `
    <circle cx="26" cy="26" r="24" fill="#2FA7A0" opacity="0.28" filter="url(#brillo)"/>
    <path d="M26 3 L45 14 L45 38 L26 49 L7 38 L7 14Z" fill="url(#ambar)" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M26 12 L38 19 L38 33 L26 40 L14 33 L14 19Z" fill="url(#cristal)" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round" filter="url(#brillo)"/>
    <path d="M20 20 L26 17 L30 20" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.85"/>`;
  return svg(52, 52, c);
}

function tajo() {
  const c = `
    <path d="M8 10 Q82 6 100 46 Q84 38 48 44 Q22 48 8 74 Q26 40 8 10Z" fill="#ffffff" stroke="#2FA7A0" stroke-width="3" stroke-linejoin="round" filter="url(#brillo)"/>
    <path d="M14 20 Q70 18 90 44" stroke="#bff9ff" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return svg(110, 80, c);
}

function corazon(lleno = true) {
  const rel = lleno ? '#e5483a' : '#6a6f7b';
  const c = `
    <path d="M16 28 Q2 18 2 10 Q2 3 9 3 Q14 3 16 8 Q18 3 23 3 Q30 3 30 10 Q30 18 16 28Z" fill="${rel}" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
    ${lleno ? '<path d="M7 9 Q8 6 11 6" stroke="#ffb3a8" stroke-width="2.2" fill="none" stroke-linecap="round"/>' : ''}`;
  return svg(32, 30, c);
}

function iconoAliado() {
  return svg(28, 28, `<circle cx="14" cy="14" r="12.5" fill="#3E7D3C" stroke="${OUT}" stroke-width="2"/>
    <circle cx="14" cy="11" r="4.3" fill="#dc9d64" stroke="${OUT}" stroke-width="1.5"/>
    <path d="M6.5 22 Q14 12.5 21.5 22" fill="#d9482f" stroke="${OUT}" stroke-width="1.5"/>`);
}

function iconoComp(lleno = true) {
  const rel = lleno ? 'url(#ambar)' : 'rgba(255,255,255,0.12)';
  const borde = lleno ? OUT : '#f2b138';
  return svg(28, 28, `<path d="M14 2 L25 10 L25 20 L14 27 L3 20 L3 10Z" fill="${rel}" stroke="${borde}" stroke-width="2.4" stroke-linejoin="round" ${lleno ? '' : 'stroke-dasharray="3 2.5"'}/>
    ${lleno ? '<path d="M14 8 L20 12 L20 18 L14 22 L8 18 L8 12Z" fill="url(#cristal)" stroke="' + OUT + '" stroke-width="1.5"/>' : ''}`);
}


function hueco() {
  const c = `
    <defs><linearGradient id="abismo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b3a2e"/><stop offset="1" stop-color="#120d0a"/></linearGradient></defs>
    <path d="M10 2 L130 2 L122 20 L114 38 L26 38 L18 20Z" fill="url(#abismo)" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M30 14 q8 -5 16 0 M64 22 q8 -5 16 0 M94 12 q8 -5 16 0" stroke="#bfeaf5" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.8"/>
    <rect x="0" y="0" width="20" height="9" rx="2" fill="url(#peligro)" stroke="${OUT}" stroke-width="2"/>
    <rect x="120" y="0" width="20" height="9" rx="2" fill="url(#peligro)" stroke="${OUT}" stroke-width="2"/>
    <path d="M22 4 l6 8 l-3 6 M118 4 l-6 8 l3 6" stroke="${OUT}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  return svg(140, 40, c);
}

function roca() {
  const c = `
    <ellipse cx="32" cy="54" rx="29" ry="2.6" fill="#000" opacity="0.16"/>
    <path d="M4 52 Q2 28 16 16 Q26 6 40 10 Q58 16 60 34 L60 52Z" fill="#b8825a" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M14 30 Q20 18 34 18" stroke="#e0b088" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M36 22 L32 34 L40 42" stroke="${OUT}" stroke-width="1.8" fill="none" opacity="0.55"/>
    <rect x="3" y="43" width="58" height="9" fill="url(#peligro)" stroke="${OUT}" stroke-width="2"/>`;
  return svg(64, 56, c);
}

function tronco() {
  const c = `
    <ellipse cx="36" cy="49" rx="32" ry="2.6" fill="#000" opacity="0.16"/>
    <rect x="4" y="12" width="64" height="34" rx="12" fill="url(#madera)" stroke="${OUT}" stroke-width="3"/>
    <ellipse cx="60" cy="29" rx="9" ry="17" fill="#d9a56a" stroke="${OUT}" stroke-width="2.6"/>
    <ellipse cx="60" cy="29" rx="5" ry="10" fill="none" stroke="#a8693d" stroke-width="2"/><circle cx="60" cy="29" r="1.8" fill="#a8693d"/>
    <path d="M10 22 H48 M12 34 H44" stroke="#6b4223" stroke-width="2" stroke-linecap="round"/>
    <rect x="22" y="12" width="12" height="34" fill="url(#peligro)" stroke="${OUT}" stroke-width="2"/>
    <ellipse cx="14" cy="14" rx="9" ry="3.4" fill="#6fae5a" stroke="#3f7a35" stroke-width="1.4"/>`;
  return svg(72, 52, c);
}

module.exports = {
  hueco, roca, tronco, muro, colgante, pincho, pilar, caja, viveres, componente, tajo,
  corazon: () => corazon(true), corazon_vacio: () => corazon(false),
  icono_aliado: iconoAliado, icono_comp: () => iconoComp(true), icono_comp_vacio: () => iconoComp(false)
};
