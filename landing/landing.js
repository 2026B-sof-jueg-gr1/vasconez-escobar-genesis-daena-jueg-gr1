// Landing de "Tres Regiones: Tierra en Ruinas". Escenas de práctica con las mismas imágenes del juego.
(function () {
  'use strict';
  var A = 'juego/assets/';
  var SUELO = 370;       // línea del suelo dentro del lienzo de 800x450
  var AX = 150;          // posición horizontal de Aru
  var VEL0 = 330;
  var reducir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var TAM = {
    aru_correr1: [64, 100], aru_correr2: [64, 100], aru_salto: [64, 100], aru_desliz: [80, 56],
    errante: [62, 72], trepador: [64, 64], muro: [64, 56], roca: [64, 56], tronco: [72, 52],
    hueco: [140, 40], caja: [48, 48], colgante: [110, 130], tajo: [150, 100],
    estibador: [176, 190], canon: [190, 150], apu: [232, 220]
  };

  // Obstáculos: [ancho caja, alto caja, altura del borde inferior de la caja sobre el suelo]
  var OBS = {
    errante: { box: [32, 58, 0], mata: true, extra: 120 },
    trepador: { box: [34, 40, 0], mata: true, cae: true },
    muro: { box: [54, 40, 0] }, roca: { box: [54, 40, 0] }, tronco: { box: [62, 36, 0] },
    hueco: { box: [100, 16, -10], suelo: true },
    cajaBaja: { sprite: 'caja', box: [40, 40, 0], extra: 230 },
    cajaAlta: { sprite: 'caja', box: [40, 40, 42], extra: 230, alto: 42 },
    rocaBaja: { sprite: 'roca', box: [54, 40, 0], extra: 230 },
    rocaAlta: { sprite: 'roca', box: [54, 40, 42], extra: 230, alto: 42 },
    troncoBajo: { sprite: 'tronco', box: [62, 36, 0], extra: 230 },
    barrido: { sprite: 'colgante', box: [100, 38, 35], extra: 200, alto: 35 }
  };

  var REGIONES = {
    1: { nombre: 'Atacames', zona: 'Nivel 1 · Costa', fila: ['errante', 'muro', 'errante', 'muro'],
      texto: 'Playas y calles destruidas bajo un faro agrietado. Es el lugar ideal para aprender: saltar muros, deslizarte bajo estructuras y atacar al Coloso Errante.',
      puntos: ['Misión: recuperar el primer componente', 'Velocidad: 320 → 450 px/s'],
      jefe: { sprite: 'estibador', nombre: 'COLOSO ESTIBADOR', vida: 5, ataques: ['cajaBaja', 'cajaAlta'] } },
    2: { nombre: 'Ambato', zona: 'Nivel 2 · Sierra', fila: ['errante', 'trepador', 'muro', 'trepador'],
      texto: 'Entre volcanes y tejados rojos, el Laberinto de los Tres Juanes esconde el segundo componente. Aquí aparecen los Colosos Trepadores, que caen del cielo cuando te acercas.',
      puntos: ['Misión: cruzar el laberinto', 'Velocidad: 380 → 520 px/s'], jefe: null },
    3: { nombre: 'Pailón del Diablo', zona: 'Nivel 3 · Sierra (Baños)', fila: ['hueco', 'roca', 'errante', 'hueco'],
      texto: 'Una cascada gigante, puentes colgantes y niebla. El camino se rompe en huecos que exigen buen ritmo de saltos, y al final espera el Coloso Cañón.',
      puntos: ['Misión: recuperar el tercer componente', 'Velocidad: 400 → 540 px/s'],
      jefe: { sprite: 'canon', nombre: 'COLOSO CAÑÓN', vida: 6, ataques: ['rocaBaja', 'hueco'] } },
    4: { nombre: 'Misahuallí', zona: 'Nivel 4 · Amazonía', fila: ['tronco', 'hueco', 'trepador', 'errante'],
      texto: 'Selva densa, río y la antena de la estación. Es el último tramo: troncos, huecos y Trepadores te llevan hasta el Coloso Apu, guardián de la red.',
      puntos: ['Misión: reactivar la red', 'Velocidad: 420 → 560 px/s'],
      jefe: { sprite: 'apu', nombre: 'COLOSO APU', vida: 7, ataques: ['troncoBajo', 'rocaAlta', 'hueco', 'barrido'] } }
  };

  function crearImg(clave, w, h) {
    var i = document.createElement('img');
    i.src = A + 'sprites/' + clave + '.png';
    i.width = w; i.height = h; i.alt = '';
    i.draggable = false;
    return i;
  }
  function pon(el, x, y, w, h) { el.style.left = (x - w / 2) + 'px'; el.style.top = (y - h) + 'px'; }

  // ---------------------------------------------------------------- Escena
  function Escena(marco, opciones) {
    this.marco = marco;
    this.op = opciones || {};
    this.lienzo = document.createElement('div');
    this.lienzo.className = 'lienzo';
    marco.appendChild(this.lienzo);
    this.capasEl = document.createElement('div');
    this.entsEl = document.createElement('div');
    this.lienzo.appendChild(this.capasEl);
    this.lienzo.appendChild(this.entsEl);
    this.aru = crearImg('aru_correr1', 64, 100);
    this.aru.style.zIndex = 5;
    this.tajo = crearImg('tajo', 150, 100);
    this.tajo.style.cssText = 'position:absolute;z-index:6;opacity:0;transition:opacity .17s';
    this.lienzo.appendChild(this.aru);
    this.lienzo.appendChild(this.tajo);
    this.visible = false; this.raf = null; this.vencidos = 0; this.golpes = 0;
    var self = this;
    this.ajustar = function () { self.lienzo.style.transform = 'scale(' + (marco.clientWidth / 800) + ')'; };
    if (window.ResizeObserver) new ResizeObserver(this.ajustar).observe(marco);
    window.addEventListener('resize', this.ajustar);
    this.ajustar();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { self.fijarVisible(e[0].isIntersecting); }, { threshold: 0.1 }).observe(marco);
    } else { this.fijarVisible(true); }
    this.region(this.op.region || 1);
  }

  Escena.prototype.region = function (n) {
    this.n = n; this.datos = REGIONES[n];
    this.capasEl.innerHTML = ''; this.entsEl.innerHTML = '';
    this.ents = []; this.x = { c: 0, l: 0, n: 0, s: 0 }; this.modoJefe = false; this.jefe = null;
    var cap = function (parent, clave, top, h, tam, z) {
      var d = document.createElement('div'); d.className = 'capa';
      d.style.cssText = 'top:' + top + 'px;height:' + h + 'px;z-index:' + z + ';background-image:url(' + A + 'fondos/' + clave + '_' + n + '.png);background-size:' + tam;
      parent.appendChild(d); return d;
    };
    var cielo = cap(this.capasEl, 'cielo', 0, 450, '800px 600px', 0);
    cielo.style.backgroundRepeat = 'no-repeat';
    this.cNubes = cap(this.capasEl, 'nubes', 10, 200, '800px 200px', 1);
    this.cLejos = cap(this.capasEl, 'lejos', 70, 300, '800px 300px', 2);
    this.cCerca = cap(this.capasEl, 'cerca', 116, 260, '800px 260px', 3);
    this.cCerca.style.opacity = 0.9;
    this.cSuelo = cap(this.capasEl, 'suelo', SUELO, 80, '128px 80px', 4);
    this.reiniciarJugador();
    this.sig = 1.4; this.idx = 0; this.t = 0;
    this.quitarJefeUI();
    if (this.op.alRegion) this.op.alRegion(this);
  };

  Escena.prototype.reiniciarJugador = function () {
    this.py = 0; this.vy = 0; this.saltos = 2; this.deslizHasta = 0; this.ataqueLibre = 0; this.invul = 0;
  };

  Escena.prototype.fijarVisible = function (v) {
    this.visible = v;
    if (v && !this.raf) { this.ultimo = performance.now(); var s = this; this.raf = requestAnimationFrame(function (t) { s.cuadro(t); }); }
  };

  Escena.prototype.cuadro = function (ts) {
    if (!this.visible) { this.raf = null; return; }
    var dt = Math.max(0, Math.min(0.05, (ts - this.ultimo) / 1000)) || 0; this.ultimo = ts;
    if (!reducir) this.actualizar(dt); else this.actualizar(0);
    var s = this; this.raf = requestAnimationFrame(function (t) { s.cuadro(t); });
  };

  // ----- acciones del jugador
  Escena.prototype.saltar = function () {
    if (this.saltos <= 0) return;
    this.vy = this.saltos === 2 ? 720 : 620; this.saltos -= 1; this.deslizHasta = 0;
  };
  Escena.prototype.deslizar = function () {
    if (this.py > 0 || this.t < this.deslizHasta) return;
    this.deslizHasta = this.t + 0.6;
  };
  Escena.prototype.atacar = function () {
    if (this.t < this.ataqueLibre) return;
    this.ataqueLibre = this.t + 0.35;
    this.tajo.style.left = (AX + 70 - 75) + 'px';
    this.tajo.style.top = (SUELO - this.py - 100 + 20) + 'px';
    this.tajo.style.opacity = 1;
    var s = this; setTimeout(function () { s.tajo.style.opacity = 0; }, 170);
    var i, e;
    for (i = 0; i < this.ents.length; i++) {
      e = this.ents[i];
      if (e.muerto || !e.def.mata || e.colgando) continue;
      if (e.x > AX - 10 && e.x < AX + 160 + e.w / 2) this.vencer(e);
    }
    var j = this.jefe;
    if (j && j.fase === 'aturdido' && j.x - j.w / 2 < AX + 160) this.golpearJefe();
  };

  Escena.prototype.vencer = function (e) {
    e.muerto = true; e.el.style.transition = 'transform .3s, opacity .3s';
    e.el.style.opacity = 0; e.el.style.transform = 'rotate(40deg) translateY(-30px)';
    this.vencidos += 1; this.flot('¡Vencido!', e.x, e.y - e.h - 6);
    if (this.op.alCambio) this.op.alCambio(this);
  };

  Escena.prototype.flot = function (txt, x, y) {
    var f = document.createElement('div'); f.className = 'flot'; f.textContent = txt;
    f.style.left = x + 'px'; f.style.top = y + 'px'; f.style.zIndex = 9;
    this.lienzo.appendChild(f); setTimeout(function () { f.remove(); }, 1000);
  };

  // ----- entidades
  Escena.prototype.crear = function (tipo, x) {
    var def = OBS[tipo], clave = def.sprite || tipo, tam = TAM[clave];
    var el = crearImg(clave, tam[0], tam[1]); el.style.zIndex = 4;
    this.entsEl.appendChild(el);
    var base = SUELO + 2, alto = def.alto || 0;
    if (def.suelo) base = SUELO + 42;
    if (clave === 'caja' || clave === 'roca' && alto || clave === 'colgante') base = SUELO + 2 - alto;
    if (clave === 'colgante') base = SUELO - 29;
    var e = { tipo: tipo, def: def, el: el, x: x, y: base, w: tam[0], h: tam[1], muerto: false, colgando: false, vy: 0 };
    if (def.cae) { e.y = 180; e.colgando = true; }
    this.ents.push(e); return e;
  };

  Escena.prototype.golpe = function () {
    if (this.t < this.invul) return;
    this.invul = this.t + 1.2; this.golpes += 1;
    this.flot('¡Ouch!', AX, SUELO - this.py - 110);
    this.marco.classList.remove('sacudir'); void this.marco.offsetWidth; this.marco.classList.add('sacudir');
    if (this.op.alCambio) this.op.alCambio(this);
  };

  // ----- jefe
  Escena.prototype.iniciarJefe = function () {
    var d = this.datos.jefe; if (!d || this.modoJefe) return;
    this.modoJefe = true;
    this.ents.forEach(function (e) { e.el.remove(); }); this.ents = [];
    var tam = TAM[d.sprite], el = crearImg(d.sprite, tam[0], tam[1]); el.style.zIndex = 3;
    this.entsEl.appendChild(el);
    this.jefe = { el: el, w: tam[0], h: tam[1], x: 900, meta: 640, vida: d.vida, max: d.vida, fase: 'ataque', n: 0, prox: this.t + 2.2, avisa: false, ataque: d.ataques[0], hasta: 0 };
    this.interfazJefe(d.nombre);
  };
  Escena.prototype.interfazJefe = function (nombre) {
    this.quitarJefeUI();
    this.nom = document.createElement('div'); this.nom.className = 'nom-jefe'; this.nom.textContent = nombre;
    this.bar = document.createElement('div'); this.bar.className = 'barra-jefe'; this.bar.innerHTML = '<i></i>';
    this.lienzo.appendChild(this.nom); this.lienzo.appendChild(this.bar); this.bar.style.zIndex = this.nom.style.zIndex = 8;
  };
  Escena.prototype.quitarJefeUI = function () {
    if (this.nom) this.nom.remove(); if (this.bar) this.bar.remove(); this.nom = this.bar = null;
  };
  Escena.prototype.salirJefe = function () {
    if (!this.modoJefe) return;
    this.modoJefe = false;
    if (this.jefe) this.jefe.el.remove(); this.jefe = null; this.quitarJefeUI();
    this.ents.forEach(function (e) { e.el.remove(); }); this.ents = [];
    this.sig = 1.2;
  };
  Escena.prototype.golpearJefe = function () {
    var j = this.jefe; j.vida -= 1;
    this.bar.firstChild.style.width = Math.max(0, j.vida / j.max * 100) + '%';
    this.flot('¡Golpe!', j.x, SUELO - j.h);
    j.el.style.filter = 'brightness(2)'; setTimeout(function () { j.el.style.filter = j.fase === 'aturdido' ? 'hue-rotate(180deg)' : ''; }, 90);
    if (j.vida <= 0) {
      j.fase = 'muerto'; j.el.style.transition = 'opacity .9s'; j.el.style.opacity = 0;
      this.vencidos += 1; this.flot('¡Coloso vencido!', 400, 140);
      if (this.op.alCambio) this.op.alCambio(this);
      var s = this; setTimeout(function () { if (s.modoJefe) { s.salirJefe(); s.iniciarJefe(); } }, 2200);
    }
  };
  Escena.prototype.actualizarJefe = function (dt) {
    var j = this.jefe; if (!j) return;
    var d = this.datos.jefe;
    var objetivo = j.fase === 'aturdido' ? 330 : j.meta;
    j.x += (objetivo - j.x) * Math.min(1, dt * 3.5);
    j.el.style.left = (j.x - j.w / 2) + 'px'; j.el.style.top = (SUELO + 6 - j.h) + 'px';
    if (j.fase === 'ataque') {
      if (!j.avisa && this.t >= j.prox - 0.8) { j.avisa = true; j.ataque = d.ataques[Math.floor(Math.random() * d.ataques.length)]; j.el.style.filter = 'sepia(1) saturate(6) hue-rotate(-30deg)'; }
      if (this.t >= j.prox) {
        var e = this.crear(j.ataque, j.x - 40); e.jefeAtaque = true;
        j.avisa = false; j.el.style.filter = ''; j.n += 1;
        if (j.n >= 3) { j.fase = 'espera'; j.hasta = this.t + 1.8; } else { j.prox = this.t + 2.4; }
      }
    } else if (j.fase === 'espera') {
      if (this.t >= j.hasta) { j.fase = 'aturdido'; j.hasta = this.t + 3; j.el.style.filter = 'hue-rotate(180deg)'; this.flot('¡Aturdido! ¡Ataca!', 400, 120); }
    } else if (j.fase === 'aturdido') {
      if (this.t >= j.hasta) { j.fase = 'ataque'; j.n = 0; j.prox = this.t + 2.2; j.avisa = false; j.el.style.filter = ''; }
    }
  };

  // ----- bucle
  Escena.prototype.actualizar = function (dt) {
    this.t += dt;
    var vel = VEL0 + (this.modoJefe ? 40 : 0);
    this.x.c += vel * dt * 0.05; this.x.l += vel * dt * 0.15; this.x.n += vel * dt * 0.55; this.x.s += vel * dt;
    this.cNubes.style.backgroundPositionX = -this.x.c + 'px';
    this.cLejos.style.backgroundPositionX = -this.x.l + 'px';
    this.cCerca.style.backgroundPositionX = -this.x.n + 'px';
    this.cSuelo.style.backgroundPositionX = -this.x.s + 'px';

    // Aru
    var desliza = this.t < this.deslizHasta && this.py === 0;
    this.vy -= 1800 * dt; this.py += this.vy * dt;
    if (this.py <= 0) { this.py = 0; this.vy = 0; this.saltos = 2; }
    var clave = this.py > 0 ? 'aru_salto' : desliza ? 'aru_desliz' : (Math.floor(this.t / 0.11) % 2 ? 'aru_correr2' : 'aru_correr1');
    if (this.claveAru !== clave) { this.claveAru = clave; this.aru.src = A + 'sprites/' + clave + '.png'; this.aru.width = TAM[clave][0]; this.aru.height = TAM[clave][1]; }
    var tam = TAM[clave];
    pon(this.aru, AX, SUELO + 2 - this.py, tam[0], tam[1]);
    this.aru.style.opacity = this.t < this.invul && Math.floor(this.t * 14) % 2 ? 0.35 : 1;
    var alturaAru = desliza ? 26 : 68;

    // aparición
    if (!this.modoJefe) {
      this.sig -= dt;
      if (this.sig <= 0) {
        var tipo = this.datos.fila[this.idx % this.datos.fila.length]; this.idx++;
        this.crear(tipo, 900); this.sig = 1.7 + Math.random() * 0.9;
      }
    } else { this.actualizarJefe(dt); }

    // entidades
    for (var i = this.ents.length - 1; i >= 0; i--) {
      var e = this.ents[i];
      e.x -= (vel + (e.def.extra || 0)) * dt;
      if (e.colgando && e.x - AX < 250) { e.colgando = false; e.cayendo = true; }
      if (e.cayendo) { e.vy += 1800 * dt; e.y += e.vy * dt; if (e.y >= SUELO + 2) { e.y = SUELO + 2; e.cayendo = false; } }
      pon(e.el, e.x, e.y, e.w, e.h);
      if (!e.muerto && !e.golpeado) {
        var bw = e.def.box[0], bh = e.def.box[1], by = e.def.box[2];
        var solapaX = Math.abs(e.x - AX) < (bw + 28) / 2;
        var colY = e.colgando ? (SUELO + 2 - e.y) : by;
        var solapaY = this.py < colY + bh && this.py + alturaAru > colY;
        if (solapaX && solapaY && !(e.colgando)) { e.golpeado = true; this.golpe(); }
      }
      if (e.x < -160) { e.el.remove(); this.ents.splice(i, 1); }
    }
  };

  window.TresRegiones = { Escena: Escena, REGIONES: REGIONES };

  // ---------------------------------------------------------------- Página
  // Hero: decorativo, con Aru corriendo automáticamente (salta y desliza solo).
  var hero = new Escena(document.getElementById('escenaHero'), { region: 1 });
  (function piloto() {
    setInterval(function () {
      if (!hero.visible) return;
      var cerca = hero.ents.filter(function (e) { return !e.muerto && e.x > AX + 40 && e.x < AX + 330; })[0];
      if (!cerca) return;
      if (cerca.def.mata) { if (cerca.x < AX + 210) hero.atacar(); }
      else if (cerca.x < AX + 190 && hero.py === 0) hero.saltar();
    }, 60);
  })();

  // Práctica de controles.
  var cVencidos = document.getElementById('cVencidos'), cGolpes = document.getElementById('cGolpes'), msg = document.getElementById('msg');
  var practica = new Escena(document.getElementById('escenaJugar'), {
    region: 1,
    alCambio: function (e) { cVencidos.textContent = e.vencidos; cGolpes.textContent = e.golpes; }
  });
  practica.datos = { fila: ['errante', 'muro', 'errante', 'barrido', 'muro'], jefe: null };
  OBS.barrido.alto = 35;
  var ACC = { salto: function () { practica.saltar(); }, desliz: function () { practica.deslizar(); }, ataque: function () { practica.atacar(); } };
  function pulsar(a) {
    ACC[a]();
    var b = document.querySelector('.ctl[data-a="' + a + '"]');
    if (b) { b.classList.add('pulsada'); setTimeout(function () { b.classList.remove('pulsada'); }, 130); }
  }
  document.querySelectorAll('.ctl').forEach(function (b) { b.addEventListener('click', function () { pulsar(b.getAttribute('data-a')); }); });
  var MAPA = { ' ': 'salto', ArrowUp: 'salto', w: 'salto', W: 'salto', ArrowDown: 'desliz', s: 'desliz', S: 'desliz', x: 'ataque', X: 'ataque', z: 'ataque', Z: 'ataque', Shift: 'ataque' };
  document.addEventListener('keydown', function (ev) {
    if (!practica.visible || ev.repeat || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    var a = MAPA[ev.key]; if (!a) return;
    ev.preventDefault(); pulsar(a);
  });
  practica.marco.addEventListener('pointerdown', function (ev) { practica.marco.focus(); if (ev.button === 2) pulsar('ataque'); else pulsar('salto'); });
  practica.marco.addEventListener('contextmenu', function (ev) { ev.preventDefault(); });
  var mensajes = ['¡Prepárate!', 'Salta los muros', 'Ataca al Coloso (X)', 'Desliza bajo la liana (↓)'];
  setInterval(function () { if (practica.visible) msg.textContent = mensajes[Math.floor(practica.t / 5) % mensajes.length] || mensajes[0]; }, 700);

  // Explorador de regiones.
  var infoEl = document.getElementById('infoRegion');
  var explorador = new Escena(document.getElementById('escenaRegion'), { region: 1, alRegion: function (e) { pintarInfo(e); } });
  function pintarInfo(e) {
    var d = REGIONES[e.n];
    var html = '<small>' + d.zona + '</small><h3>' + d.nombre + '</h3><p>' + d.texto + '</p><ul>' +
      d.puntos.map(function (p) { return '<li>' + p + '</li>'; }).join('') + '</ul>';
    html += d.jefe
      ? '<span class="etq">Jefe: ' + d.jefe.nombre.toLowerCase().replace(/(^|\s)\S/g, function (m) { return m.toUpperCase(); }) + '</span><br><button class="btn btn-sol" id="btnJefe">⚔ Enfrentar al jefe</button>'
      : '<span class="etq">Sin jefe: aquí el reto es el laberinto</span>';
    infoEl.innerHTML = html;
    var b = document.getElementById('btnJefe');
    if (b) b.addEventListener('click', function () {
      if (explorador.modoJefe) { explorador.salirJefe(); b.textContent = '⚔ Enfrentar al jefe'; }
      else { explorador.iniciarJefe(); b.textContent = '↩ Volver al camino'; }
    });
  }
  document.querySelectorAll('#tabsRegion .tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('#tabsRegion .tab').forEach(function (o) { o.classList.remove('activa'); });
      t.classList.add('activa'); explorador.region(parseInt(t.getAttribute('data-r'), 10));
    });
  });
  // La escena de regiones se maneja sola: Aru salta/ataca con un piloto sencillo.
  setInterval(function () {
    if (!explorador.visible) return;
    var cerca = explorador.ents.filter(function (e) { return !e.muerto && e.x > AX + 40 && e.x < AX + 330 && !e.colgando; })[0];
    if (!cerca) return;
    if (cerca.def.mata) { if (cerca.x < AX + 190) explorador.atacar(); }
    else if (cerca.def.alto && cerca.def.sprite === 'colgante') { if (cerca.x < AX + 230) explorador.deslizar(); }
    else if (cerca.x < AX + 190 && explorador.py === 0) explorador.saltar();
    if (explorador.jefe && explorador.jefe.fase === 'aturdido') explorador.atacar();
  }, 60);

  // Finales.
  var FINALES = [
    'La red funciona, pero llegaste casi sin aliados. Las regiones se reconectan, aunque muchas familias siguen sin noticias. La próxima vez, rescata a más civiles.',
    'La red funciona y la ayuda empieza a llegar. Quedaron familias por encontrar: todavía hay trabajo por hacer, pero ya nadie está incomunicado.',
    'Las tres regiones se hablan de nuevo y los refugiados regresan a casa. La comunidad de Aru ya no está sola.',
    'La señal llega, pero solo a medias: faltan componentes. Hay que volver a las regiones pendientes para completar la red.'
  ];
  var tf = document.getElementById('textoFinal'); tf.textContent = FINALES[0];
  document.querySelectorAll('#fichasFinal .ficha').forEach(function (f) {
    f.addEventListener('click', function () {
      document.querySelectorAll('#fichasFinal .ficha').forEach(function (o) { o.classList.remove('activa'); });
      f.classList.add('activa'); tf.textContent = FINALES[parseInt(f.getAttribute('data-f'), 10)];
    });
  });

  // Cartas táctiles (en pantallas sin hover).
  document.querySelectorAll('.carta').forEach(function (c) {
    c.addEventListener('click', function () { c.classList.toggle('voltear'); });
    c.addEventListener('keydown', function (ev) { if (ev.key === 'Enter') c.classList.toggle('voltear'); });
  });

  // Capítulos: aparecen al desplazarse.
  var revelar = document.querySelectorAll('.revelar');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }); }, { threshold: 0.15 });
    revelar.forEach(function (r) { io.observe(r); });
  } else { revelar.forEach(function (r) { r.classList.add('visible'); }); }
})();
