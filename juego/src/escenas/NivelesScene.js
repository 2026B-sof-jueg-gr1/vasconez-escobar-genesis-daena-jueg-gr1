// Selección de nivel: los cuatro destinos de Ecuador.
class NivelesScene extends Phaser.Scene {
  constructor() {
    super('Niveles');
  }

  create() {
    const { ANCHO, ALTO } = CONFIG;
    this.cameras.main.setBackgroundColor('#1b1c20');

    this.add.text(ANCHO / 2, 60, 'ELIGE TU DESTINO', { ...ESTILO_TEXTO, fontSize: '40px', color: '#F2B138', strokeThickness: 7 }).setOrigin(0.5);
    this.add.text(ANCHO / 2, 105, 'Recupera los componentes y reactiva la red de comunicación', { ...ESTILO_TEXTO, fontSize: '18px', strokeThickness: 3 }).setOrigin(0.5);

    const ancho = 170;
    const hueco = 20;
    const inicio = (ANCHO - (4 * ancho + 3 * hueco)) / 2 + ancho / 2;

    NIVELES.forEach((n, i) => {
      const x = inicio + i * (ancho + hueco);
      const y = 300;
      const activo = n.jugable;

      const tarjeta = this.add.rectangle(x, y, ancho, 250, n.color, activo ? 1 : 0.25).setStrokeStyle(4, activo ? 0xF2B138 : 0x555a66);
      if (activo) {
        // Vista previa del paisaje de la región.
        this.add.image(x, y - 70, `lejos_${n.id}`).setDisplaySize(ancho - 12, 62);
      }
      this.add.text(x - 62, y - 100, String(n.id), { ...ESTILO_TEXTO, fontSize: '34px', color: activo ? '#ffffff' : '#777b86' }).setOrigin(0.5);
      this.add.text(x, y - 20, n.nombre, { ...ESTILO_TEXTO, fontSize: '20px', align: 'center', wordWrap: { width: ancho - 16 }, color: activo ? '#ffffff' : '#9a9ea8' }).setOrigin(0.5);
      this.add.text(x, y + 30, n.region, { ...ESTILO_TEXTO, fontSize: '16px', strokeThickness: 3, color: activo ? '#fff7b2' : '#777b86' }).setOrigin(0.5);

      if (activo) {
        const hecho = Progreso.tiene(n.id);
        this.add.text(x, y + 85, hecho ? (n.id === 4 ? 'Completado ✔' : 'Componente ✔') : 'JUGAR', {
          ...ESTILO_TEXTO, fontSize: '20px', strokeThickness: 3, backgroundColor: hecho ? '#3E7D3C' : '#e67e22', padding: { x: 14, y: 6 }
        }).setOrigin(0.5);
        tarjeta.setInteractive({ useHandCursor: true });
        tarjeta.on('pointerover', () => tarjeta.setStrokeStyle(4, 0xffffff));
        tarjeta.on('pointerout', () => tarjeta.setStrokeStyle(4, 0xF2B138));
        tarjeta.on('pointerup', () => this.jugar(n.id));
      } else {
        this.add.text(x, y + 85, 'Próximamente', { ...ESTILO_TEXTO, fontSize: '16px', strokeThickness: 2, color: '#9a9ea8' }).setOrigin(0.5);
      }
    });

    this.add.text(ANCHO / 2, 470, 'Componentes:', { ...ESTILO_TEXTO, fontSize: '20px', strokeThickness: 3 }).setOrigin(1, 0.5);
    for (let i = 1; i <= 3; i += 1) {
      this.add.image(ANCHO / 2 + 30 + (i - 1) * 34, 470, Progreso.tiene(i) ? 'icono_comp' : 'icono_comp_vacio').setDisplaySize(28, 28);
    }

    const volver = this.add.text(ANCHO / 2, 540, 'VOLVER (Esc)', {
      fontFamily: 'Arial', fontSize: '22px', color: '#ffffff', backgroundColor: '#2c3e50', padding: { x: 20, y: 8 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    volver.on('pointerup', () => this.scene.start('Menu'));

    this.input.keyboard.on('keydown-ESC', () => this.scene.start('Menu'));
    this.input.keyboard.on('keydown-ONE', () => this.jugar(1));
    this.input.keyboard.on('keydown-TWO', () => this.jugar(2));
    this.input.keyboard.on('keydown-THREE', () => this.jugar(3));
    this.input.keyboard.on('keydown-FOUR', () => this.jugar(4));
  }

  jugar(id) {
    this.scene.start('Juego', { nivel: id, desdeMetros: 0 });
  }
}
