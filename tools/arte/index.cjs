// Genera el arte del juego: escribe las fuentes SVG y exporta los PNG.
//   Uso:  node tools/arte/index.cjs
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const raiz = path.resolve(__dirname, '..', '..');
const salidaSprites = path.join(raiz, 'juego', 'assets', 'sprites');
const salidaFondos = path.join(raiz, 'juego', 'assets', 'fondos');
const salidaSvg = path.join(raiz, 'juego', 'assets', 'fuentes');
[salidaSprites, salidaFondos, salidaSvg].forEach(d => fs.mkdirSync(d, { recursive: true }));

const sprites = Object.assign({},
  require('./personajes.cjs'), require('./enemigos.cjs'), require('./objetos.cjs'));
const fondos = fs.existsSync(path.join(__dirname, 'fondos.cjs')) ? require('./fondos.cjs') : {};

async function exportar(mapa, carpeta, nota, paleta) {
  for (const [nombre, fabrica] of Object.entries(mapa)) {
    const contenido = fabrica();
    fs.writeFileSync(path.join(salidaSvg, `${nombre}.svg`), contenido);
    await sharp(Buffer.from(contenido), { density: 72 }).png(paleta ? { palette: true, quality: 95, effort: 10, compressionLevel: 9 } : { compressionLevel: 9 }).toFile(path.join(carpeta, `${nombre}.png`));
  }
  console.log(`${nota}: ${Object.keys(mapa).length} imágenes`);
}

(async () => {
  await exportar(sprites, salidaSprites, 'sprites', true);
  await exportar(fondos, salidaFondos, 'fondos');
})();
