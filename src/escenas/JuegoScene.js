// Escena principal: el juego de correr.
class JuegoScene extends Phaser.Scene {
  constructor() {
    super('Juego');
  }

  create() {
    const { ANCHO, ALTO, SUELO_Y, JUGADOR_X } = CONFIG;

    this.contador = 0;
    this.distancia = 0;
    this.velocidad = CONFIG.VEL_INICIAL;
    this.proximoObstaculo = 500;
    this.saltosRestantes = 2;
    this.juegoTerminado = false;
    this.tiempoFin = 0;

    // Fondo con parallax.
    this.nubes = this.add.tileSprite(0, 0, ANCHO, 160, 'nubes').setOrigin(0, 0).setDepth(-30);
    this.colinas = this.add.tileSprite(0, SUELO_Y + 10, ANCHO, 220, 'colinas').setOrigin(0, 1).setDepth(-20);
    this.suelo = this.add.tileSprite(0, SUELO_Y, ANCHO, ALTO - SUELO_Y, 'suelo').setOrigin(0, 0).setDepth(0);

    // Suelo físico invisible.
    this.sueloFisico = this.add.rectangle(ANCHO / 2, SUELO_Y + 40, ANCHO, 80).setVisible(false);
    this.physics.add.existing(this.sueloFisico, true);

    this.jugador = this.physics.add.sprite(JUGADOR_X, SUELO_Y - 100, 'monito');
    this.jugador.setScale(0.6).setDepth(2);
    this.jugador.body.setSize(70, 80);
    this.jugador.body.setOffset(24, 32);

    this.obstaculos = this.physics.add.group({ allowGravity: false, immovable: true });
    this.bananas = this.physics.add.group({ allowGravity: false, immovable: true });

    this.physics.add.collider(this.jugador, this.sueloFisico);
    this.physics.add.overlap(this.jugador, this.bananas, (j, banana) => this.comerBanana(banana));
    this.physics.add.overlap(this.jugador, this.obstaculos, () => this.terminarJuego());

    this.crearControles();
    this.crearHUD();
  }

  crearControles() {
    // Espacio, flecha arriba, W o toque/clic.
    ['SPACE', 'UP', 'W'].forEach(tecla => this.input.keyboard.on(`keydown-${tecla}`, () => this.accionSalto()));
    this.input.keyboard.on('keydown-ESC', () => this.volverAlMenu());
    this.input.keyboard.on('keydown-M', () => this.juegoTerminado && this.volverAlMenu());
    this.input.on('pointerdown', (pointer, sobre) => {
      if (sobre.length === 0) this.accionSalto(); // ignora toques sobre botones
    });
  }

  crearHUD() {
    const { ANCHO, ALTO } = CONFIG;
    this.textoBananas = this.add.text(20, 16, 'Bananas: 0', ESTILO_TEXTO).setDepth(10);
    this.textoDistancia = this.add.text(20, 48, 'Distancia: 0 m', { ...ESTILO_TEXTO, fontSize: '20px', strokeThickness: 4 }).setDepth(10);
    this.textoMejor = this.add.text(ANCHO - 20, 16, `Mejor: ${Record.valor} m`, { ...ESTILO_TEXTO, fontSize: '20px', strokeThickness: 4 })
      .setOrigin(1, 0).setDepth(10);

    const ayuda = this.add.text(ANCHO / 2, 140, 'Espacio / ↑ / toque: saltar\n(puedes saltar dos veces)', {
      ...ESTILO_TEXTO,
      align: 'center',
      fontSize: '26px'
    }).setOrigin(0.5).setDepth(10);
    this.tweens.add({ targets: ayuda, alpha: 0, delay: 3500, duration: 800 });

    this.textoFin = this.add.text(ANCHO / 2, ALTO / 2 - 60, '', {
      ...ESTILO_TEXTO,
      fontSize: '36px',
      color: '#fff7b2',
      align: 'center',
      strokeThickness: 7
    }).setOrigin(0.5).setDepth(20);

    this.botonMenu = this.add.text(ANCHO / 2, ALTO / 2 + 90, 'MENÚ (M)', {
      fontFamily: 'Arial',
      fontSize: '26px',
      color: '#ffffff',
      backgroundColor: '#2c3e50',
      padding: { x: 24, y: 8 }
    }).setOrigin(0.5).setDepth(20).setVisible(false).setInteractive({ useHandCursor: true });
    this.botonMenu.on('pointerup', () => this.volverAlMenu());
  }

  update(time, delta) {
    if (this.juegoTerminado) return;

    const dt = delta / 1000;
    const metros = this.distancia / CONFIG.PIXELES_POR_METRO;

    // La velocidad sube poco a poco, como en los juegos de correr infinitos.
    this.velocidad = Math.min(CONFIG.VEL_MAXIMA, CONFIG.VEL_INICIAL + metros * 2);
    this.distancia += this.velocidad * dt;

    this.suelo.tilePositionX += this.velocidad * dt;
    this.colinas.tilePositionX += this.velocidad * dt * 0.25;
    this.nubes.tilePositionX += this.velocidad * dt * 0.1;

    this.actualizarJugador(time);

    if (this.distancia >= this.proximoObstaculo) {
      this.generarPatron();
      this.proximoObstaculo = this.distancia + Phaser.Math.Between(600, 900);
    }

    [this.obstaculos, this.bananas].forEach(grupo => {
      grupo.getChildren().slice().forEach(objeto => {
        objeto.body.setVelocityX(-this.velocidad);
        if (objeto.x < -120) objeto.destroy();
      });
    });

    this.textoBananas.setText(`Bananas: ${this.contador}`);
    this.textoDistancia.setText(`Distancia: ${Math.floor(this.distancia / CONFIG.PIXELES_POR_METRO)} m`);
  }

  actualizarJugador(time) {
    const j = this.jugador;
    const enSuelo = j.body.blocked.down || j.body.touching.down;
    if (enSuelo && j.body.velocity.y >= 0) {
      this.saltosRestantes = 2;
      j.setAngle(Math.sin(time * 0.025) * 6); // balanceo mientras corre
    } else {
      j.setAngle(Phaser.Math.Clamp(j.body.velocity.y * 0.02, -15, 20));
    }
  }

  accionSalto() {
    if (this.juegoTerminado) {
      if (this.time.now - this.tiempoFin > 600) this.scene.restart();
      return;
    }
    if (this.saltosRestantes <= 0) return;
    this.jugador.setVelocityY(this.saltosRestantes === 2 ? -CONFIG.VEL_SALTO_1 : -CONFIG.VEL_SALTO_2);
    this.saltosRestantes -= 1;
  }

  volverAlMenu() {
    this.scene.start('Menu');
  }

  // ---------- Objetos del nivel ----------

  crearRoca(x) {
    const roca = this.obstaculos.create(x, CONFIG.SUELO_Y + 2, 'roca');
    roca.setOrigin(0.5, 1).setDepth(1).setScale(Phaser.Math.FloatBetween(0.9, 1.3));
    roca.body.setSize(44, 38);
    roca.body.setOffset(10, 16);
    return roca;
  }

  crearPajaro(x, y) {
    const pajaro = this.obstaculos.create(x, y, 'pajaro');
    pajaro.setDepth(1);
    pajaro.body.setSize(36, 22);
    pajaro.body.setOffset(10, 10);
    this.tweens.add({ targets: pajaro, scaleY: 0.6, duration: 160, yoyo: true, repeat: -1 });
    return pajaro;
  }

  crearBanana(x, y) {
    return this.bananas.create(x, y, 'banana').setDepth(1);
  }

  arcoDeBananas(xCentro, cantidad, separacion, altura) {
    const inicioX = xCentro - ((cantidad - 1) * separacion) / 2;
    for (let i = 0; i < cantidad; i += 1) {
      const t = cantidad === 1 ? 0 : i / (cantidad - 1);
      this.crearBanana(inicioX + i * separacion, CONFIG.SUELO_Y - 50 - Math.sin(Math.PI * t) * altura);
    }
  }

  generarPatron() {
    const { ANCHO, SUELO_Y } = CONFIG;
    const x = ANCHO + 80;
    const tipo = Phaser.Math.Between(0, 5);

    if (tipo <= 2) {
      // Una roca con arco de bananas encima.
      this.crearRoca(x);
      this.arcoDeBananas(x, 5, 50, 120);
    } else if (tipo === 3) {
      // Dos rocas juntas con un arco más largo.
      this.crearRoca(x);
      this.crearRoca(x + 70);
      this.arcoDeBananas(x + 35, 7, 50, 135);
    } else if (tipo === 4) {
      // Pájaro volando alto y bananas en el suelo.
      this.crearPajaro(x + 120, SUELO_Y - Phaser.Math.Between(150, 175));
      for (let i = 0; i < 5; i += 1) this.crearBanana(x + i * 50, SUELO_Y - 40);
    } else {
      // Fila de bananas en el aire: hay que saltar para tomarlas.
      for (let i = 0; i < 6; i += 1) this.crearBanana(x + i * 50, SUELO_Y - 150);
    }
  }

  // ---------- Eventos ----------

  comerBanana(banana) {
    banana.destroy();
    this.contador += 1;
  }

  terminarJuego() {
    if (this.juegoTerminado) return;
    this.juegoTerminado = true;
    this.tiempoFin = this.time.now;

    const metros = Math.floor(this.distancia / CONFIG.PIXELES_POR_METRO);
    const esRecord = Record.actualizar(metros);

    [this.obstaculos, this.bananas].forEach(grupo => {
      grupo.getChildren().forEach(objeto => objeto.body.setVelocityX(0));
    });
    this.tweens.killAll();
    this.jugador.setTint(0xff7777).setAngle(0).setVelocityY(-350);

    this.textoMejor.setText(`Mejor: ${Record.valor} m`);
    this.textoFin.setText(
      `¡Chocaste!\nBananas: ${this.contador}   Distancia: ${metros} m` +
      `${esRecord ? '\n¡Nuevo récord!' : ''}\n\nEspacio o toque para reintentar`
    );
    this.botonMenu.setVisible(true);
  }
}
