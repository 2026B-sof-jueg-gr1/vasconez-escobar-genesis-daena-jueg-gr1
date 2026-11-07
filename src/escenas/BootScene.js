// Genera todas las texturas y pasa al menú.
class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    generarTexturas(this);
  }

  create() {
    Record.cargar();
    this.scene.start('Menu');
  }
}
