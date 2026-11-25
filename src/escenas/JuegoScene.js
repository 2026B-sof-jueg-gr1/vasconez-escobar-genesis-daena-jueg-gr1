// Escena principal: el nivel de correr (Tres Regiones: Tierra en Ruinas).
class JuegoScene extends Phaser.Scene {
  constructor() {
    super('Juego');
  }

  init(datos) {
    this.idNivel = (datos && datos.nivel) || 1;
    this.desdeMetros = (datos && datos.desdeMetros) || 0;
  }

  create() {
    const { ANCHO, ALTO, SUELO_Y, JUGADOR_X } = CONFIG;
    this.nivel = NIVELES.find(n => n.id === this.idNivel);

    // Estado de la partida. "reloj" solo avanza mientras se juega (no en pausa).
    this.estado = 'jugando'; // jugando | pausa | victoria | derrota
    this.reloj = 0;
    this.tiempoFin = 0;
    this.distancia = this.desdeMetros * CONFIG.PIXELES_POR_METRO;
    this.velocidad = this.nivel.velIni;
    this.vidas = CONFIG.VIDAS;
    this.aliados = [];
    this.rescatados = 0;
    this.suministros = 0;
    this.vencidos = 0;
    this.invulnerableHasta = 0;
    this.deslizando = false;
    this.deslizHasta = 0;
    this.deslizLibre = 0;
    this.ataqueLibre = 0;
    this.saltosRestantes = 2;
    this.checkpointAlcanzado = this.desdeMetros >= CONFIG.CHECKPOINT_M;
    this.cola = this.nivel.eventos.filter(e => e[0] > this.desdeMetros);
    this.jefe = null;
    this.modoJefe = false;
    this.panel = [];

    // Fondo con parallax.
    const id = this.idNivel;
    this.add.image(0, 0, `cielo_${id}`).setOrigin(0, 0).setDepth(-50);
    this.nubes = this.add.tileSprite(0, 20, ANCHO, 200, `nubes_${id}`).setOrigin(0, 0).setDepth(-40);
    this.lejos = this.add.tileSprite(0, SUELO_Y, ANCHO, 300, `lejos_${id}`).setOrigin(0, 1).setDepth(-30);
    this.cerca = this.add.tileSprite(0, SUELO_Y + 6, ANCHO, 260, `cerca_${id}`).setOrigin(0, 1).setDepth(-20).setAlpha(0.88);
    this.suelo = this.add.tileSprite(0, SUELO_Y, ANCHO, ALTO - SUELO_Y, `suelo_${id}`).setOrigin(0, 0).setDepth(0);

    // Suelo físico invisible.
    this.sueloFisico = this.add.rectangle(ANCHO / 2, SUELO_Y + 40, ANCHO, 80).setVisible(false);
    this.physics.add.existing(this.sueloFisico, true);

    // Aru.
    this.jugador = this.physics.add.sprite(JUGADOR_X, SUELO_Y - 100, 'aru_correr1').setOrigin(0.5, 1).setDepth(2);
    this.cuerpoDePie();
    this.vistos = new Set();

    this.peligros = this.physics.add.group({ allowGravity: false, immovable: true });
    this.items = this.physics.add.group({ allowGravity: false, immovable: true });
    this.civiles = this.physics.add.group({ allowGravity: false, immovable: true });

    this.physics.add.collider(this.jugador, this.sueloFisico);
    this.physics.add.overlap(this.jugador, this.peligros, () => this.recibirGolpe());
    this.physics.add.overlap(this.jugador, this.items, (j, item) => this.recoger(item));
    this.physics.add.overlap(this.jugador, this.civiles, (j, civil) => this.rescatar(civil));

    this.crearControles();
    this.crearHUD();
  }

  // ---------- Controles ----------

  crearControles() {
    const teclado = this.input.keyboard;
    ['SPACE', 'UP', 'W'].forEach(t => teclado.on(`keydown-${t}`, () => this.teclaPrincipal()));
    ['DOWN', 'S'].forEach(t => teclado.on(`keydown-${t}`, () => this.accionDeslizar()));
    ['X', 'Z', 'K', 'J', 'SHIFT'].forEach(t => teclado.on(`keydown-${t}`, () => this.accionAtaque()));
    teclado.on('keydown-ESC', () => this.alternarPausa());
    teclado.on('keydown-M', () => { if (this.estado !== 'jugando') this.volverAlMenu(); });
    teclado.on('keydown-R', () => {
      if (this.estado === 'pausa') this.reiniciar(0);
      else if (this.estado === 'derrota') this.reiniciar(this.checkpointAlcanzado ? CONFIG.CHECKPOINT_M : 0);
    });
    teclado.on('keydown-N', () => { if (this.estado === 'derrota') this.reiniciar(0); });

    if (this.input.mouse) this.input.mouse.disableContextMenu();
    this.input.on('pointerdown', (pointer, sobre) => {
      if (sobre.length > 0) return; // ignora clics sobre botones
      if (pointer.rightButtonDown()) this.accionAtaque();
      else this.teclaPrincipal();
    });
  }

  teclaPrincipal() {
    if (this.estado === 'jugando') {
      this.accionSalto();
    } else if (this.time.now - this.tiempoFin > 600) {
      if (this.estado === 'derrota') this.reiniciar(this.checkpointAlcanzado ? CONFIG.CHECKPOINT_M : 0);
      else if (this.estado === 'victoria') this.siguienteNivel();
    }
  }

  enSuelo() {
    return this.jugador.body.blocked.down || this.jugador.body.touching.down;
  }

  // Cambia la imagen de Aru y ajusta su caja de colisión (en píxeles de pantalla).
  poner(clave, cw, ch, dx, dyAbajo) {
    this.jugador.setTexture(clave).setDisplaySize(SPRITES[clave].w, SPRITES[clave].h);
    this.ajustar(this.jugador, cw, ch, dx, dyAbajo);
  }

  cuerpoDePie() {
    this.poner('aru_correr1', 28, 68, 1, 2);
    this.animacion = 'correr1';
  }

  accionSalto() {
    if (this.deslizando) this.terminarDeslizar();
    if (this.saltosRestantes <= 0) return;
    this.jugador.setVelocityY(this.saltosRestantes === 2 ? -CONFIG.VEL_SALTO_1 : -CONFIG.VEL_SALTO_2);
    this.saltosRestantes -= 1;
  }

  accionDeslizar() {
    if (this.estado !== 'jugando' || this.deslizando || this.reloj < this.deslizLibre || !this.enSuelo()) return;
    this.deslizando = true;
    this.deslizHasta = this.reloj + CONFIG.DESLIZ_MS;
    this.poner('aru_desliz', 44, 26, -2, 4);
    this.animacion = 'desliz';
  }

  terminarDeslizar() {
    this.deslizando = false;
    this.deslizLibre = this.reloj + CONFIG.DESLIZ_ESPERA_MS;
    this.cuerpoDePie();
  }

  accionAtaque() {
    if (this.estado !== 'jugando' || this.reloj < this.ataqueLibre) return;
    this.ataqueLibre = this.reloj + CONFIG.ATAQUE_ESPERA_MS;

    const j = this.jugador;
    const zona = new Phaser.Geom.Rectangle(CONFIG.JUGADOR_X - 10, j.y - 100, CONFIG.ATAQUE_ALCANCE + 20, 110);

    const tajo = this.add.image(CONFIG.JUGADOR_X + 70, j.y - 45, 'tajo').setDisplaySize(150, 100).setDepth(3);
    this.tweens.add({ targets: tajo, alpha: 0, scaleX: tajo.scaleX * 1.2, duration: 170, onComplete: () => tajo.destroy() });

    this.peligros.getChildren().forEach(o => {
      if (!o.esEnemigo || o.muerto || o.colgando) return;
      if (Phaser.Geom.Intersects.RectangleToRectangle(zona, o.getBounds())) this.vencer(o);
    });

    if (this.jefe && this.jefe.vulnerable && Phaser.Geom.Intersects.RectangleToRectangle(zona, this.jefe.getBounds())) {
      this.golpearJefe();
    }
  }

  alternarPausa() {
    if (this.estado === 'jugando') {
      this.estado = 'pausa';
      this.physics.world.pause();
      this.tweens.pauseAll();
      this.mostrarPanel('PAUSA', 'Esc: continuar', [
        { texto: 'CONTINUAR (Esc)', accion: () => this.alternarPausa() },
        { texto: 'REINICIAR NIVEL (R)', accion: () => this.reiniciar(0) },
        { texto: 'MENÚ (M)', accion: () => this.volverAlMenu() }
      ]);
    } else if (this.estado === 'pausa') {
      this.estado = 'jugando';
      this.physics.world.resume();
      this.tweens.resumeAll();
      this.ocultarPanel();
    }
  }

  reiniciar(desdeMetros) {
    this.scene.restart({ nivel: this.idNivel, desdeMetros });
  }

  siguienteNivel() {
    const siguiente = NIVELES.find(n => n.id === this.idNivel + 1 && n.jugable);
    if (siguiente) this.scene.restart({ nivel: siguiente.id, desdeMetros: 0 });
    else this.volverAlMenu();
  }

  volverAlMenu() {
    this.scene.start('Niveles');
  }

  // ---------- HUD ----------

  crearHUD() {
    const { ANCHO, ALTO } = CONFIG;
    const pequeno = { ...ESTILO_TEXTO, fontSize: '12px', strokeThickness: 3 };

    this.add.text(24, 6, 'VIDA', pequeno).setDepth(10);
    this.corazones = [0, 1, 2].map(i => this.add.image(36 + i * 34, 34, 'corazon').setDisplaySize(28, 26).setDepth(10));

    this.add.text(150, 6, 'ALIADOS', pequeno).setDepth(10);
    this.iconosAliados = [0, 1].map(i => this.add.image(162 + i * 30, 34, 'icono_aliado').setDisplaySize(26, 26).setDepth(10));

    this.add.text(250, 6, 'COMPONENTES', pequeno).setDepth(10);
    this.iconosComp = [1, 2, 3].map((n, i) =>
      this.add.image(262 + i * 30, 34, Progreso.tiene(n) ? 'icono_comp' : 'icono_comp_vacio').setDisplaySize(26, 26).setDepth(10));

    this.textoDistancia = this.add.text(ANCHO - 20, 6, '0 m', { ...ESTILO_TEXTO, fontSize: '26px' }).setOrigin(1, 0).setDepth(10);
    this.textoMejor = this.add.text(ANCHO - 20, 38, `Récord: ${Record.valor} m`, { ...ESTILO_TEXTO, fontSize: '14px', strokeThickness: 3 })
      .setOrigin(1, 0).setDepth(10);

    // Barra de progreso del nivel.
    this.add.rectangle(ANCHO / 2, 64, ANCHO - 40, 8, 0x000000, 0.45).setDepth(10);
    this.barra = this.add.rectangle(20, 64, ANCHO - 40, 8, 0xF2B138).setOrigin(0, 0.5).setDepth(11);
    this.barra.scaleX = 0.001;

    // Botones en pantalla (útiles con ratón o pantalla táctil).
    const estiloBoton = { fontFamily: 'Arial', fontSize: '20px', color: '#ffffff', padding: { x: 14, y: 8 } };
    const crearBoton = (x, texto, color, accion) => {
      const b = this.add.text(x, ALTO - 36, texto, { ...estiloBoton, backgroundColor: color }).setOrigin(0.5).setDepth(12).setAlpha(0.9)
        .setInteractive({ useHandCursor: true });
      b.on('pointerdown', accion);
      return b;
    };
    crearBoton(100, 'DESLIZAR ↓', '#2c6e9e', () => this.accionDeslizar());
    crearBoton(ANCHO - 100, 'ATACAR  X', '#b3392f', () => this.accionAtaque());

    // Mensaje inicial.
    const titulo = this.add.text(ANCHO / 2, 140, `NIVEL ${this.nivel.id} — ${this.nivel.nombre.toUpperCase()}\n${this.nivel.mision}`, {
      ...ESTILO_TEXTO, fontSize: '26px', align: 'center'
    }).setOrigin(0.5).setDepth(10);
    const ayuda = this.add.text(ANCHO / 2, 215, 'Espacio / ↑: saltar (x2)    ↓ / S: deslizar    X / Z / Shift / clic derecho: atacar\nTambién hay botones en pantalla. Cada aliado rescatado absorbe un golpe', {
      ...ESTILO_TEXTO, fontSize: '17px', strokeThickness: 4, align: 'center'
    }).setOrigin(0.5).setDepth(10);
    this.tweens.add({ targets: [titulo, ayuda], alpha: 0, delay: 4500, duration: 800 });
  }

  actualizarHUD() {
    const m = Math.floor(this.distancia / CONFIG.PIXELES_POR_METRO);
    this.textoDistancia.setText(`${m} m`);
    this.corazones.forEach((c, i) => c.setTexture(i < this.vidas ? 'corazon' : 'corazon_vacio').setDisplaySize(28, 26));
    this.iconosAliados.forEach((icono, i) => icono.setAlpha(i < this.aliados.length ? 1 : 0.25));
    this.iconosComp.forEach((icono, i) => icono.setTexture(Progreso.tiene(i + 1) ? 'icono_comp' : 'icono_comp_vacio').setDisplaySize(26, 26));
    this.barra.scaleX = Math.max(0.001, Math.min(0.98, m / CONFIG.LARGO_NIVEL_M));
  }

  mostrarAviso(texto, color = '#ffffff') {
    const t = this.add.text(CONFIG.ANCHO / 2, 110, texto, { ...ESTILO_TEXTO, fontSize: '24px', color }).setOrigin(0.5).setDepth(15);
    this.tweens.add({ targets: t, y: 85, alpha: 0, delay: 600, duration: 800, onComplete: () => t.destroy() });
  }

  mostrarPanel(titulo, cuerpo, botones) {
    const { ANCHO, ALTO } = CONFIG;
    this.panel = [];
    this.panel.push(this.add.rectangle(ANCHO / 2, ALTO / 2, ANCHO, ALTO, 0x000000, 0.62).setDepth(19));
    this.panel.push(this.add.text(ANCHO / 2, 140, titulo, { ...ESTILO_TEXTO, fontSize: '36px', color: '#F2B138', align: 'center', strokeThickness: 7 }).setOrigin(0.5).setDepth(20));
    this.panel.push(this.add.text(ANCHO / 2, 240, cuerpo, { ...ESTILO_TEXTO, fontSize: '22px', align: 'center', strokeThickness: 4 }).setOrigin(0.5).setDepth(20));
    botones.forEach((b, i) => {
      const boton = this.add.text(ANCHO / 2, 345 + i * 52, b.texto, {
        fontFamily: 'Arial', fontSize: '24px', color: '#ffffff', backgroundColor: '#2c3e50', padding: { x: 20, y: 7 }
      }).setOrigin(0.5).setDepth(20).setInteractive({ useHandCursor: true });
      boton.on('pointerup', b.accion);
      this.panel.push(boton);
    });
  }

  ocultarPanel() {
    this.panel.forEach(o => o.destroy());
    this.panel = [];
  }

  // ---------- Bucle principal ----------

  update(time, delta) {
    if (this.estado !== 'jugando') return;
    this.reloj += delta;
    const dt = Math.min(delta, 50) / 1000;
    const m = this.distancia / CONFIG.PIXELES_POR_METRO;

    // La velocidad sube gradualmente a lo largo del nivel.
    const t = Math.min(1, m / CONFIG.LARGO_NIVEL_M);
    this.velocidad = this.nivel.velIni + (this.nivel.velFin - this.nivel.velIni) * t;
    this.distancia += this.velocidad * dt;

    this.suelo.tilePositionX += this.velocidad * dt;
    this.cerca.tilePositionX += this.velocidad * dt * 0.55;
    this.lejos.tilePositionX += this.velocidad * dt * 0.15;
    this.nubes.tilePositionX += this.velocidad * dt * 0.05;

    this.actualizarJugador(time);
    this.actualizarEventos(m);
    this.actualizarObjetos(dt);
    if (this.jefe) this.actualizarJefe();
    this.actualizarAliados();
    this.actualizarHUD();
  }

  actualizarJugador(time) {
    const j = this.jugador;
    if (this.deslizando && this.reloj >= this.deslizHasta) this.terminarDeslizar();

    const suelo = this.enSuelo() && j.body.velocity.y >= 0;
    if (suelo) this.saltosRestantes = 2;
    if (this.deslizando) return;

    // Animación: dos fotogramas al correr y uno en el aire.
    const quiero = !suelo ? 'salto' : (Math.floor(this.reloj / 110) % 2 ? 'correr2' : 'correr1');
    if (quiero !== this.animacion) {
      this.animacion = quiero;
      this.poner(`aru_${quiero}`, 28, 68, 1, 2);
    }
  }

  actualizarEventos(m) {
    if (!this.checkpointAlcanzado && m >= CONFIG.CHECKPOINT_M) {
      this.checkpointAlcanzado = true;
      this.mostrarAviso('Punto de control', '#2FA7A0');
    }
    while (this.cola.length && this.distancia >= this.cola[0][0] * CONFIG.PIXELES_POR_METRO) {
      this.generar(this.cola.shift()[1], CONFIG.ANCHO + 80);
    }
    if (this.nivel.jefe && !this.modoJefe && m >= this.nivel.jefe.inicio) this.iniciarJefe();
  }

  actualizarObjetos(dt) {
    [this.peligros, this.items, this.civiles].forEach(grupo => {
      grupo.getChildren().slice().forEach(o => {
        if (!o.active) return;

        // El Coloso Trepador cae cuando el jugador se acerca.
        if (o.tipo === 'trepador' && !o.cayendo && !o.caido && o.x - CONFIG.JUGADOR_X < 250) {
          o.cayendo = true;
          o.vy = 0;
        }
        if (o.cayendo) {
          o.vy += CONFIG.GRAVEDAD * dt;
          o.y += o.vy * dt;
          if (o.y >= CONFIG.SUELO_Y + 2) {
            o.y = CONFIG.SUELO_Y + 2;
            o.cayendo = false;
            o.caido = true;
            o.colgando = false;
          }
        }

        if (o.esComponente) {
          // El componente avanza despacio hacia Aru y reaparece si se le pasa: no se puede perder.
          o.body.setVelocityX(-170);
          if (o.x < CONFIG.JUGADOR_X - 90) o.x = CONFIG.ANCHO + 40;
          return;
        }
        o.body.setVelocityX(-(this.velocidad + (o.extraVel || 0)));
        if (o.etiqueta) {
          o.etiqueta.setPosition(o.x, o.y - o.displayHeight - 8);
          if (o.x < CONFIG.JUGADOR_X - 20 || o.muerto || o.rescatado) { o.etiqueta.destroy(); o.etiqueta = null; }
        }
        if (o.x < -150) o.destroy();
      });
    });
  }

  actualizarAliados() {
    this.aliados.forEach((a, i) => {
      a.x = CONFIG.JUGADOR_X - 38 * (i + 1);
      a.y = CONFIG.SUELO_Y + 4 - Math.abs(Math.sin(this.reloj * 0.012 + i * 1.5)) * 8;
    });
  }

  // ---------- Objetos del nivel ----------

  // Caja de colisión de w x h píxeles de pantalla, centrada y apoyada abajo.
  // dx desplaza la caja a los lados; dyAbajo la sube respecto al borde inferior de la imagen.
  ajustar(o, w, h, dx = 0, dyAbajo = 0) {
    const sx = o.scaleX;
    const sy = o.scaleY;
    o.body.setSize(w / sx, h / sy);
    o.body.setOffset((o.width - w / sx) / 2 + dx / sx, o.height - h / sy - dyAbajo / sy);
  }

  // Crea un objeto del nivel con el tamaño definido en SPRITES (y = borde inferior).
  crearEnPiso(grupo, x, clave, cw, ch, y = CONFIG.SUELO_Y + 2, dyAbajo = 3) {
    const o = grupo.create(x, y, clave).setOrigin(0.5, 1).setDepth(1);
    o.setDisplaySize(SPRITES[clave].w, SPRITES[clave].h);
    this.ajustar(o, cw, ch, 0, dyAbajo);
    return o;
  }

  generar(tipo, x) {
    const { SUELO_Y } = CONFIG;
    let o;
    switch (tipo) {
      case 'muro': {
        const tex = this.nivel.texMuro || 'muro';
        const caja = tex === 'tronco' ? [62, 36] : [54, 40];
        this.etiquetar(this.crearEnPiso(this.peligros, x, tex, caja[0], caja[1]), 'muro', '¡SALTA!', '#ffe07a');
        break;
      }
      case 'hueco':
        // El hueco se dibuja bajo el borde del suelo; solo su borde superior hace daño.
        o = this.crearEnPiso(this.peligros, x, 'hueco', 100, 16, SUELO_Y + 42, 32);
        o.tipo = 'hueco';
        this.etiquetar(o, 'hueco', '¡SALTA EL HUECO!', '#ffe07a');
        break;
      case 'errante':
        o = this.crearEnPiso(this.peligros, x, 'errante', 32, 58);
        this.etiquetar(o, 'errante', '¡ATACA! (X)', '#ff9a8f');
        o.tipo = 'errante';
        o.esEnemigo = true;
        o.extraVel = CONFIG.VEL_ENEMIGO_EXTRA;
        break;
      case 'trepador':
        o = this.crearEnPiso(this.peligros, x, 'trepador', 34, 40, 340, 6);
        this.etiquetar(o, 'trepador', '¡CAE! Esquiva o ataca', '#ff9a8f');
        o.tipo = 'trepador';
        o.esEnemigo = true;
        o.colgando = true;
        break;
      case 'colgante':
        this.etiquetar(this.crearEnPiso(this.peligros, x, 'colgante', 100, 38, 491, 6), 'colgante', '¡DESLIZA! (↓)', '#ffe07a').tipo = 'colgante';
        break;
      case 'pinchos':
        for (let i = 0; i < 3; i += 1) {
          const pincho = this.crearEnPiso(this.peligros, x + i * 38, 'pincho', 32, 24);
          pincho.tipo = 'pincho';
          if (i === 1) this.etiquetar(pincho, 'pincho', '¡SALTA!', '#ffe07a');
        }
        break;
      case 'civil':
        this.etiquetar(this.crearEnPiso(this.civiles, x, 'civil', 28, 54, SUELO_Y + 2, 2), 'civil', '¡RESCÁTALO!', '#9be29b');
        break;
      case 'civilAlto':
        // Ruta alta: un pilar en ruinas con un civil encima (hay que saltar, con riesgo).
        o = this.crearEnPiso(this.peligros, x, 'pilar', 48, 112);
        o.tipo = 'pilar';
        this.etiquetar(o, 'pilar', '¡SALTA! Hay un civil arriba', '#9be29b');
        this.crearEnPiso(this.civiles, x, 'civil', 28, 54, SUELO_Y + 2 - 116, 2);
        break;
      case 'arco':
        this.arcoDeSuministros(x + 60, 5, 50, 120);
        break;
      case 'viveres':
        for (let i = 0; i < 6; i += 1) this.crearSuministro(x + i * 50, SUELO_Y - 40);
        break;
      case 'componente':
        this.crearComponente(x);
        break;
      default:
        break;
    }
  }

  // Muestra una etiqueta flotante sobre la primera aparición de cada tipo de objeto.
  etiquetar(objeto, clave, texto, color) {
    if (this.vistos.has(clave)) return objeto;
    this.vistos.add(clave);
    objeto.etiqueta = this.add.text(objeto.x, objeto.y, texto, {
      ...ESTILO_TEXTO, fontSize: '18px', strokeThickness: 5, color
    }).setOrigin(0.5, 1).setDepth(8);
    return objeto;
  }

  crearSuministro(x, y) {
    const v = this.items.create(x, y, 'viveres').setDepth(1);
    v.setDisplaySize(SPRITES.viveres.w, SPRITES.viveres.h);
    this.ajustar(v, 26, 26, 0, 5);
    return v;
  }

  arcoDeSuministros(xCentro, cantidad, separacion, altura) {
    const inicioX = xCentro - ((cantidad - 1) * separacion) / 2;
    for (let i = 0; i < cantidad; i += 1) {
      const t = cantidad === 1 ? 0 : i / (cantidad - 1);
      this.crearSuministro(inicioX + i * separacion, CONFIG.SUELO_Y - 50 - Math.sin(Math.PI * t) * altura);
    }
  }

  crearComponente(x) {
    const c = this.items.create(x, CONFIG.SUELO_Y - 50, 'componente').setDepth(2);
    c.setDisplaySize(SPRITES.componente.w, SPRITES.componente.h);
    c.esComponente = true;
    this.ajustar(c, 44, 44, 0, 4);
    this.tweens.add({ targets: c, y: c.y - 8, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    return c;
  }

  // ---------- Eventos de juego ----------

  recoger(item) {
    if (!item.active) return;
    if (item.esComponente) {
      item.destroy();
      this.completarNivel();
      return;
    }
    item.destroy();
    this.suministros += 1;
  }

  rescatar(civil) {
    if (!civil.active || civil.rescatado) return;
    civil.rescatado = true;
    civil.body.checkCollision.none = true;
    this.rescatados += 1;

    if (this.aliados.length < CONFIG.MAX_ALIADOS) {
      const aliado = this.add.image(CONFIG.JUGADOR_X - 38, CONFIG.SUELO_Y + 2, 'civil').setOrigin(0.5, 1).setDepth(1)
        .setDisplaySize(SPRITES.civil.w * 0.9, SPRITES.civil.h * 0.9);
      this.aliados.push(aliado);
      this.mostrarAviso('¡Civil rescatado! Te acompaña', '#9be29b');
    } else {
      this.mostrarAviso('¡Civil rescatado!', '#9be29b');
    }
    if (civil.etiqueta) { civil.etiqueta.destroy(); civil.etiqueta = null; }
    this.tweens.add({ targets: civil, y: civil.y - 60, alpha: 0, duration: 400, onComplete: () => civil.destroy() });
  }

  vencer(enemigo) {
    enemigo.muerto = true;
    enemigo.body.checkCollision.none = true;
    this.vencidos += 1;
    if (enemigo.etiqueta) { enemigo.etiqueta.destroy(); enemigo.etiqueta = null; }
    this.tweens.add({ targets: enemigo, alpha: 0, angle: 40, y: enemigo.y - 30, duration: 260, onComplete: () => enemigo.destroy() });
  }

  recibirGolpe() {
    if (this.estado !== 'jugando' || this.reloj < this.invulnerableHasta) return;
    this.cameras.main.shake(150, 0.006);

    if (this.aliados.length > 0) {
      // Un aliado absorbe el golpe y se retira a un punto seguro.
      this.invulnerableHasta = this.reloj + CONFIG.INVULN_ALIADO_MS;
      const aliado = this.aliados.pop();
      this.tweens.add({ targets: aliado, x: -60, alpha: 0, duration: 700, onComplete: () => aliado.destroy() });
      this.mostrarAviso('¡Un aliado te protegió!', '#9be29b');
    } else {
      this.invulnerableHasta = this.reloj + CONFIG.INVULN_MS;
      this.vidas -= 1;
      if (this.vidas <= 0) {
        this.terminarDerrota();
        return;
      }
    }
    this.tweens.add({
      targets: this.jugador, alpha: 0.3, duration: 100, yoyo: true, repeat: 6, onComplete: () => this.jugador.setAlpha(1)
    });
  }

  congelarObjetos() {
    [this.peligros, this.items, this.civiles].forEach(grupo => {
      grupo.getChildren().forEach(o => o.body.setVelocity(0, 0));
    });
  }

  terminarDerrota() {
    this.estado = 'derrota';
    this.tiempoFin = this.time.now;
    const metros = Math.floor(this.distancia / CONFIG.PIXELES_POR_METRO);
    const esRecord = Record.actualizar(metros);
    this.congelarObjetos();
    this.tweens.killAll();
    this.jugador.setAlpha(1).setTint(0xff7777).setAngle(0).setVelocityY(-350);
    this.textoMejor.setText(`Récord: ${Record.valor} m`);

    const reintento = this.checkpointAlcanzado ? 'REINTENTAR DESDE EL PUNTO DE CONTROL (ESPACIO)' : 'REINTENTAR (ESPACIO)';
    const botones = [{ texto: reintento, accion: () => this.reiniciar(this.checkpointAlcanzado ? CONFIG.CHECKPOINT_M : 0) }];
    if (this.checkpointAlcanzado) botones.push({ texto: 'DESDE EL INICIO (N)', accion: () => this.reiniciar(0) });
    botones.push({ texto: 'MENÚ (M)', accion: () => this.volverAlMenu() });

    this.mostrarPanel('¡LOS COLOSOS TE ALCANZARON!',
      `Distancia: ${metros} m    Civiles rescatados: ${this.rescatados}${esRecord ? '\n¡Nuevo récord!' : ''}`, botones);
  }

  completarNivel() {
    if (this.estado !== 'jugando') return;
    this.estado = 'victoria';
    this.tiempoFin = this.time.now;
    Progreso.agregar(this.idNivel);
    const metros = Math.floor(this.distancia / CONFIG.PIXELES_POR_METRO);
    Record.actualizar(metros);
    this.congelarObjetos();
    this.barra.scaleX = 1;
    this.actualizarHUD();

    Progreso.anotarRescates(this.idNivel, this.rescatados);
    const hayMas = NIVELES.some(n => n.id === this.idNivel + 1 && n.jugable);
    const comps = Progreso.componentes.filter(i => i <= 3).length;
    let titulo = `¡COMPONENTE ${this.idNivel} RECUPERADO!`;
    let cuerpo = `Distancia: ${metros} m    Civiles rescatados: ${this.rescatados}\nComponentes: ${comps}/3`;
    if (!hayMas) {
      titulo = '¡LA RED VUELVE A CANTAR!';
      const total = Progreso.rescatados;
      let final;
      if (comps < 3) final = 'Faltan componentes: la señal llega, pero solo a medias.\nVuelve a las regiones pendientes para completar la red.';
      else if (total >= 8) final = 'Las tres regiones se hablan de nuevo y los refugiados regresan a casa.\nTu comunidad ya no está sola.';
      else if (total >= 4) final = 'La red funciona y la ayuda empieza a llegar.\nQuedaron familias por encontrar: aún hay trabajo por hacer.';
      else final = 'La red funciona, pero llegaste casi sin aliados.\nLa próxima vez rescata a más civiles.';
      cuerpo = `Civiles rescatados en total: ${total}    Componentes: ${comps}/3\n${final}`;
    }
    this.mostrarPanel(titulo, cuerpo, [
      ...(hayMas ? [{ texto: 'SIGUIENTE NIVEL (ESPACIO)', accion: () => this.siguienteNivel() }] : []),
      { texto: 'MENÚ (M)', accion: () => this.volverAlMenu() }
    ]);
  }

  // ---------- Jefes (datos en NIVELES[].jefe) ----------

  iniciarJefe() {
    const { ANCHO, SUELO_Y } = CONFIG;
    const datos = this.nivel.jefe;
    this.modoJefe = true;
    const j = this.add.image(ANCHO + 140, SUELO_Y + 6, datos.sprite).setOrigin(0.5, 1).setDepth(1)
      .setDisplaySize(SPRITES[datos.sprite].w, SPRITES[datos.sprite].h);
    j.datos = datos;
    j.vida = datos.vida;
    j.vulnerable = false;
    j.fase = 'ataque';
    j.lanzadas = 0;
    j.siguiente = this.reloj + 2800;
    j.avisando = false;
    j.ataque = datos.ataques[0];
    j.pendientes = [];
    this.jefe = j;
    this.tweens.add({ targets: j, x: 640, duration: 900, ease: 'Sine.easeOut' });

    this.jefeNombre = this.add.text(ANCHO / 2, 78, datos.nombre, { ...ESTILO_TEXTO, fontSize: '13px', strokeThickness: 3 }).setOrigin(0.5).setDepth(10);
    this.jefeFondo = this.add.rectangle(ANCHO / 2, 96, 300, 12, 0x000000, 0.55).setDepth(10);
    this.jefeBarra = this.add.rectangle(ANCHO / 2 - 150, 96, 300, 12, 0xB3392F).setOrigin(0, 0.5).setDepth(11);
    this.mostrarAviso(`¡${datos.nombre[0]}${datos.nombre.slice(1).toLowerCase()}!`, '#ff9a8f');
  }

  faseDos(j) {
    return j.vida <= Math.ceil(j.datos.vida * 0.4);
  }

  actualizarJefe() {
    const j = this.jefe;
    if (j.fase === 'muerto') return;

    // Ataques pendientes (fase 2: dos ataques seguidos).
    j.pendientes = j.pendientes.filter(p => {
      if (this.reloj >= p.t) { this.lanzarAtaque(p.ataque); return false; }
      return true;
    });

    if (j.fase === 'ataque') {
      if (!j.avisando && this.reloj >= j.siguiente - CONFIG.JEFE_AVISO_MS) {
        j.avisando = true;
        j.ataque = Phaser.Math.RND.pick(j.datos.ataques);
        j.setTint(0xff5555);
      }
      if (this.reloj >= j.siguiente) {
        this.lanzarAtaque(j.ataque);
        if (this.faseDos(j)) {
          const otros = j.datos.ataques.filter(a => a !== j.ataque);
          j.pendientes.push({ t: this.reloj + 800, ataque: Phaser.Math.RND.pick(otros) });
        }
        j.lanzadas += 1;
        j.avisando = false;
        j.clearTint();
        if (j.lanzadas >= 3) {
          j.fase = 'espera';
          j.finEspera = this.reloj + (this.faseDos(j) ? 2800 : 1800);
        } else {
          j.siguiente = this.reloj + j.datos.intervalo;
        }
      }
    } else if (j.fase === 'espera') {
      if (this.reloj >= j.finEspera) this.aturdirJefe();
    } else if (j.fase === 'aturdido') {
      if (this.reloj >= j.finAturdido) this.recuperarJefe();
    }
  }

  lanzarAtaque(ataque) {
    const { SUELO_Y } = CONFIG;
    const x = this.jefe.x - 40;
    let o;
    switch (ataque) {
      case 'cajaBaja': o = this.crearEnPiso(this.peligros, x, 'caja', 40, 40, SUELO_Y + 2, 4); o.extraVel = 230; break;
      case 'cajaAlta': o = this.crearEnPiso(this.peligros, x, 'caja', 40, 40, SUELO_Y - 38, 4); o.extraVel = 230; break;
      case 'rocaBaja': o = this.crearEnPiso(this.peligros, x, 'roca', 54, 40); o.extraVel = 230; break;
      case 'rocaAlta': o = this.crearEnPiso(this.peligros, x, 'roca', 54, 40, SUELO_Y - 38, 4); o.extraVel = 230; break;
      case 'troncoBajo': o = this.crearEnPiso(this.peligros, x, 'tronco', 62, 36); o.extraVel = 230; break;
      case 'barrido': o = this.crearEnPiso(this.peligros, x, 'colgante', 100, 38, 491, 6); o.extraVel = 200; break;
      case 'hueco': this.generar('hueco', CONFIG.ANCHO + 80); return;
      default: return;
    }
    o.tipo = ataque;
  }

  aturdirJefe() {
    const j = this.jefe;
    j.fase = 'aturdido';
    j.vulnerable = true;
    j.finAturdido = this.reloj + CONFIG.JEFE_ATURDIDO_MS;
    j.setTint(0x8899ff);
    this.tweens.add({ targets: j, x: 300, duration: 450, ease: 'Sine.easeInOut' });
    this.mostrarAviso('¡Está aturdido! ¡Ataca (X)!', '#ffe07a');
  }

  recuperarJefe() {
    const j = this.jefe;
    j.fase = 'ataque';
    j.vulnerable = false;
    j.clearTint();
    j.lanzadas = 0;
    j.siguiente = this.reloj + 2200;
    j.avisando = false;
    this.tweens.add({ targets: j, x: 640, duration: 600, ease: 'Sine.easeInOut' });
  }

  golpearJefe() {
    const j = this.jefe;
    j.vida -= 1;
    this.jefeBarra.scaleX = Math.max(0, j.vida / j.datos.vida);
    this.cameras.main.shake(120, 0.008);
    j.setTint(0xffffff);
    this.time.delayedCall(90, () => { if (j.active && j.fase === 'aturdido') j.setTint(0x8899ff); });
    if (j.vida <= 0) this.derrotarJefe();
  }

  derrotarJefe() {
    const j = this.jefe;
    j.fase = 'muerto';
    j.vulnerable = false;
    this.tweens.add({ targets: j, alpha: 0, y: j.y + 25, duration: 900, onComplete: () => j.destroy() });
    this.jefeBarra.scaleX = 0;
    this.mostrarAviso('¡Coloso vencido! Toma el componente', '#ffe07a');
    this.crearComponente(CONFIG.ANCHO - 40);
  }
}
