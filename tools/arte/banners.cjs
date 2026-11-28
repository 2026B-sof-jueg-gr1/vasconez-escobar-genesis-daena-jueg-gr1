// Genera los banners de color del GDD (docs/banners/*.png).  Uso: node arte/banners.cjs
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const raiz = path.resolve(__dirname, '..', '..');
const sal = path.join(raiz, 'docs', 'banners');
fs.mkdirSync(sal, { recursive: true });
const S = n => path.join(raiz, 'juego', 'assets', 'sprites', n + '.png');
const F = n => path.join(raiz, 'juego', 'assets', 'fondos', n + '.png');
const FUENTE = 'DejaVu Sans, Arial, sans-serif';

const SECCIONES = [
  { n: 1, color: '#ff6b5b', txt: '#ffffff', frase: 'La identidad del juego en menos de un minuto', icono: 'aru_correr1', h: 78 },
  { n: 2, color: '#22b6ae', txt: '#ffffff', frase: 'Qué hace único al juego y qué debe sentir el jugador', icono: 'corazon', h: 44 },
  { n: 3, color: '#f2b138', txt: '#23314a', frase: 'Qué hace el jugador segundo a segundo', icono: 'tajo', h: 56 },
  { n: 4, color: '#3fae52', txt: '#ffffff', frase: 'Un mundo en ruinas, un mensajero y los Colosos', icono: 'estibador', h: 84 },
  { n: 5, color: '#4b8fe8', txt: '#ffffff', frase: 'De Atacames a Misahuallí: cuatro regiones, una misión', icono: 'hueco', h: 30 },
  { n: 6, color: '#8e5fd1', txt: '#ffffff', frase: 'Cómo se ve, cómo suena y cómo se navega', icono: 'componente', h: 60 },
  { n: 7, color: '#23314a', txt: '#ffffff', frase: 'Lo que realmente se construye: MVP y MoSCoW', icono: 'civil', h: 76 }
];

(async () => {
  for (const s of SECCIONES) {
    const W = 1000, H = 84;
    const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <rect x="3" y="3" width="${W - 6}" height="${H - 10}" rx="18" fill="${s.color}" stroke="#23314a" stroke-width="5"/>
      <rect x="3" y="${H - 7}" width="${W - 6}" height="4" rx="2" fill="#23314a"/>
      <circle cx="52" cy="40" r="26" fill="#ffffff" stroke="#23314a" stroke-width="4"/>
      <text x="52" y="52" font-family="${FUENTE}" font-weight="bold" font-size="32" text-anchor="middle" fill="#23314a">${s.n}</text>
      <text x="96" y="49" font-family="${FUENTE}" font-weight="bold" font-size="24" fill="${s.txt}">${s.frase}</text></svg>`);
    const ico = await sharp(S(s.icono)).resize({ height: s.h }).toBuffer();
    const m = await sharp(ico).metadata();
    await sharp(svg).composite([{ input: ico, left: W - 40 - m.width, top: Math.round(44 - m.height / 2) }]).png({ compressionLevel: 9 }).toFile(path.join(sal, `seccion${s.n}.png`));
  }
  // Banner principal
  const W = 1000, H = 360;
  const cielo = await sharp(F('cielo_1')).resize(W, H, { fit: 'cover', position: 'top' }).toBuffer();
  const lejos = await sharp(F('lejos_1')).resize(1000, 375).extract({ left: 0, top: 60, width: W, height: 315 }).toBuffer();
  const cerca = await sharp(F('cerca_1')).resize(1000, 325).extract({ left: 0, top: 125, width: W, height: 200 }).toBuffer();
  const suelo = await sharp(F('suelo_1')).resize(128, 60).toBuffer();
  const fila = await sharp({ create: { width: W, height: 60, channels: 4, background: '#0000' } })
    .composite(Array.from({ length: 8 }, (_, i) => ({ input: suelo, left: i * 128, top: 0 }))).png().toBuffer();
  const sp = async (n, h) => sharp(S(n)).resize({ height: h }).toBuffer();
  const GY = 295;
  const borde = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect x="3" y="3" width="${W - 6}" height="${H - 6}" rx="22" fill="none" stroke="#23314a" stroke-width="6"/></svg>`);
  const base = await sharp(cielo).composite([
    { input: lejos, left: 0, top: GY - 315 + 20 }, { input: cerca, left: 0, top: GY - 200 + 24 }, { input: fila, left: 0, top: GY },
    { input: await sp('aru_salto', 130), left: 120, top: GY - 150 }, { input: await sp('errante', 100), left: 380, top: GY + 2 - 100 },
    { input: await sp('estibador', 200), left: 700, top: GY + 4 - 200 }, { input: borde, left: 0, top: 0 }
  ]).png().toBuffer();
  const redondeo = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><rect width="${W}" height="${H}" rx="22" fill="#fff"/></svg>`);
  await sharp(base).composite([{ input: redondeo, blend: 'dest-in' }]).png({ compressionLevel: 9 }).toFile(path.join(sal, 'portada.png'));
  console.log('banners listos');
})();
