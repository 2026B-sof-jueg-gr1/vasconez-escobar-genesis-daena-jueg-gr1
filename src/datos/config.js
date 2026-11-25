// Constantes y datos compartidos por todas las escenas.
const CONFIG = {
  ANCHO: 800,
  ALTO: 600,
  SUELO_Y: 520,
  GRAVEDAD: 1800,
  VEL_SALTO_1: 720,
  VEL_SALTO_2: 620,
  JUGADOR_X: 170,
  PIXELES_POR_METRO: 60,
  CLAVE_RECORD: 'tres_regiones_mejor',

  VIDAS: 3,
  INVULN_MS: 1500,          // invulnerabilidad tras un golpe
  INVULN_ALIADO_MS: 1000,   // invulnerabilidad cuando un aliado absorbe el golpe
  DESLIZ_MS: 600,
  DESLIZ_ESPERA_MS: 300,
  ATAQUE_ESPERA_MS: 350,
  ATAQUE_ALCANCE: 150,
  MAX_ALIADOS: 2,
  VEL_ENEMIGO_EXTRA: 120,   // los Colosos caminan hacia el jugador
  CHECKPOINT_M: 300,
  LARGO_NIVEL_M: 600,

  JEFE_AVISO_MS: 800,       // destello rojo antes de atacar
  JEFE_ATURDIDO_MS: 3000
};

const ESTILO_TEXTO = {
  fontFamily: 'Arial',
  fontSize: '24px',
  color: '#ffffff',
  stroke: '#1b1c20',
  strokeThickness: 5
};
