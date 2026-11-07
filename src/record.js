// Guarda y lee el mejor puntaje (si localStorage no está disponible, dura solo la sesión).
const Record = {
  valor: 0,

  cargar() {
    try {
      this.valor = parseInt(localStorage.getItem(CONFIG.CLAVE_RECORD) || '0', 10) || 0;
    } catch (e) {
      this.valor = 0;
    }
    return this.valor;
  },

  actualizar(metros) {
    if (metros <= this.valor) return false;
    this.valor = metros;
    try {
      localStorage.setItem(CONFIG.CLAVE_RECORD, String(metros));
    } catch (e) {
      // Sin almacenamiento: el récord solo dura la sesión.
    }
    return true;
  }
};
