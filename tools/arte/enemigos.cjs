// Colosos: gigantes de piedra con ojos cian brillantes (siempre miran a la izquierda, hacia Aru).
const { OUT, svg, ojoBrillante } = require('./comun.cjs');

const grietas = (d) => `<path d="${d}" stroke="${OUT}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0.55"/>`;
const musgo = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#6fae5a" stroke="#3f7a35" stroke-width="1.2" opacity="0.95"/>`;

function errante() {
  const c = `
    <ellipse cx="30" cy="70" rx="20" ry="3" fill="#000" opacity="0.16"/>
    <rect x="16" y="52" width="13" height="17" rx="5" fill="url(#piedraOsc)" stroke="${OUT}" stroke-width="2.4"/>
    <rect x="31" y="52" width="13" height="17" rx="5" fill="url(#piedraOsc)" stroke="${OUT}" stroke-width="2.4"/>
    <path d="M14 33 Q11 22 24 20 Q38 19 46 27 Q51 38 46 53 L15 53 Q11 45 14 33Z" fill="url(#piedra)" stroke="${OUT}" stroke-width="2.6" stroke-linejoin="round"/>
    ${grietas('M30 24 L28 32 L33 38 M22 44 L27 48')}
    ${musgo(40, 25, 6, 3.4)}${musgo(20, 52, 5, 2.6)}
    <path d="M22 34 q4 -3 8 0 l-4 8z" fill="#3fd6e0" stroke="${OUT}" stroke-width="1.4" filter="url(#brillo)"/>
    <path d="M18 31 Q8 36 7 52" stroke="${OUT}" stroke-width="13" stroke-linecap="round" fill="none"/>
    <path d="M18 31 Q8 36 7 52" stroke="url(#piedraOsc)" stroke-width="9.5" stroke-linecap="round" fill="none"/>
    <circle cx="7" cy="54" r="7.4" fill="url(#piedra)" stroke="${OUT}" stroke-width="2.4"/>
    <rect x="12" y="6" width="26" height="19" rx="7" fill="url(#piedra)" stroke="${OUT}" stroke-width="2.6"/>
    ${ojoBrillante(19.5, 15.5)}${ojoBrillante(30.5, 15.5)}
    <path d="M16 21 L34 21" stroke="${OUT}" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="2.5 2"/>
    <path d="M13 8 l3 -4 3 4z" fill="url(#piedraOsc)" stroke="${OUT}" stroke-width="1.6" stroke-linejoin="round"/>`;
  return svg(60, 72, `<g transform="translate(2 0)">${c}</g>`, undefined, 0, 2);
}

function trepador() {
  const patas = [[-20, 8], [-12, 16], [12, 16], [20, 8]].map(([dx, dy]) =>
    `<path d="M32 38 L${32 + dx} ${38 + dy} L${32 + dx * 1.15} ${38 + dy + 9}" stroke="${OUT}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" fill="none"/>` +
    `<path d="M32 38 L${32 + dx} ${38 + dy} L${32 + dx * 1.15} ${38 + dy + 9}" stroke="#8f897f" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`).join('');
  const cadena = Array.from({ length: 5 }, (_, i) => `<ellipse cx="32" cy="${3 + i * 5}" rx="2.6" ry="3.4" fill="none" stroke="#5c5750" stroke-width="2"/>`).join('');
  const c = `
    ${cadena}
    ${patas}
    <circle cx="32" cy="38" r="17" fill="url(#piedra)" stroke="${OUT}" stroke-width="2.6"/>
    ${grietas('M24 30 L29 36 L26 44 M40 32 L36 38')}
    ${musgo(41, 28, 5, 3)}
    ${ojoBrillante(25.5, 36, 3.6, 2.6)}${ojoBrillante(38.5, 36, 3.6, 2.6)}
    <path d="M26 46 Q32 50 38 46" stroke="${OUT}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M30 23 l2 -4 2 4z" fill="#6e6a64" stroke="${OUT}" stroke-width="1.4"/>`;
  return svg(64, 64, c);
}

function estibador() {
  const caja = (x, y, w, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect width="${w}" height="${w}" rx="3" fill="url(#madera)" stroke="${OUT}" stroke-width="2.4"/>
    <path d="M3 3 L${w - 3} ${w - 3} M${w - 3} 3 L3 ${w - 3}" stroke="#6b4223" stroke-width="2.2"/><rect x="${w - 9}" y="${w - 9}" width="9" height="9" fill="url(#peligro)" stroke="${OUT}" stroke-width="1.4"/></g>`;
  const c = `
    <ellipse cx="88" cy="186" rx="62" ry="5" fill="#000" opacity="0.17"/>
    ${caja(112, 18, 36, 14)}${caja(100, 52, 40, -8)}
    <rect x="52" y="128" width="34" height="56" rx="10" fill="url(#piedraOsc)" stroke="${OUT}" stroke-width="3.4"/>
    <rect x="94" y="128" width="34" height="56" rx="10" fill="url(#piedraOsc)" stroke="${OUT}" stroke-width="3.4"/>
    <rect x="46" y="174" width="44" height="12" rx="6" fill="url(#piedra)" stroke="${OUT}" stroke-width="3"/>
    <rect x="90" y="174" width="44" height="12" rx="6" fill="url(#piedra)" stroke="${OUT}" stroke-width="3"/>
    <path d="M28 62 Q26 44 56 40 Q92 36 128 46 Q150 58 142 98 Q140 130 122 140 L56 140 Q30 128 28 62Z" fill="url(#piedra)" stroke="${OUT}" stroke-width="3.6" stroke-linejoin="round"/>
    ${grietas('M70 48 L66 70 L78 88 L72 110 M118 56 L112 82 L122 104')}
    ${musgo(124, 52, 11, 5.5)}${musgo(46, 56, 8, 4)}${musgo(60, 138, 9, 4)}
    <path d="M32 58 L132 126" stroke="#d8c58f" stroke-width="7" stroke-linecap="round"/><path d="M32 58 L132 126" stroke="#a88f58" stroke-width="2" stroke-dasharray="5 4"/>
    <rect x="34" y="112" width="106" height="14" rx="4" fill="url(#ambar)" stroke="${OUT}" stroke-width="2.6"/>
    <path d="M78 76 l11 -13 11 13 -11 17z" fill="url(#cristal)" stroke="${OUT}" stroke-width="2.4" filter="url(#brillo)"/>
    <path d="M44 66 Q16 84 14 120 L14 150" stroke="${OUT}" stroke-width="26" stroke-linecap="round" fill="none"/>
    <path d="M44 66 Q16 84 14 120 L14 150" stroke="url(#piedra)" stroke-width="21" stroke-linecap="round" fill="none"/>
    <circle cx="14" cy="154" r="15" fill="url(#piedra)" stroke="${OUT}" stroke-width="3.2"/>
    <path d="M136 70 Q158 84 152 118" stroke="${OUT}" stroke-width="22" stroke-linecap="round" fill="none"/>
    <path d="M136 70 Q158 84 152 118" stroke="url(#piedraOsc)" stroke-width="17" stroke-linecap="round" fill="none"/>
    <rect x="44" y="14" width="64" height="46" rx="16" fill="url(#piedra)" stroke="${OUT}" stroke-width="3.6"/>
    <path d="M52 16 l8 -12 8 12z M84 16 l8 -12 8 12z" fill="url(#piedraOsc)" stroke="${OUT}" stroke-width="2.6" stroke-linejoin="round"/>
    ${ojoBrillante(62, 34, 6.5, 4.4)}${ojoBrillante(90, 34, 6.5, 4.4)}
    <path d="M56 49 L96 49" stroke="${OUT}" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 4"/>
    ${grietas('M76 16 L73 26')}`;
  return svg(170, 190, `<g transform="translate(6 0)">${c}</g>`, undefined, 0, 6);
}


function canon() {
  const diente = (x, y, arriba) => `<path d="M${x} ${y} l5 ${arriba ? 12 : -12} l5 ${arriba ? -12 : 12}z" fill="#efe9dc" stroke="${OUT}" stroke-width="1.6" stroke-linejoin="round"/>`;
  const dientes = [34, 46, 58, 70, 82, 94].map(x => diente(x, 98, true) + diente(x, 122, false)).join('');
  const c = `
    <ellipse cx="100" cy="146" rx="84" ry="5" fill="#000" opacity="0.17"/>
    <path d="M60 60 L72 34 L84 58 L98 28 L112 58 L128 36 L136 64Z" fill="url(#piedraOsc)" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M52 142 Q44 70 100 56 Q166 50 176 142Z" fill="url(#piedra)" stroke="${OUT}" stroke-width="3.6" stroke-linejoin="round"/>
    ${grietas('M120 70 L116 92 L128 112 M146 84 L140 108')}
    ${musgo(150, 66, 13, 6)}${musgo(166, 128, 9, 4)}${musgo(70, 70, 9, 4)}
    <path d="M150 74 q-3 22 2 44 M162 80 q-3 20 0 38" stroke="#bfeaf5" stroke-width="3.4" fill="none" stroke-linecap="round" opacity="0.85"/>
    <rect x="12" y="44" width="100" height="84" rx="30" fill="url(#piedra)" stroke="${OUT}" stroke-width="3.6"/>
    <path d="M24 46 l8 -14 8 14z M86 44 l8 -14 8 14z" fill="url(#piedraOsc)" stroke="${OUT}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M22 96 Q62 80 104 96 L104 124 Q62 140 22 124Z" fill="#2a1a1a" stroke="${OUT}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M30 118 Q62 130 96 118" stroke="#6b2f2f" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.7"/>
    ${dientes}
    ${ojoBrillante(44, 68, 7, 4.8)}${ojoBrillante(82, 68, 7, 4.8)}
    <path d="M30 56 Q44 48 58 56 M68 56 Q82 48 96 56" stroke="${OUT}" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${musgo(60, 46, 14, 5)}
    <circle cx="18" cy="136" r="14" fill="url(#piedra)" stroke="${OUT}" stroke-width="3.2"/>
    ${grietas('M64 50 L60 62')}`;
  return svg(190, 150, `<g transform="translate(4 0)">${c}</g>`, undefined, 0, 4);
}

function apu() {
  const rama = (d, grosor = 8) => `<path d="${d}" stroke="${OUT}" stroke-width="${grosor + 3}" stroke-linecap="round" fill="none"/><path d="${d}" stroke="#8a5a2b" stroke-width="${grosor}" stroke-linecap="round" fill="none"/>`;
  const hojaV = (x, y, r) => `<ellipse cx="${x}" cy="${y}" rx="6" ry="3.4" fill="#5fc455" stroke="#2f6a35" stroke-width="1.4" transform="rotate(${r} ${x} ${y})"/>`;
  const liana = (x, largo) => `<path d="M${x} 100 q-6 ${largo / 3} 0 ${largo / 2} q6 ${largo / 3} 0 ${largo / 2}" stroke="#2f6a35" stroke-width="4.5" fill="none" stroke-linecap="round"/>${hojaV(x + 4, 100 + largo / 2, 30)}${hojaV(x - 4, 100 + largo * 0.8, -30)}`;
  const c = `
    <ellipse cx="110" cy="214" rx="80" ry="6" fill="#000" opacity="0.18"/>
    ${rama('M84 40 Q60 30 48 6 M66 30 Q48 28 36 24 M58 22 Q56 12 60 2', 7)}
    ${rama('M136 40 Q160 30 172 6 M154 30 Q172 28 184 24 M162 22 Q164 12 160 2', 7)}
    ${hojaV(48, 8, -40)}${hojaV(37, 25, 10)}${hojaV(172, 8, 40)}${hojaV(183, 25, -10)}${hojaV(60, 3, 70)}${hojaV(160, 3, -70)}
    <rect x="66" y="164" width="40" height="46" rx="12" fill="url(#piedraOsc)" stroke="${OUT}" stroke-width="3.4"/>
    <rect x="114" y="164" width="40" height="46" rx="12" fill="url(#piedraOsc)" stroke="${OUT}" stroke-width="3.4"/>
    <rect x="58" y="200" width="52" height="14" rx="7" fill="url(#piedra)" stroke="${OUT}" stroke-width="3"/>
    <rect x="110" y="200" width="52" height="14" rx="7" fill="url(#piedra)" stroke="${OUT}" stroke-width="3"/>
    ${musgo(86, 168, 12, 5)}${musgo(134, 170, 12, 5)}
    <path d="M32 90 Q30 64 70 58 Q110 52 150 58 Q190 66 188 100 Q186 150 156 172 L64 172 Q34 150 32 90Z" fill="url(#piedra)" stroke="${OUT}" stroke-width="3.8" stroke-linejoin="round"/>
    <path d="M36 80 Q70 60 110 66 Q150 60 184 82 Q176 66 150 62 Q110 54 70 62 Q44 66 36 80Z" fill="#6fae5a" stroke="#3f7a35" stroke-width="2.4"/>
    ${grietas('M80 76 L74 100 L88 124 L80 150 M140 80 L146 106 L134 130')}
    ${liana(60, 60)}${liana(160, 70)}${liana(100, 40)}
    <path d="M110 92 l16 -20 16 20 -16 28z" transform="translate(-16 6)" fill="url(#cristal)" stroke="${OUT}" stroke-width="3" filter="url(#brilloFuerte)"/>
    <circle cx="70" cy="88" r="3.6" fill="#ff6fa0" stroke="${OUT}" stroke-width="1"/><circle cx="154" cy="96" r="3.6" fill="#ffd93b" stroke="${OUT}" stroke-width="1"/><circle cx="146" cy="70" r="3.2" fill="#ff6fa0" stroke="${OUT}" stroke-width="1"/>
    <path d="M52 78 Q22 100 18 140 L18 176" stroke="${OUT}" stroke-width="32" stroke-linecap="round" fill="none"/>
    <path d="M52 78 Q22 100 18 140 L18 176" stroke="url(#piedra)" stroke-width="26" stroke-linecap="round" fill="none"/>
    <circle cx="18" cy="182" r="19" fill="url(#piedra)" stroke="${OUT}" stroke-width="3.4"/>${musgo(20, 168, 10, 4.4)}
    <path d="M168 78 Q196 98 198 138" stroke="${OUT}" stroke-width="28" stroke-linecap="round" fill="none"/>
    <path d="M168 78 Q196 98 198 138" stroke="url(#piedraOsc)" stroke-width="22" stroke-linecap="round" fill="none"/>
    <rect x="70" y="20" width="80" height="62" rx="26" fill="url(#piedra)" stroke="${OUT}" stroke-width="3.8"/>
    ${musgo(110, 24, 22, 6)}
    <path d="M78 74 Q92 100 100 92 Q110 108 120 92 Q128 100 142 74 Q124 84 110 82 Q96 84 78 74Z" fill="#5fc455" stroke="#2f6a35" stroke-width="2.4" stroke-linejoin="round"/>
    ${ojoBrillante(92, 52, 7, 5)}${ojoBrillante(128, 52, 7, 5)}
    <path d="M88 68 L132 68" stroke="${OUT}" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 4"/>`;
  return svg(232, 220, `<g transform="translate(8 0)">${c}</g>`, undefined, 0, 8);
}

module.exports = { errante, trepador, estibador, canon, apu };
