// Pantalla de inicio.
class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { ANCHO, ALTO, SUELO_Y } = CONFIG;
    this.add.image(0, 0, 'cielo_1').setOrigin(0, 0).setDepth(-50);
    this.nubes = this.add.tileSprite(0, 20, ANCHO, 200, 'nubes_1').setOrigin(0, 0).setDepth(-40);
    this.lejos = this.add.tileSprite(0, SUELO_Y, ANCHO, 300, 'lejos_1').setOrigin(0, 1).setDepth(-30);
    this.cerca = this.add.tileSprite(0, SUELO_Y + 6, ANCHO, 260, 'cerca_1').setOrigin(0, 1).setDepth(-20).setAlpha(0.88);
    this.suelo = this.add.tileSprite(0, SUELO_Y, ANCHO, ALTO - SUELO_Y, 'suelo_1').setOrigin(0, 0);

    // Aru corre en el menú; un Coloso Errante lo persigue de lejos.
    this.aru = this.add.image(ANCHO / 2 - 250, SUELO_Y + 4, 'aru_correr1').setOrigin(0.5, 1).setDisplaySize(96, 150);
    this.add.image(ANCHO / 2 + 330, SUELO_Y + 6, 'errante').setOrigin(0.5, 1).setDisplaySize(93, 108);
    this.tweens.addCounter({
      from: 0, to: 1, duration: 220, repeat: -1,
      onRepeat: () => {
        this.paso = !this.paso;
        this.aru.setTexture(this.paso ? 'aru_correr2' : 'aru_correr1').setDisplaySize(96, 150);
      }
    });

    const titulo = this.add.text(ANCHO / 2, 105, 'TRES REGIONES\nTIERRA EN RUINAS', {
      ...ESTILO_TEXTO,
      fontSize: '52px',
      strokeThickness: 9,
      align: 'center',
      color: '#F2B138'
    }).setOrigin(0.5).setDepth(5);
    this.tweens.add({ targets: titulo, scale: 1.04, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.add.text(ANCHO / 2, 190, 'Cuatro destinos. Una misión.', { ...ESTILO_TEXTO, fontSize: '22px', strokeThickness: 4 }).setOrigin(0.5);

    this.crearBoton(ANCHO / 2 + 80, 270, 'JUGAR', '#e67e22', '#f39c12', () => this.jugar());
    this.crearBoton(ANCHO / 2 + 80, 340, 'CONTROLES', '#2c3e50', '#3d566e', () => this.alternarControles(), '26px');

    this.add.text(ANCHO / 2 + 80, 400, `Mejor distancia: ${Record.valor} m`, { ...ESTILO_TEXTO, fontSize: '20px', strokeThickness: 4 }).setOrigin(0.5);

    this.panelControles = this.add.text(ANCHO / 2, 300,
      'CONTROLES\nEspacio / ↑ / clic: saltar (doble salto)\n↓ / S: deslizarse bajo estructuras\nX / Z / Shift / clic derecho / botón: atacar    Esc: pausa\n\nCÓMO LEER EL PELIGRO\nColosos de piedra con ojos cian  →  ¡ataca! (X)\nMadera y ladrillo con franjas amarillas  →  esquiva\nCiviles con aura verde  →  rescátalos: te protegen\nBananos y cristal dorado  →  recoge', {
        ...ESTILO_TEXTO,
        fontSize: '19px',
        strokeThickness: 4,
        align: 'center',
        lineSpacing: 4,
        backgroundColor: '#000000cc',
        padding: { x: 22, y: 16 }
      }).setOrigin(0.5).setDepth(10).setVisible(false);

    this.input.keyboard.on('keydown-SPACE', () => this.jugar());
    this.input.keyboard.on('keydown-ENTER', () => this.jugar());
  }

  crearBoton(x, y, texto, color, colorHover, accion, tam = '34px') {
    const boton = this.add.text(x, y, texto, {
      fontFamily: 'Arial',
      fontSize: tam,
      color: '#ffffff',
      backgroundColor: color,
      padding: { x: 36, y: 10 },
      stroke: '#1b1c20',
      strokeThickness: 4
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    boton.on('pointerover', () => boton.setBackgroundColor(colorHover));
    boton.on('pointerout', () => boton.setBackgroundColor(color));
    boton.on('pointerup', accion);
    return boton;
  }

  alternarControles() {
    this.panelControles.setVisible(!this.panelControles.visible);
  }

  jugar() {
    this.scene.start('Niveles');
  }

  update(time, delta) {
    const dx = NIVELES[0].velIni * (delta / 1000);
    this.suelo.tilePositionX += dx;
    this.cerca.tilePositionX += dx * 0.55;
    this.lejos.tilePositionX += dx * 0.15;
    this.nubes.tilePositionX += dx * 0.05;
  }
}
