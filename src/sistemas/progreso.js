// Componentes de comunicación recuperados durante la sesión.
const Progreso = {
  componentes: [],
  rescatados: 0, // civiles rescatados en toda la partida (define el final)
  porNivel: {},
  tiene(id) { return this.componentes.includes(id); },
  agregar(id) { if (!this.tiene(id)) this.componentes.push(id); },
  anotarRescates(nivel, n) { this.rescatados += n - (this.porNivel[nivel] || 0); this.porNivel[nivel] = n; },
  reiniciar() { this.componentes = []; this.rescatados = 0; this.porNivel = {}; }
};
