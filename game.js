const ANCHO = 800;
const ALTO = 600;
const SUELO_Y = 520;
const GRAVEDAD = 1800;
const VEL_SALTO_1 = 720;
const VEL_SALTO_2 = 620;
const JUGADOR_X = 170;

let jugador;
let suelo;
let suelo_fisico;
let colinas;
let nubes;
let obstaculos;
let bananas;
let textoBananas;
let textoDistancia;
let textoMejor;
let textoFin;
let textoAyuda;
let contador = 0;
let distancia = 0;
let velocidad = 320;
let proximoObstaculo = 0;
let saltosRestantes = 2;
let juegoTerminado = false;
let tiempoFin = 0;
let mejor = 0;

try {
  mejor = parseInt(localStorage.getItem('monito_mejor') || '0', 10) || 0;
} catch (e) {
  mejor = 0;
}

const configuracion = {
  type: Phaser.AUTO,
  width: ANCHO,
  height: ALTO,
  backgroundColor: '#7ed6f7',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GRAVEDAD },
      debug: false
    }
  },
  scene: {
    preload,
    create,
    update
  }
};

new Phaser.Game(configuracion);

function preload() {
  // Todas las imágenes se dibujan aquí, por lo que no se necesitan archivos externos.
  const dibujo = this.make.graphics({ x: 0, y: 0, add: false });

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

function create() {
  contador = 0;
  distancia = 0;
  velocidad = 320;
  proximoObstaculo = 500;
  saltosRestantes = 2;
  juegoTerminado = false;

  // Fondo con parallax.
  nubes = this.add.tileSprite(0, 0, ANCHO, 160, 'nubes').setOrigin(0, 0).setDepth(-30);
  colinas = this.add.tileSprite(0, SUELO_Y + 10, ANCHO, 220, 'colinas').setOrigin(0, 1).setDepth(-20);
  suelo = this.add.tileSprite(0, SUELO_Y, ANCHO, ALTO - SUELO_Y, 'suelo').setOrigin(0, 0).setDepth(0);

  // Suelo físico invisible.
  suelo_fisico = this.add.rectangle(ANCHO / 2, SUELO_Y + 40, ANCHO, 80).setVisible(false);
  this.physics.add.existing(suelo_fisico, true);

  jugador = this.physics.add.sprite(JUGADOR_X, SUELO_Y - 100, 'monito');
  jugador.setScale(0.6);
  jugador.setDepth(2);
  jugador.body.setSize(70, 80);
  jugador.body.setOffset(24, 32);

  obstaculos = this.physics.add.group({ allowGravity: false, immovable: true });
  bananas = this.physics.add.group({ allowGravity: false, immovable: true });

  this.physics.add.collider(jugador, suelo_fisico);
  this.physics.add.overlap(jugador, bananas, comerBanana, undefined, this);
  this.physics.add.overlap(jugador, obstaculos, () => terminarJuego(this), undefined, this);

  // Controles: espacio, flecha arriba, W o toque/clic.
  this.input.keyboard.on('keydown-SPACE', () => accionSalto(this));
  this.input.keyboard.on('keydown-UP', () => accionSalto(this));
  this.input.keyboard.on('keydown-W', () => accionSalto(this));
  this.input.on('pointerdown', () => accionSalto(this));

  const estiloHUD = {
    fontFamily: 'Arial',
    fontSize: '24px',
    color: '#ffffff',
    stroke: '#183c1b',
    strokeThickness: 5
  };
  textoBananas = this.add.text(20, 16, 'Bananas: 0', estiloHUD).setDepth(10);
  textoDistancia = this.add.text(20, 48, 'Distancia: 0 m', { ...estiloHUD, fontSize: '20px', strokeThickness: 4 }).setDepth(10);
  textoMejor = this.add.text(ANCHO - 20, 16, `Mejor: ${mejor} m`, { ...estiloHUD, fontSize: '20px', strokeThickness: 4 })
    .setOrigin(1, 0).setDepth(10);

  textoAyuda = this.add.text(ANCHO / 2, 140, 'Espacio / ↑ / toque: saltar\n(puedes saltar dos veces)', {
    ...estiloHUD,
    align: 'center',
    fontSize: '26px'
  }).setOrigin(0.5).setDepth(10);
  this.tweens.add({ targets: textoAyuda, alpha: 0, delay: 3500, duration: 800 });

  textoFin = this.add.text(ANCHO / 2, ALTO / 2 - 40, '', {
    fontFamily: 'Arial',
    fontSize: '36px',
    color: '#fff7b2',
    align: 'center',
    stroke: '#183c1b',
    strokeThickness: 7
  }).setOrigin(0.5).setDepth(20);
}

function update(time, delta) {
  if (juegoTerminado) return;

  const dt = delta / 1000;

  // La velocidad sube poco a poco, como en los juegos de correr infinitos.
  const metros = distancia / 60;
  velocidad = Math.min(600, 320 + metros * 2);
  distancia += velocidad * dt;

  suelo.tilePositionX += velocidad * dt;
  colinas.tilePositionX += velocidad * dt * 0.25;
  nubes.tilePositionX += velocidad * dt * 0.1;

  // Estado del personaje.
  const enSuelo = jugador.body.blocked.down || jugador.body.touching.down;
  if (enSuelo && jugador.body.velocity.y >= 0) {
    saltosRestantes = 2;
    // Pequeño balanceo mientras corre.
    jugador.setAngle(Math.sin(time * 0.025) * 6);
  } else {
    jugador.setAngle(Phaser.Math.Clamp(jugador.body.velocity.y * 0.02, -15, 20));
  }

  // Aparición de obstáculos y bananas.
  if (distancia >= proximoObstaculo) {
    generarPatron(this);
    proximoObstaculo = distancia + Phaser.Math.Between(600, 900);
  }

  // Mover y limpiar objetos.
  [obstaculos, bananas].forEach(grupo => {
    grupo.getChildren().slice().forEach(objeto => {
      objeto.body.setVelocityX(-velocidad);
      if (objeto.x < -120) objeto.destroy();
    });
  });

  textoBananas.setText(`Bananas: ${contador}`);
  textoDistancia.setText(`Distancia: ${Math.floor(distancia / 60)} m`);
}

function accionSalto(escena) {
  if (juegoTerminado) {
    if (escena.time.now - tiempoFin > 600) escena.scene.restart();
    return;
  }
  if (saltosRestantes <= 0) return;
  jugador.setVelocityY(saltosRestantes === 2 ? -VEL_SALTO_1 : -VEL_SALTO_2);
  saltosRestantes -= 1;
}

function crearRoca(x) {
  const roca = obstaculos.create(x, SUELO_Y + 2, 'roca');
  roca.setOrigin(0.5, 1).setDepth(1);
  roca.setScale(Phaser.Math.FloatBetween(0.9, 1.3));
  roca.body.setSize(44, 38);
  roca.body.setOffset(10, 16);
  return roca;
}

function crearPajaro(escena, x, y) {
  const pajaro = obstaculos.create(x, y, 'pajaro');
  pajaro.setDepth(1);
  pajaro.body.setSize(36, 22);
  pajaro.body.setOffset(10, 10);
  escena.tweens.add({ targets: pajaro, scaleY: 0.6, duration: 160, yoyo: true, repeat: -1 });
  return pajaro;
}

function crearBanana(x, y) {
  const banana = bananas.create(x, y, 'banana');
  banana.setDepth(1);
  return banana;
}

function arcoDeBananas(xCentro, cantidad, separacion, altura) {
  const inicioX = xCentro - ((cantidad - 1) * separacion) / 2;
  for (let i = 0; i < cantidad; i += 1) {
    const t = cantidad === 1 ? 0 : i / (cantidad - 1);
    crearBanana(inicioX + i * separacion, SUELO_Y - 50 - Math.sin(Math.PI * t) * altura);
  }
}

function generarPatron(escena) {
  const x = ANCHO + 80;
  const tipo = Phaser.Math.Between(0, 5);

  if (tipo <= 2) {
    // Una roca con arco de bananas encima.
    crearRoca(x);
    arcoDeBananas(x, 5, 50, 120);
  } else if (tipo === 3) {
    // Dos rocas juntas con un arco más largo.
    crearRoca(x);
    crearRoca(x + 70);
    arcoDeBananas(x + 35, 7, 50, 135);
  } else if (tipo === 4) {
    // Pájaro volando alto y bananas en el suelo.
    crearPajaro(escena, x + 120, SUELO_Y - Phaser.Math.Between(150, 175));
    for (let i = 0; i < 5; i += 1) crearBanana(x + i * 50, SUELO_Y - 40);
  } else {
    // Fila de bananas en el aire: hay que saltar para tomarlas.
    for (let i = 0; i < 6; i += 1) crearBanana(x + i * 50, SUELO_Y - 150);
  }
}

function comerBanana(jugadorActual, banana) {
  banana.destroy();
  contador += 1;
}

function terminarJuego(escena) {
  if (juegoTerminado) return;
  juegoTerminado = true;
  tiempoFin = escena.time.now;

  const metros = Math.floor(distancia / 60);
  if (metros > mejor) {
    mejor = metros;
    try {
      localStorage.setItem('monito_mejor', String(mejor));
    } catch (e) {
      // Si no se puede guardar, el récord solo dura la sesión.
    }
  }

  [obstaculos, bananas].forEach(grupo => {
    grupo.getChildren().forEach(objeto => objeto.body.setVelocityX(0));
  });
  escena.tweens.killAll();
  jugador.setTint(0xff7777);
  jugador.setAngle(0);
  jugador.setVelocityY(-350);

  textoMejor.setText(`Mejor: ${mejor} m`);
  textoFin.setText(
    `¡Chocaste!\nBananas: ${contador}   Distancia: ${metros} m\n\nEspacio o toque para reintentar`
  );
}
