// Carga todas las imágenes (con barra de progreso) y pasa al menú.
class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    const { ANCHO, ALTO } = CONFIG;
    this.cameras.main.setBackgroundColor('#1b1c20');

    if (window.location.protocol === 'file:') {
      this.add.text(ANCHO / 2, ALTO / 2, 'Abre el juego desde un servidor local\n(por ejemplo, la extensión "Live Server" de VS Code\no el comando: npx serve)', {
        ...ESTILO_TEXTO, fontSize: '22px', align: 'center', color: '#F2B138'
      }).setOrigin(0.5);
      this.load.removeAllListeners();
      this.detenido = true;
      return;
    }

    this.add.text(ANCHO / 2, ALTO / 2 - 40, 'Cargando…', { ...ESTILO_TEXTO, fontSize: '28px' }).setOrigin(0.5);
    this.add.rectangle(ANCHO / 2, ALTO / 2, 400, 18, 0x000000, 0.5);
    const barra = this.add.rectangle(ANCHO / 2 - 200, ALTO / 2, 400, 18, 0xF2B138).setOrigin(0, 0.5);
    barra.scaleX = 0.001;
    this.load.on('progress', v => { barra.scaleX = Math.max(0.001, v); });
    this.load.on('loaderror', f => console.error('No se pudo cargar', f.src));

    this.load.setPath('assets/');
    Object.keys(SPRITES).forEach(k => this.load.image(k, `sprites/${k}.png`));
    NIVELES.filter(n => n.jugable).forEach(n => {
      CAPAS_FONDO.forEach(c => this.load.image(`${c}_${n.id}`, `fondos/${c}_${n.id}.png`));
    });
  }

  create() {
    if (this.detenido) return;
    Record.cargar();
    this.scene.start('Menu');
  }
}
