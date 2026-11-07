// Punto de entrada: configura Phaser y registra las escenas.
new Phaser.Game({
  type: Phaser.AUTO,
  width: CONFIG.ANCHO,
  height: CONFIG.ALTO,
  backgroundColor: '#7ed6f7',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: CONFIG.GRAVEDAD },
      debug: false
    }
  },
  scene: [BootScene, MenuScene, JuegoScene]
});
