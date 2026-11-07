// Todas las imagenes se dibujan por codigo, no se necesitan archivos externos.
function generarTexturas(escena) {
  const dibujo = escena.make.graphics({ x: 0, y: 0, add: false });

  // ---------- Monito ----------
  dibujo.lineStyle(8, 0x3d2020);
  dibujo.beginPath();
  dibujo.moveTo(78, 99);
  dibujo.lineTo(103, 87);
  dibujo.lineTo(118, 67);
  dibujo.lineTo(105, 58);
  dibujo.strokePath();
  dibujo.lineStyle(4, 0xa85f3d);
  dibujo.beginPath();
  dibujo.moveTo(78, 99);
  dibujo.lineTo(103, 87);
  dibujo.lineTo(118, 67);
  dibujo.lineTo(105, 58);
  dibujo.strokePath();

  dibujo.lineStyle(7, 0x3d2020);
  dibujo.fillStyle(0xa85f3d);
  dibujo.fillEllipse(57, 99, 48, 42);
  dibujo.strokeEllipse(57, 99, 48, 42);
  dibujo.fillStyle(0xffe9a8);
  dibujo.fillEllipse(57, 97, 18, 28);

  dibujo.fillStyle(0xf7c58e);
  dibujo.fillCircle(15, 65, 20);
  dibujo.fillCircle(99, 65, 20);
  dibujo.lineStyle(5, 0x3d2020);
  dibujo.strokeCircle(15, 65, 20);
  dibujo.strokeCircle(99, 65, 20);
  dibujo.fillStyle(0xed9b86);
  dibujo.fillCircle(15, 65, 11);
  dibujo.fillCircle(99, 65, 11);

  dibujo.fillStyle(0xa85f3d);
  dibujo.fillCircle(57, 55, 49);
  dibujo.lineStyle(7, 0x3d2020);
  dibujo.strokeCircle(57, 55, 49);
  dibujo.fillStyle(0xffefb2);
  dibujo.fillCircle(57, 65, 40);

  dibujo.fillStyle(0xa85f3d);
  dibujo.beginPath();
  dibujo.moveTo(28, 23);
  dibujo.lineTo(40, 7);
  dibujo.lineTo(47, 18);
  dibujo.lineTo(59, 2);
  dibujo.lineTo(65, 18);
  dibujo.lineTo(82, 9);
  dibujo.lineTo(78, 30);
  dibujo.closePath();
  dibujo.fillPath();
  dibujo.lineStyle(5, 0x3d2020);
  dibujo.strokePath();

  dibujo.fillStyle(0x171629);
  dibujo.fillEllipse(40, 62, 21, 29);
  dibujo.fillEllipse(74, 62, 21, 29);
  dibujo.fillStyle(0xffffff);
  dibujo.fillCircle(36, 57, 5);
  dibujo.fillCircle(70, 57, 5);
  dibujo.fillStyle(0x25bde5);
  dibujo.fillEllipse(40, 72, 14, 6);
  dibujo.fillEllipse(74, 72, 14, 6);

  dibujo.lineStyle(5, 0x3d2020);
  dibujo.beginPath();
  dibujo.moveTo(48, 87);
  dibujo.lineTo(53, 83);
  dibujo.lineTo(57, 88);
  dibujo.lineTo(61, 83);
  dibujo.lineTo(66, 87);
  dibujo.strokePath();

  dibujo.fillStyle(0xf7c58e);
  dibujo.fillEllipse(39, 116, 18, 10);
  dibujo.fillEllipse(76, 116, 18, 10);
  dibujo.lineStyle(4, 0x3d2020);
  dibujo.strokeEllipse(39, 116, 18, 10);
  dibujo.strokeEllipse(76, 116, 18, 10);
  dibujo.generateTexture('monito', 128, 128);
  dibujo.clear();

  // ---------- Banana ----------
  dibujo.fillStyle(0xf4d03f);
  dibujo.fillEllipse(19, 24, 22, 38);
  dibujo.lineStyle(4, 0x6b421e);
  dibujo.beginPath();
  dibujo.arc(20, 23, 13, -1.1, 1.1, false);
  dibujo.strokePath();
  dibujo.generateTexture('banana', 40, 48);
  dibujo.clear();

  // ---------- Roca ----------
  dibujo.fillStyle(0x7d7d85);
  dibujo.lineStyle(4, 0x45454d);
  dibujo.beginPath();
  dibujo.moveTo(4, 54);
  dibujo.lineTo(10, 28);
  dibujo.lineTo(24, 10);
  dibujo.lineTo(44, 6);
  dibujo.lineTo(58, 26);
  dibujo.lineTo(62, 54);
  dibujo.closePath();
  dibujo.fillPath();
  dibujo.strokePath();
  dibujo.fillStyle(0xa3a3ad);
  dibujo.fillTriangle(16, 28, 26, 14, 36, 14);
  dibujo.fillStyle(0x5f5f67);
  dibujo.fillTriangle(40, 54, 52, 30, 60, 54);
  dibujo.generateTexture('roca', 64, 56);
  dibujo.clear();

  // ---------- Pájaro ----------
  dibujo.fillStyle(0x8e44ad);
  dibujo.fillEllipse(28, 24, 40, 24);
  dibujo.fillStyle(0xf39c12);
  dibujo.fillTriangle(46, 20, 56, 25, 46, 29);
  dibujo.fillStyle(0xffffff);
  dibujo.fillCircle(38, 20, 5);
  dibujo.fillStyle(0x000000);
  dibujo.fillCircle(39, 20, 2);
  dibujo.fillStyle(0x6c3483);
  dibujo.fillTriangle(10, 22, 24, 2, 32, 22);
  dibujo.generateTexture('pajaro', 58, 40);
  dibujo.clear();

  // ---------- Suelo (repetible) ----------
  dibujo.fillStyle(0x8a5a2b);
  dibujo.fillRect(0, 0, 64, 80);
  dibujo.fillStyle(0x6f4720);
  dibujo.fillCircle(14, 40, 4);
  dibujo.fillCircle(44, 58, 5);
  dibujo.fillCircle(52, 34, 3);
  dibujo.fillStyle(0x3fa34d);
  dibujo.fillRect(0, 0, 64, 16);
  dibujo.fillStyle(0x2f8a3d);
  dibujo.fillRect(0, 14, 64, 5);
  dibujo.generateTexture('suelo', 64, 80);
  dibujo.clear();

  // ---------- Colinas (repetibles) ----------
  dibujo.fillStyle(0x5cba6a);
  [[120, 130], [420, 170], [700, 120]].forEach(([cx, r]) => {
    [-800, 0, 800].forEach(desp => dibujo.fillCircle(cx + desp, 300, r));
  });
  dibujo.generateTexture('colinas', 800, 220);
  dibujo.clear();

  // ---------- Nubes (repetibles) ----------
  dibujo.fillStyle(0xffffff, 0.9);
  [[100, 60], [380, 110], [640, 50]].forEach(([cx, cy]) => {
    [-800, 0, 800].forEach(desp => {
      dibujo.fillEllipse(cx + desp, cy, 110, 36);
      dibujo.fillEllipse(cx + desp - 30, cy - 14, 60, 30);
      dibujo.fillEllipse(cx + desp + 25, cy - 18, 70, 34);
    });
  });
  dibujo.generateTexture('nubes', 800, 160);
  dibujo.destroy();
}
