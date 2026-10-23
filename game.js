const ANCHO = 800;
const ALTO = 600;
const TAMANO_MAPA = 1600;
const TOTAL_BANANAS = 15;
const TOTAL_ARBOLES = 20;

let jugador;
let arboles;
let bananas;
let teclas;
let textoBananas;
let textoTiempo;
let mensajeVictoria;
let contador = 0;
let inicio;
let juegoTerminado = false;

const configuracion = {
  type: Phaser.AUTO,
  width: ANCHO,
  height: ALTO,
  backgroundColor: '#4e9f55',
  physics: {
    default: 'arcade',
    arcade: {
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

  // Monito estilo caricatura: cabeza grande, ojos expresivos y cola curva.
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

  // Mechón puntiagudo en la parte superior de la cabeza.
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

  // Ojos grandes con brillo, inspirados en el dibujo adjunto.
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

  // Manos y pies pequeños para que se vea como un monito completo.
  dibujo.fillStyle(0xf7c58e);
  dibujo.fillEllipse(39, 116, 18, 10);
  dibujo.fillEllipse(76, 116, 18, 10);
  dibujo.lineStyle(4, 0x3d2020);
  dibujo.strokeEllipse(39, 116, 18, 10);
  dibujo.strokeEllipse(76, 116, 18, 10);
  dibujo.generateTexture('monito', 128, 128);
  dibujo.clear();

  dibujo.fillStyle(0xf4d03f);
  dibujo.fillEllipse(19, 24, 22, 38);
  dibujo.lineStyle(4, 0x6b421e);
  dibujo.beginPath();
  dibujo.arc(20, 23, 13, -1.1, 1.1, false);
  dibujo.strokePath();
  dibujo.generateTexture('banana', 40, 48);
  dibujo.clear();

  dibujo.fillStyle(0x6b421e);
  dibujo.fillRect(38, 62, 14, 48);
  dibujo.fillStyle(0x247a3c);
  dibujo.fillCircle(45, 34, 28);
  dibujo.fillStyle(0x369b4d);
  dibujo.fillCircle(25, 48, 22);
  dibujo.fillCircle(64, 48, 22);
  dibujo.generateTexture('arbol', 90, 110);
  dibujo.destroy();
}

function create() {
  this.physics.world.setBounds(0, 0, TAMANO_MAPA, TAMANO_MAPA);

  // Fondo verde con manchas y pequeños detalles de selva.
  const fondo = this.add.graphics();
  fondo.fillStyle(0x4e9f55);
  fondo.fillRect(0, 0, TAMANO_MAPA, TAMANO_MAPA);
  fondo.fillStyle(0x58aa5a, 0.45);
  for (let x = 40; x < TAMANO_MAPA; x += 120) {
    for (let y = 40; y < TAMANO_MAPA; y += 130) {
      fondo.fillCircle(x, y, 18);
      fondo.fillCircle(x + 35, y + 22, 10);
    }
  }
  fondo.lineStyle(2, 0x3f8c49, 0.65);
  for (let i = 0; i < 70; i += 1) {
    const x = 20 + ((i * 211) % 1560);
    const y = 20 + ((i * 137) % 1560);
    fondo.lineBetween(x, y, x + 18, y - 22);
    fondo.lineBetween(x + 18, y - 22, x + 32, y - 8);
  }
  fondo.setDepth(-10);

  contador = 0;
  juegoTerminado = false;
  inicio = this.time.now;

  jugador = this.physics.add.sprite(TAMANO_MAPA / 2, TAMANO_MAPA / 2, 'monito');
  jugador.setScale(0.7);
  jugador.setCollideWorldBounds(true);
  jugador.setDepth(2);

  arboles = this.physics.add.staticGroup();
  const posicionesArboles = [];
  for (let i = 0; i < TOTAL_ARBOLES; i += 1) {
    let x;
    let y;
    do {
      x = Phaser.Math.Between(90, TAMANO_MAPA - 90);
      y = Phaser.Math.Between(90, TAMANO_MAPA - 90);
    } while (
      Phaser.Math.Distance.Between(x, y, jugador.x, jugador.y) < 180 ||
      posicionesArboles.some(posicion => Phaser.Math.Distance.Between(x, y, posicion.x, posicion.y) < 130)
    );
    posicionesArboles.push({ x, y });
    const arbol = arboles.create(x, y, 'arbol');
    arbol.setDepth(1);
    arbol.refreshBody();
  }

  bananas = this.physics.add.group();
  for (let i = 0; i < TOTAL_BANANAS; i += 1) {
    let x;
    let y;
    do {
      x = Phaser.Math.Between(55, TAMANO_MAPA - 55);
      y = Phaser.Math.Between(55, TAMANO_MAPA - 55);
    } while (
      Phaser.Math.Distance.Between(x, y, jugador.x, jugador.y) < 130 ||
      posicionesArboles.some(posicion => Phaser.Math.Distance.Between(x, y, posicion.x, posicion.y) < 90)
    );
    const banana = bananas.create(x, y, 'banana');
    banana.setDepth(1);
    banana.setImmovable(true);
  }

  this.physics.add.collider(jugador, arboles);
  this.physics.add.overlap(jugador, bananas, comerBanana, undefined, this);

  teclas = this.input.keyboard.addKeys('W,A,S,D');
  teclas.flechas = this.input.keyboard.createCursorKeys();

  textoBananas = this.add.text(20, 18, 'Bananas: 0/15', {
    fontFamily: 'Arial',
    fontSize: '24px',
    color: '#ffffff',
    stroke: '#183c1b',
    strokeThickness: 5
  }).setScrollFactor(0).setDepth(10);

  textoTiempo = this.add.text(20, 52, 'Tiempo: 0.0 s', {
    fontFamily: 'Arial',
    fontSize: '20px',
    color: '#ffffff',
    stroke: '#183c1b',
    strokeThickness: 4
  }).setScrollFactor(0).setDepth(10);

  mensajeVictoria = this.add.text(ANCHO / 2, ALTO / 2, '', {
    fontFamily: 'Arial',
    fontSize: '42px',
    color: '#fff7b2',
    align: 'center',
    stroke: '#183c1b',
    strokeThickness: 8
  }).setOrigin(0.5).setScrollFactor(0).setDepth(20);

  this.cameras.main.setBounds(0, 0, TAMANO_MAPA, TAMANO_MAPA);
  this.cameras.main.startFollow(jugador, true, 0.08, 0.08);
}

function update() {
  if (juegoTerminado) {
    textoTiempo.setText(`Tiempo: ${((this.time.now - inicio) / 1000).toFixed(1)} s`);
    return;
  }

  let movimientoX = 0;
  let movimientoY = 0;
  if (teclas.flechas.left.isDown || teclas.A.isDown) movimientoX -= 1;
  if (teclas.flechas.right.isDown || teclas.D.isDown) movimientoX += 1;
  if (teclas.flechas.up.isDown || teclas.W.isDown) movimientoY -= 1;
  if (teclas.flechas.down.isDown || teclas.S.isDown) movimientoY += 1;

  const vector = new Phaser.Math.Vector2(movimientoX, movimientoY);
  if (vector.length() > 0) {
    vector.normalize();
    jugador.setVelocity(vector.x * 220, vector.y * 220);
    // El personaje se desplaza, pero siempre conserva su orientación normal.
    jugador.setAngle(0);
  } else {
    jugador.setVelocity(0, 0);
    jugador.setAngle(0);
  }

  textoTiempo.setText(`Tiempo: ${((this.time.now - inicio) / 1000).toFixed(1)} s`);
}

function comerBanana(jugadorActual, banana) {
  banana.destroy();
  contador += 1;
  textoBananas.setText(`Bananas: ${contador}/${TOTAL_BANANAS}`);

  if (contador === TOTAL_BANANAS) {
    juegoTerminado = true;
    jugadorActual.setVelocity(0, 0);
    jugadorActual.body.moves = false;
    const tiempoFinal = ((jugadorActual.scene.time.now - inicio) / 1000).toFixed(1);
    mensajeVictoria.setText(`¡Ganaste!\nTiempo: ${tiempoFinal} s`);
    jugadorActual.scene.time.delayedCall(4000, () => {
      jugadorActual.scene.scene.restart();
    });
  }
}
