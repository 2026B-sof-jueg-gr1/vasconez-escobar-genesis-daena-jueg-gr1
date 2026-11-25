// Aru Chasqui (protagonista) y los civiles.
const { OUT, svg, miembro } = require('./comun.cjs');

const PIEL = '#dc9d64', PELO = '#2a1a14', TUNICA = '#f7eed8', BANDA = '#2FA7A0', PANT = '#7a4a2b', BOTA = '#5a3a24';

function pluma(x, y, rot, color) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0 Q-3.5 -9 0.5 -19 Q5 -9 0 0Z" fill="${color}" stroke="${OUT}" stroke-width="1.4" stroke-linejoin="round"/><path d="M0.3 -2 L0.4 -15" stroke="${OUT}" stroke-width="0.8" opacity="0.5"/></g>`;
}

function cabeza(dx = 0, dy = 0) {
  return `<g transform="translate(${dx} ${dy})">
    ${pluma(29, 9, -48, '#d94a3a')}${pluma(30, 9, -28, '#f4f4f4')}${pluma(31, 9, -8, '#3a7bd5')}
    <circle cx="25.5" cy="22" r="2.6" fill="${PIEL}" stroke="${OUT}" stroke-width="1.6"/>
    <path d="M24 20 Q24 8 34 8 Q44 8 44 20 Q44 31 34 32 Q24 31 24 20Z" fill="${PIEL}" stroke="${OUT}" stroke-width="2"/>
    <path d="M23 20 Q21.5 5.5 34 5.2 Q46.5 5.5 45 19 Q41 11.5 34 12.5 Q27 11.5 23 20Z" fill="${PELO}" stroke="${OUT}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M23.4 17 Q34 12 44.6 17 L44.6 20.4 Q34 15.4 23.4 20.4Z" fill="${BANDA}" stroke="${OUT}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M30 16.2 l2 1.2 -2 1.2z M36 15.4 l2 1.2 -2 1.2z" fill="#f2b138"/>
    <ellipse cx="38.6" cy="23" rx="3.1" ry="3.8" fill="#fff" stroke="${OUT}" stroke-width="1.2"/>
    <circle cx="39.7" cy="23.4" r="1.9" fill="#1b0f0a"/><circle cx="40.3" cy="22.4" r="0.7" fill="#fff"/>
    <path d="M35.6 18.8 Q38.8 17 42 18.6" stroke="${OUT}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M38.4 28.2 Q41 30.4 43.4 27.6" stroke="${OUT}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <circle cx="41.4" cy="26.4" r="2" fill="#e8806a" opacity="0.55"/>
  </g>`;
}

function torso(ropa = true) {
  return `
    <path d="M26 33 Q34 29.5 42 33 L45 57 Q34 61.5 23 57Z" fill="${TUNICA}" stroke="${OUT}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M28.5 33.6 L41 55" stroke="#8a5a35" stroke-width="3" stroke-linecap="round"/>
    <path d="M23.3 52.4 Q34 56.6 44.7 52.4 L45.2 57.6 Q34 62 22.8 57.6Z" fill="${BANDA}" stroke="${OUT}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M27 56.2 l2 -2 2 2 -2 2z M33 57.2 l2 -2 2 2 -2 2z M39 56.6 l2 -2 2 2 -2 2z" fill="#d94a3a"/>
    <rect x="37" y="45" width="10" height="10" rx="3" fill="#a8693d" stroke="${OUT}" stroke-width="1.6"/>
    <circle cx="42" cy="50" r="1.6" fill="#2FA7A0"/>
    <path d="M25 58 L44 58 L45 64 Q34 66.5 23.5 64Z" fill="${PANT}" stroke="${OUT}" stroke-width="1.6" stroke-linejoin="round"/>`;
}

function bota(x, y, giro = 0) {
  return `<g transform="translate(${x} ${y}) rotate(${giro})"><path d="M-5 -4 Q-5 -7 -1 -7 L3 -7 Q9 -6 9 -1 Q9 2.5 4 2.5 L-5 2.5Z" fill="${BOTA}" stroke="${OUT}" stroke-width="1.8" stroke-linejoin="round"/></g>`;
}

function aru(pose) {
  const poses = {
    correr1: { rot: 7, trasera: [[32, 60], [23, 71], [13, 76]], botaT: [12, 78, 20], delantera: [[37, 60], [45, 72], [51, 82]], botaD: [54, 84, 0],
               brazoT: [[30, 37], [22, 44], [15, 50]], brazoD: [[39, 37], [47, 43], [54, 37]] },
    correr2: { rot: 9, trasera: [[32, 60], [40, 68], [32, 76]], botaT: [30, 78, 10], delantera: [[37, 60], [37, 72], [34, 83]], botaD: [38, 85, 0],
               brazoT: [[39, 37], [47, 44], [53, 50]], brazoD: [[30, 37], [22, 43], [15, 37]] },
    salto:   { rot: 0, trasera: [[32, 60], [24, 68], [31, 74]], botaT: [33, 76, 10], delantera: [[37, 60], [47, 66], [41, 75]], botaD: [43, 77, 15],
               brazoT: [[30, 37], [21, 32], [16, 22]], brazoD: [[39, 37], [48, 31], [53, 22]] }
  };
  const p = poses[pose];
  const piernaT = miembro(p.trasera, 7.5, '#6a3f24') + bota(...p.botaT);
  const piernaD = miembro(p.delantera, 7.5, PANT) + bota(...p.botaD);
  const brazoT = miembro(p.brazoT, 5.5, '#c88a55') + `<circle cx="${p.brazoT[2][0]}" cy="${p.brazoT[2][1]}" r="3.3" fill="#c88a55" stroke="${OUT}" stroke-width="1.5"/>`;
  const brazoD = miembro(p.brazoD, 5.5, PIEL) + `<circle cx="${p.brazoD[2][0]}" cy="${p.brazoD[2][1]}" r="3.3" fill="${PIEL}" stroke="${OUT}" stroke-width="1.5"/>`;
  const soga = `<path d="M${p.brazoD[2][0] - 2} ${p.brazoD[2][1] + 2} q4 5 0 9 q-5 3 -2 8" stroke="#e6d6a4" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  const cuerpo = `
    <ellipse cx="34" cy="86" rx="16" ry="2.6" fill="#000" opacity="0.14"/>
    ${brazoT}${piernaT}
    <g transform="rotate(${p.rot} 34 60)">${torso()}${cabeza()}</g>
    ${piernaD}${soga}${brazoD}`;
  return svg(64, 88, cuerpo, undefined, 12);
}

function aruDeslizar() {
  // Aru agachado, deslizándose hacia la derecha.
  const cuerpo = `
    <ellipse cx="42" cy="52" rx="34" ry="3" fill="#000" opacity="0.14"/>
    <path d="M4 50 L22 49" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity="0.55"/>
    <path d="M0 44 L16 44" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
    ${miembro([[34, 42], [52, 46], [68, 49]], 7.5, '#6a3f24')}
    <g transform="translate(70 49) rotate(-10)"><path d="M-4 -5 Q-4 -7 0 -7 L3 -7 Q8 -5 8 0 Q8 3 4 3 L-4 3Z" fill="${BOTA}" stroke="${OUT}" stroke-width="1.8"/></g>
    <g transform="translate(6 22) rotate(70 34 60) scale(0.78)">${torso()}</g>
    ${miembro([[34, 38], [46, 42], [58, 44]], 5.5, PIEL)}
    <circle cx="58" cy="44" r="3.1" fill="${PIEL}" stroke="${OUT}" stroke-width="1.5"/>
    <g transform="translate(18 18) scale(0.82)">${cabeza()}</g>
    ${miembro([[36, 44], [50, 48], [64, 49]], 7.5, PANT)}`;
  return svg(80, 56, cuerpo);
}

function civil(variante = 0) {
  const poncho = variante === 0 ? ['#d9482f', '#f2b138'] : ['#2FA7A0', '#f4f4f4'];
  const cuerpo = `
    <circle cx="20" cy="38" r="19" fill="#9be29b" opacity="0.3"/>
    <ellipse cx="20" cy="61" rx="11" ry="2.4" fill="#000" opacity="0.14"/>
    ${miembro([[16, 50], [15, 58]], 4.5, '#5a3a24')}${miembro([[24, 50], [25, 58]], 4.5, '#5a3a24')}
    ${miembro([[27, 30], [33, 20], [36, 10]], 4.5, '#dc9d64')}<circle cx="36" cy="9" r="3" fill="#dc9d64" stroke="${OUT}" stroke-width="1.4"/>
    <path d="M9 52 Q8 33 20 28 Q32 33 31 52Z" fill="${poncho[0]}" stroke="${OUT}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M9.5 46 H30.5 M9.2 49.5 H30.8" stroke="${poncho[1]}" stroke-width="2.4"/>
    <path d="M13 40 l2 -2 2 2 -2 2z M19 40 l2 -2 2 2 -2 2z M25 40 l2 -2 2 2 -2 2z" fill="${poncho[1]}"/>
    ${miembro([[13, 31], [8, 38], [6, 44]], 4.5, '#c88a55')}
    <circle cx="20" cy="20" r="8.6" fill="#dc9d64" stroke="${OUT}" stroke-width="1.8"/>
    <path d="M10.5 17 Q20 3.5 29.5 17 Q20 12 10.5 17Z" fill="#7a4a2b" stroke="${OUT}" stroke-width="1.8" stroke-linejoin="round"/>
    <rect x="8.5" y="15.4" width="23" height="3" rx="1.5" fill="#5a3a24" stroke="${OUT}" stroke-width="1.4"/>
    <circle cx="23" cy="21" r="1.7" fill="#1b0f0a"/><circle cx="23.5" cy="20.4" r="0.55" fill="#fff"/>
    <path d="M22 25.2 Q24 26.8 26 25" stroke="${OUT}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <circle cx="25.6" cy="23.6" r="1.6" fill="#e8806a" opacity="0.55"/>`;
  return svg(40, 64, cuerpo);
}

module.exports = {
  aru_correr1: () => aru('correr1'),
  aru_correr2: () => aru('correr2'),
  aru_salto: () => aru('salto'),
  aru_desliz: aruDeslizar,
  civil: () => civil(0)
};
