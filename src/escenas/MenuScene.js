// Pantalla de inicio.
class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create() {
    const { ANCHO, ALTO, SUELO_Y } = CONFIG;

    this.nubes = this.add.tileSprite(0, 0, ANCHO, 160, 'nubes').setOrigin(0, 0).setDepth(-30);
    this.colinas = this.add.tileSprite(0, SUELO_Y + 10, ANCHO, 220, 'colinas').setOrigin(0, 1).setDepth(-20);
    this.suelo = this.add.tileSprite(0, SUELO_Y, ANCHO, ALTO - SUELO_Y, 'suelo').setOrigin(0, 0);

    const mono = this.add.image(ANCHO / 2, SUELO_Y - 40, 'monito').setScale(0.9).setOrigin(0.5, 1);
    this.tweens.add({ targets: mono, y: SUELO_Y - 55, duration: 450, yoyo: true, repeat: -1, ease: 'Sine.easeOut' });

    const titulo = this.add.text(ANCHO / 2, 110, 'MONITO\nCORREDOR', {
      ...ESTILO_TEXTO,
      fontSize: '64px',
      strokeThickness: 10,
      align: 'center',
      color: '#fff7b2'
    }).setOrigin(0.5);
    this.tweens.add({ targets: titulo, scale: 1.05, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.crearBoton(ANCHO / 2, 270, 'JUGAR', () => this.jugar());

    this.add.text(ANCHO / 2, 340, `Mejor distancia: ${Record.valor} m`, { ...ESTILO_TEXTO, fontSize: '22px', strokeThickness: 4 })
      .setOrigin(0.5);
    this.add.text(ANCHO / 2, 380, 'Espacio / ↑ / W / toque: saltar (doble salto)\nRecoge bananas y esquiva rocas y pájaros', {
      ...ESTILO_TEXTO,
      fontSize: '16px',
      strokeThickness: 3,
      align: 'center'
    }).setOrigin(0.5);

    this.input.keyboard.on('keydown-SPACE', () => this.jugar());
    this.input.keyboard.on('keydown-ENTER', () => this.jugar());
  }

  crearBoton(x, y, texto, accion) {
    const boton = this.add.text(x, y, texto, {
      fontFamily: 'Arial',
      fontSize: '36px',
      color: '#ffffff',
      backgroundColor: '#e67e22',
      padding: { x: 40, y: 12 },
      stroke: '#7a3e0a',
      strokeThickness: 4
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    boton.on('pointerover', () => boton.setBackgroundColor('#f39c12'));
    boton.on('pointerout', () => boton.setBackgroundColor('#e67e22'));
    boton.on('pointerup', accion);
    return boton;
  }

  jugar() {
    this.scene.start('Juego');
  }

  update(time, delta) {
    const dx = CONFIG.VEL_INICIAL * (delta / 1000);
    this.suelo.tilePositionX += dx;
    this.colinas.tilePositionX += dx * 0.25;
    this.nubes.tilePositionX += dx * 0.1;
  }
}
