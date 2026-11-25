// Fondos de cada región: cielo fijo y tres capas repetibles (nubes, lejos, cerca) + suelo.
// Las capas miden 800 px de ancho y encajan sin costuras (todo se dibuja también en x±800).
const { OUT, svg } = require('./comun.cjs');

const W = 800;
const rep = f => [-W, 0, W].map(f).join('');
const marco = (w, h, cuerpo) => svg(w, h, cuerpo, 1);

function ondaPath(base, amp, ciclos, fase = 0, paso = 10, cierreY = null) {
  let d = '';
  for (let x = 0; x <= W; x += paso) {
    const y = base + amp * Math.sin((2 * Math.PI * ciclos * x) / W + fase);
    d += (x === 0 ? 'M' : ' L') + `${x} ${y.toFixed(1)}`;
  }
  if (cierreY !== null) d += ` L${W} ${cierreY} L0 ${cierreY}Z`;
  return d;
}

function nube(cx, cy, s, tinte = '#ffffff') {
  return `<g transform="translate(${cx} ${cy}) scale(${s})">
    <ellipse cx="0" cy="12" rx="64" ry="15" fill="#d6e8f2"/>
    <circle cx="-32" cy="2" r="21" fill="${tinte}"/><circle cx="0" cy="-12" r="30" fill="${tinte}"/><circle cx="34" cy="0" r="22" fill="${tinte}"/>
    <ellipse cx="0" cy="8" rx="62" ry="13" fill="${tinte}"/></g>`;
}

function palma(x, gy, escala = 1) {
  const hojas = [-165, -135, -105, -75, -45, -15, 15].map(a => `<g transform="rotate(${a} 0 0)"><path d="M0 0 C16 -26 54 -26 78 8 C54 -8 24 -8 0 0Z" fill="#3fae4f" stroke="#1f6b32" stroke-width="2.4" stroke-linejoin="round"/><path d="M4 -3 C26 -12 48 -9 66 4" stroke="#2c8a3e" stroke-width="2" fill="none"/></g>`).join('');
  return `<g transform="translate(${x} ${gy}) scale(${escala})">
    <path d="M0 0 Q16 -50 6 -112" stroke="#5a3a24" stroke-width="14" stroke-linecap="round" fill="none"/>
    <path d="M0 0 Q16 -50 6 -112" stroke="#b07a48" stroke-width="9.5" stroke-linecap="round" fill="none"/>
    <path d="M3 -22 l8 -2 M7 -46 l8 -2 M9 -70 l8 -2 M8 -92 l8 -2" stroke="#7d5230" stroke-width="2" stroke-linecap="round"/>
    <g transform="translate(6 -112)">${hojas}<circle cx="0" cy="2" r="6" fill="#8a5a2b" stroke="#4d3216" stroke-width="2"/><circle cx="-6" cy="8" r="5" fill="#8a5a2b" stroke="#4d3216" stroke-width="2"/></g></g>`;
}

function casa(x, gy, ancho, alto, pared, techo, ruina = false) {
  const ventana = (vx, vy) => `<rect x="${vx}" y="${vy}" width="14" height="16" rx="2" fill="#bfe9f5" stroke="${OUT}" stroke-width="2"/><path d="M${vx + 7} ${vy} v16 M${vx} ${vy + 8} h14" stroke="${OUT}" stroke-width="1.4"/>`;
  const techoPath = ruina
    ? `M${-6} ${-alto} L${ancho * 0.45} ${-alto - 34} L${ancho * 0.62} ${-alto - 12} L${ancho * 0.55} ${-alto + 2} L${ancho * 0.8} ${-alto - 8} L${ancho + 6} ${-alto}Z`
    : `M-8 ${-alto} L${ancho / 2} ${-alto - 38} L${ancho + 8} ${-alto}Z`;
  return `<g transform="translate(${x} ${gy})">
    <rect x="0" y="${-alto}" width="${ancho}" height="${alto}" fill="${pared}" stroke="${OUT}" stroke-width="2.6"/>
    ${ruina ? `<path d="M${ancho * 0.55} ${-alto} l8 12 l-6 8 l10 10" stroke="${OUT}" stroke-width="2" fill="none"/>` : ''}
    <path d="${techoPath}" fill="${techo}" stroke="${OUT}" stroke-width="2.6" stroke-linejoin="round"/>
    ${ventana(10, -alto + 14)}${ventana(ancho - 24, -alto + 14)}
    <rect x="${ancho / 2 - 8}" y="-28" width="16" height="28" rx="3" fill="#7a4a2b" stroke="${OUT}" stroke-width="2"/>
    ${ruina ? `<rect x="${ancho + 2}" y="-8" width="14" height="8" rx="2" fill="#a39e95" stroke="${OUT}" stroke-width="1.6"/><rect x="${ancho + 12}" y="-14" width="10" height="6" rx="2" fill="#b5afa5" stroke="${OUT}" stroke-width="1.4"/>` : ''}</g>`;
}

function eucalipto(x, gy, alto) {
  return `<g transform="translate(${x} ${gy})"><path d="M0 0 L0 ${-alto * 0.7}" stroke="${OUT}" stroke-width="9" stroke-linecap="round"/><path d="M0 0 L0 ${-alto * 0.7}" stroke="#b8946a" stroke-width="5.5" stroke-linecap="round"/>
    <ellipse cx="-4" cy="${-alto * 0.78}" rx="20" ry="${alto * 0.2}" fill="#5aa05a" stroke="#2f6a35" stroke-width="2.4"/>
    <ellipse cx="9" cy="${-alto * 0.94}" rx="17" ry="${alto * 0.17}" fill="#6ab66a" stroke="#2f6a35" stroke-width="2.4"/></g>`;
}

function arbusto(x, gy, s, flores) {
  const fl = flores.map((c, i) => `<circle cx="${x + (i - 1.5) * 9 * s}" cy="${gy - 14 * s - (i % 2) * 6 * s}" r="${3.4 * s}" fill="${c}" stroke="${OUT}" stroke-width="1"/>`).join('');
  return `<g><ellipse cx="${x}" cy="${gy - 8 * s}" rx="${24 * s}" ry="${14 * s}" fill="#4fae56" stroke="#2f6a35" stroke-width="2.4"/>${fl}</g>`;
}

function cielo(c1, c2, c3, solX, solY, solColor) {
  return svg(800, 600, `
    <defs><linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="0.6" stop-color="${c2}"/><stop offset="1" stop-color="${c3}"/></linearGradient>
    <radialGradient id="sol"><stop offset="0" stop-color="#fffbe0"/><stop offset="1" stop-color="${solColor}"/></radialGradient></defs>
    <rect width="800" height="600" fill="url(#cielo)"/>
    <circle cx="${solX}" cy="${solY}" r="110" fill="#fff6c8" opacity="0.28"/><circle cx="${solX}" cy="${solY}" r="74" fill="#fff6c8" opacity="0.4"/>
    <circle cx="${solX}" cy="${solY}" r="44" fill="url(#sol)"/>`, 1);
}

// ---------------- Nivel 1: Atacames (Costa) ----------------
const nubes1 = () => marco(800, 200, rep(dx => nube(120 + dx, 60, 1.1) + nube(430 + dx, 110, 0.8) + nube(660 + dx, 50, 1)));

function lejos1() {
  const olas = [190, 215, 240, 268].map((y, i) => `<path d="${ondaPath(y, 3.2, 8 + i * 2, i)}" stroke="#ffffff" stroke-width="2.2" fill="none" opacity="${0.55 - i * 0.08}" stroke-linecap="round"/>`).join('');
  const faro = `<g transform="translate(540 0)"><path d="M0 170 L8 80 L30 80 L38 170Z" fill="#f4f1ea" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M3 140 L35 140 L33 124 L5 124Z M7 108 L31 108 L30 94 L8 94Z" fill="#d94a3a"/><path d="M6 80 L10 62 L16 70 L22 56 L28 68 L32 80Z" fill="#f4f1ea" stroke="${OUT}" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M22 56 l4 -8" stroke="${OUT}" stroke-width="2"/></g>`;
  const velero = `<g transform="translate(170 150)"><path d="M0 14 L40 14 L33 24 L7 24Z" fill="#d9482f" stroke="${OUT}" stroke-width="2" stroke-linejoin="round"/><path d="M20 12 L20 -22 L2 8Z" fill="#fff" stroke="${OUT}" stroke-width="1.8"/><path d="M22 12 L22 -14 L36 8Z" fill="#f2b138" stroke="${OUT}" stroke-width="1.8"/></g>`;
  return marco(800, 300, `
    <defs><linearGradient id="mar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#53d1db"/><stop offset="1" stop-color="#1c97a8"/></linearGradient></defs>
    <rect y="160" width="800" height="140" fill="url(#mar)"/>
    <path d="${ondaPath(165, 0, 1, 0, 40, 160)}" fill="url(#mar)"/>
    <rect y="156" width="800" height="5" fill="#bdf3f6" opacity="0.8"/>
    ${olas}${rep(dx => `<g transform="translate(${dx} 0)">${faro}${velero}</g>`)}`);
}

function cerca1() {
  const g = 260;
  return marco(800, 260, rep(dx => `<g transform="translate(${dx} 0)" opacity="0.97">
    ${palma(70, g, 1)}${casa(150, g, 96, 62, '#ffe27a', '#d9482f')}${arbusto(290, g, 1, ['#ff6fa0', '#fff', '#ffd93b', '#ff6fa0'])}
    ${palma(380, g, 0.85)}${casa(470, g, 92, 58, '#7fe0d4', '#b5543a', true)}${arbusto(610, g, 0.9, ['#ffd93b', '#ff6fa0', '#fff', '#ffd93b'])}
    ${palma(690, g, 1.05)}</g>`));
}

const suelo1 = () => marco(128, 80, `
  <defs><linearGradient id="arena" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7e6b8"/><stop offset="1" stop-color="#dfbb7a"/></linearGradient></defs>
  <rect width="128" height="80" fill="url(#arena)"/>
  <rect y="0" width="128" height="5" fill="#8d6e3f"/><rect y="5" width="128" height="3" fill="#c9a766"/>
  <g fill="#cfa965"><circle cx="14" cy="34" r="3.4"/><circle cx="52" cy="58" r="4.4"/><circle cx="84" cy="30" r="3"/><circle cx="108" cy="62" r="4"/><circle cx="30" cy="68" r="2.6"/></g>
  <path d="M60 22 q4 -6 8 0 q-4 4 -8 0Z M20 50 q3 -5 7 0 q-3 3 -7 0Z" fill="#f4b6a8" stroke="#c98a7a" stroke-width="1"/>`);

// ---------------- Nivel 2: Ambato (Sierra) ----------------
const nubes2 = () => marco(800, 200, rep(dx => nube(90 + dx, 70, 1) + nube(360 + dx, 40, 0.8, '#fbf6ff') + nube(600 + dx, 100, 1.1)));

function lejos2() {
  const volcan = `<g transform="translate(400 0)">
    <path d="M-250 300 L-40 62 Q0 40 40 62 L250 300Z" fill="#7b92c8" stroke="${OUT}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M-60 100 L-40 62 Q0 40 40 62 L58 98 L40 88 L24 104 L6 86 L-12 106 L-30 90Z" fill="#fbfdff" stroke="${OUT}" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M-120 200 L-70 150 L-40 190 L0 140 L40 190 L80 150 L130 200" stroke="#6379b0" stroke-width="3" fill="none" opacity="0.6"/>
    <path d="M0 52 Q-16 24 6 4 Q30 -10 16 -34" stroke="#e8eaf2" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.7"/></g>`;
  return marco(800, 300, `
    <path d="${ondaPath(150, 22, 2, 0.6, 10, 300)}" fill="#b3c3e6"/>
    <path d="${ondaPath(190, 16, 3, 1.4, 10, 300)}" fill="#97abd8"/>
    ${volcan}
    <path d="${ondaPath(240, 14, 4, 0.2, 10, 300)}" fill="#86c26f" stroke="#4f9340" stroke-width="2"/>
    <path d="${ondaPath(272, 9, 5, 2.2, 10, 300)}" fill="#6fb35c" stroke="#3f7a35" stroke-width="2"/>`);
}

function cerca2() {
  const g = 260;
  const torre = `<g transform="translate(715 ${g})"><path d="M0 0 L0 -86 L10 -92 L16 -80 L24 -90 L34 -84 L34 0Z" fill="#c9c2b4" stroke="${OUT}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M17 -80 L13 -62 L19 -50" stroke="${OUT}" stroke-width="2" fill="none"/><rect x="9" y="-64" width="16" height="22" rx="8" fill="#6a6f7b" stroke="${OUT}" stroke-width="2"/>
    <rect x="-8" y="-6" width="20" height="6" rx="2" fill="#a39e95" stroke="${OUT}" stroke-width="1.5"/></g>`;
  return marco(800, 260, rep(dx => `<g transform="translate(${dx} 0)" opacity="0.97">
    ${eucalipto(40, g, 150)}${casa(90, g, 90, 60, '#fff3e0', '#c0442e')}${arbusto(230, g, 1, ['#ff4f7b', '#ffd93b', '#fff', '#ff4f7b'])}
    ${eucalipto(310, g, 170)}${casa(360, g, 96, 66, '#ffe3b8', '#c0442e')}${arbusto(500, g, 0.95, ['#ffd93b', '#ff4f7b', '#fff', '#ffd93b'])}
    ${eucalipto(560, g, 140)}${casa(590, g, 78, 54, '#f5d7e8', '#b5543a')}${torre}</g>`));
}

const suelo2 = () => marco(128, 80, `
  <defs><linearGradient id="tierra" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b07a48"/><stop offset="1" stop-color="#8a5a30"/></linearGradient></defs>
  <rect width="128" height="80" fill="url(#tierra)"/>
  <rect y="0" width="128" height="14" fill="#6fbf4a"/><rect y="0" width="128" height="4" fill="#2f6a35"/><rect y="12" width="128" height="4" fill="#4f9a3a"/>
  <path d="M8 14 l3 -7 3 7 M44 14 l3 -9 3 9 M90 14 l3 -7 3 7 M116 14 l2 -6 3 6" stroke="#2f6a35" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g fill="#7d5230"><circle cx="20" cy="42" r="4"/><circle cx="64" cy="62" r="5"/><circle cx="100" cy="38" r="3.4"/><circle cx="40" cy="70" r="2.8"/></g>`);


// ---------------- Nivel 3: Pailón del Diablo (Baños) ----------------
const nubes3 = () => marco(800, 200, rep(dx => nube(100 + dx, 60, 1.1, '#f0f4fa') + nube(380 + dx, 100, 0.9, '#e6edf6') + nube(640 + dx, 44, 1, '#f0f4fa')));

function helecho(x, gy, s) {
  const hojas = [-70, -40, -10, 20, 50, 80].map(a => `<path d="M0 0 Q${10 * s} ${-26 * s} ${34 * s} ${-30 * s}" transform="rotate(${a - 90 + 90} 0 0) rotate(-90)" stroke="#2f7a3a" stroke-width="${3 * s}" fill="none" stroke-linecap="round"/>`).join('');
  return `<g transform="translate(${x} ${gy})"><ellipse cx="0" cy="-10" rx="${24 * s}" ry="${14 * s}" fill="#3fa24a" stroke="#1f6b32" stroke-width="2.2"/>
    <path d="M-14 -6 Q-8 -26 0 -20 Q8 -28 14 -6" fill="#56c25f" stroke="#1f6b32" stroke-width="1.8"/></g>`;
}

function lejos3() {
  const cascada = `<g transform="translate(470 0)">
    <path d="M-30 40 L60 40 L54 260 L-24 260Z" fill="#e9fbff" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M-14 46 L-10 250 M10 46 L12 256 M34 46 L34 250" stroke="#a6e0f0" stroke-width="5" opacity="0.8" stroke-linecap="round"/>
    <ellipse cx="14" cy="262" rx="62" ry="14" fill="#ffffff" opacity="0.85"/><ellipse cx="14" cy="258" rx="40" ry="9" fill="#bfeaf5" opacity="0.9"/></g>`;
  const cerro = (x, w, h, c) => `<path d="M${x - w} 280 Q${x - w * 0.4} ${280 - h} ${x} ${280 - h} Q${x + w * 0.4} ${280 - h} ${x + w} 280Z" fill="${c}" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>`;
  return marco(800, 300, `
    <path d="${ondaPath(120, 18, 2, 0.4, 10, 300)}" fill="#c7d6e8" opacity="0.9"/>
    ${rep(dx => `<g transform="translate(${dx} 0)">${cerro(130, 190, 180, '#5f9a6a')}${cerro(700, 200, 200, '#4f8a5e')}${cerro(430, 170, 120, '#6aa874')}${cascada}</g>`)}
    <path d="${ondaPath(262, 8, 5, 1, 10, 300)}" fill="#3f8a4f" stroke="#2f6a35" stroke-width="2"/>`);
}

function cerca3() {
  const g = 260;
  const poste = x => `<g transform="translate(${x} ${g})"><rect x="-5" y="-92" width="10" height="92" rx="3" fill="#8a5a2b" stroke="${OUT}" stroke-width="2.4"/><rect x="-9" y="-96" width="18" height="8" rx="3" fill="#a8693d" stroke="${OUT}" stroke-width="2"/></g>`;
  const puente = `<g><path d="M200 ${g - 70} Q300 ${g - 40} 400 ${g - 70}" stroke="${OUT}" stroke-width="9" fill="none"/><path d="M200 ${g - 70} Q300 ${g - 40} 400 ${g - 70}" stroke="#d9a56a" stroke-width="5" fill="none"/>
    ${[220, 250, 280, 310, 340, 370].map(x => `<path d="M${x} ${g - 66 + Math.abs(x - 300) * 0.0} L${x} ${g - 44}" stroke="#a8693d" stroke-width="3"/>`).join('')}</g>`;
  return marco(800, 260, rep(dx => `<g transform="translate(${dx} 0)" opacity="0.97">
    ${helecho(60, g, 1.2)}${poste(200)}${poste(400)}${puente}${helecho(470, g, 1)}
    ${casa(540, g, 90, 58, '#cfe9d6', '#8a4a2e')}${helecho(680, g, 1.3)}${helecho(750, g, 0.9)}</g>`));
}

const suelo3 = () => marco(128, 80, `
  <defs><linearGradient id="piedraSuelo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9a9a8a"/><stop offset="1" stop-color="#6e6e62"/></linearGradient></defs>
  <rect width="128" height="80" fill="url(#piedraSuelo)"/>
  <rect y="0" width="128" height="10" fill="#6fae5a"/><rect y="0" width="128" height="3" fill="#2f6a35"/>
  <path d="M0 40 H128 M32 10 V40 M96 10 V40 M64 40 V80" stroke="#55554a" stroke-width="2.4" fill="none"/>
  <g fill="#bfeaf5" opacity="0.7"><circle cx="20" cy="26" r="2.6"/><circle cx="76" cy="58" r="2.6"/><circle cx="110" cy="24" r="2.2"/></g>`);

// ---------------- Nivel 4: Misahuallí (Amazonía) ----------------
const nubes4 = () => marco(800, 200, rep(dx => nube(110 + dx, 50, 1, '#fff7e8') + nube(400 + dx, 96, 1.1, '#ffeed6') + nube(650 + dx, 40, 0.85, '#fff7e8')));

function arbolSelva(x, gy, alto, copa) {
  return `<g transform="translate(${x} ${gy})"><path d="M-8 0 L-5 ${-alto} L5 ${-alto} L8 0Z" fill="#7a4a24" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
    <ellipse cx="0" cy="${-alto}" rx="${alto * 0.46}" ry="${alto * 0.26}" fill="${copa}" stroke="#1f5a2c" stroke-width="2.6"/>
    <ellipse cx="${alto * 0.2}" cy="${-alto - alto * 0.1}" rx="${alto * 0.26}" ry="${alto * 0.16}" fill="#4fbf5a" stroke="#1f5a2c" stroke-width="2"/>
    <path d="M${-alto * 0.2} ${-alto + 6} q-4 24 0 40 M${alto * 0.16} ${-alto + 8} q4 22 0 36" stroke="#2f6a35" stroke-width="3" fill="none" stroke-linecap="round"/></g>`;
}

function lejos4() {
  const rio = `<path d="M0 262 Q200 248 400 262 T800 262 L800 300 L0 300Z" fill="#9a7a4a" stroke="#6b4a24" stroke-width="2"/><path d="M40 276 q40 -6 80 0 M300 282 q50 -6 100 0 M560 274 q40 -6 90 0" stroke="#c9a76a" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  return marco(800, 300, `
    <path d="${ondaPath(130, 20, 3, 0.2, 10, 300)}" fill="#a9d8b8" opacity="0.9"/>
    <path d="${ondaPath(176, 18, 4, 1.2, 10, 300)}" fill="#6fbf86"/>
    <path d="${ondaPath(214, 14, 5, 0.4, 10, 300)}" fill="#3fa062" stroke="#2f7a45" stroke-width="2"/>
    ${rio}`);
}

function cerca4() {
  const g = 260;
  const antena = `<g transform="translate(600 ${g})"><path d="M-14 0 L-6 -120 L6 -120 L14 0Z" fill="#c9c2b4" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M-10 -30 L10 -60 M10 -30 L-10 -60 M-8 -70 L8 -100 M8 -70 L-8 -100" stroke="${OUT}" stroke-width="2" fill="none"/>
    <circle cx="0" cy="-128" r="8" fill="#d94a3a" stroke="${OUT}" stroke-width="2"/>
    <path d="M-20 -128 q-8 -10 0 -20 M20 -128 q8 -10 0 -20" stroke="#8a8f9a" stroke-width="2.4" fill="none" stroke-linecap="round" opacity="0.8"/>
    <rect x="-34" y="-30" width="22" height="30" fill="#e0d7c3" stroke="${OUT}" stroke-width="2.2"/><rect x="-32" y="-34" width="26" height="6" rx="2" fill="#a05a3a" stroke="${OUT}" stroke-width="2"/></g>`;
  return marco(800, 260, rep(dx => `<g transform="translate(${dx} 0)" opacity="0.97">
    ${arbolSelva(60, g, 150, '#2f9a4a')}${arbusto(150, g, 1.1, ['#ff6fa0', '#ffd93b', '#fff', '#ff6fa0'])}${arbolSelva(250, g, 120, '#3fae52')}
    ${casa(330, g, 88, 58, '#e8c88a', '#6b8f3a')}${arbolSelva(470, g, 160, '#2a8a42')}${antena}${arbolSelva(720, g, 130, '#3fae52')}</g>`));
}

const suelo4 = () => marco(128, 80, `
  <defs><linearGradient id="barro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a8693d"/><stop offset="1" stop-color="#6b4223"/></linearGradient></defs>
  <rect width="128" height="80" fill="url(#barro)"/>
  <rect y="0" width="128" height="12" fill="#4fae56"/><rect y="0" width="128" height="4" fill="#1f6b32"/><rect y="10" width="128" height="4" fill="#3a8a44"/>
  <path d="M10 12 l3 -8 3 8 M50 12 l3 -9 3 9 M96 12 l3 -8 3 8" stroke="#1f6b32" stroke-width="2" fill="none" stroke-linecap="round"/>
  <g fill="#85502a"><circle cx="22" cy="38" r="4"/><circle cx="70" cy="60" r="5"/><circle cx="104" cy="40" r="3.4"/></g>
  <path d="M40 30 q10 -6 18 0" stroke="#ffd93b" stroke-width="2.4" fill="none" stroke-linecap="round"/>`);

module.exports = {
  cielo_1: () => cielo('#63c9f0', '#b8ecfa', '#fff0c4', 640, 120, '#ffd23f'),
  nubes_1: nubes1, lejos_1: lejos1, cerca_1: cerca1, suelo_1: suelo1,
  cielo_2: () => cielo('#7aa9f5', '#cfe3ff', '#fff3d6', 150, 120, '#ffc94d'),
  nubes_2: nubes2, lejos_2: lejos2, cerca_2: cerca2, suelo_2: suelo2,
  cielo_3: () => cielo('#8fb4d8', '#d4e6f2', '#f4f8f4', 160, 110, '#e9eef5'),
  nubes_3: nubes3, lejos_3: lejos3, cerca_3: cerca3, suelo_3: suelo3,
  cielo_4: () => cielo('#ffb86b', '#ffd9a0', '#fff2cf', 620, 150, '#ff8a3d'),
  nubes_4: nubes4, lejos_4: lejos4, cerca_4: cerca4, suelo_4: suelo4
};
