// Datos de cada nivel. Los eventos son [metro, tipo]: el objeto aparece en ese metro del recorrido.
// El arte de cada nivel está en assets/fondos/ (cielo_N, nubes_N, lejos_N, cerca_N, suelo_N).
const NIVELES = [
  {
    id: 1, nombre: 'Atacames', region: 'Costa', jugable: true,
    mision: 'Recupera el primer componente',
    velIni: 320, velFin: 450,
    jefe: { nombre: 'COLOSO ESTIBADOR', sprite: 'estibador', vida: 5, inicio: 575, intervalo: 3000, ataques: ['cajaBaja', 'cajaAlta'] },
    color: 0x2FA7A0,
    eventos: [
      [40, 'muro'], [70, 'errante'], [100, 'colgante'], [130, 'civil'], [150, 'arco'],
      [180, 'muro'], [186, 'errante'], [220, 'civilAlto'], [250, 'errante'], [256, 'colgante'],
      [285, 'viveres'], [310, 'errante'], [316, 'errante'], [345, 'civil'], [370, 'pinchos'],
      [376, 'arco'], [410, 'muro'], [416, 'muro'], [440, 'errante'], [446, 'colgante'],
      [480, 'pinchos'], [486, 'errante'], [520, 'civilAlto'], [540, 'viveres']
    ]
  },
  {
    id: 2, nombre: 'Ambato', region: 'Sierra', jugable: true,
    mision: 'Cruza el Laberinto de los Tres Juanes',
    velIni: 380, velFin: 520,
    color: 0x5f8a58,
    eventos: [
      [35, 'colgante'], [65, 'muro'], [71, 'arco'], [100, 'trepador'], [130, 'colgante'],
      [136, 'muro'], [165, 'civilAlto'], [195, 'errante'], [201, 'muro'], [230, 'trepador'],
      [236, 'errante'], [265, 'pinchos'], [271, 'colgante'], [300, 'civil'], [325, 'trepador'],
      [331, 'trepador'], [360, 'colgante'], [366, 'errante'], [395, 'muro'], [401, 'muro'],
      [430, 'pinchos'], [436, 'trepador'], [465, 'civilAlto'], [495, 'errante'], [501, 'colgante'],
      [530, 'viveres'], [560, 'componente']
    ]
  },
  {
    id: 3, nombre: 'Pailón del Diablo', region: 'Sierra (Baños)', jugable: true,
    mision: 'Cruza la garganta de Baños',
    velIni: 400, velFin: 540, texMuro: 'roca',
    jefe: { nombre: 'COLOSO CAÑÓN', sprite: 'canon', vida: 6, inicio: 575, intervalo: 2800, ataques: ['rocaBaja', 'hueco'] },
    color: 0x3E7D3C,
    eventos: [
      [40, 'hueco'], [75, 'errante'], [105, 'colgante'], [135, 'civil'], [155, 'arco'],
      [185, 'muro'], [191, 'hueco'], [225, 'civilAlto'], [255, 'errante'], [261, 'colgante'],
      [290, 'viveres'], [315, 'hueco'], [321, 'errante'], [350, 'civil'], [375, 'pinchos'],
      [381, 'arco'], [415, 'muro'], [421, 'hueco'], [450, 'trepador'], [456, 'errante'],
      [485, 'colgante'], [491, 'hueco'], [520, 'civilAlto'], [545, 'viveres']
    ]
  },
  {
    id: 4, nombre: 'Misahuallí', region: 'Amazonía', jugable: true,
    mision: 'Reactiva la red en la selva',
    velIni: 420, velFin: 560, texMuro: 'tronco',
    jefe: { nombre: 'COLOSO APU', sprite: 'apu', vida: 7, inicio: 575, intervalo: 2600, ataques: ['troncoBajo', 'rocaAlta', 'hueco', 'barrido'] },
    color: 0x2f6a35,
    eventos: [
      [40, 'hueco'], [70, 'trepador'], [100, 'errante'], [106, 'colgante'], [135, 'civil'],
      [160, 'arco'], [190, 'muro'], [196, 'muro'], [225, 'hueco'], [231, 'errante'],
      [260, 'civilAlto'], [290, 'trepador'], [296, 'colgante'], [325, 'viveres'], [350, 'hueco'],
      [356, 'trepador'], [385, 'pinchos'], [391, 'errante'], [420, 'civil'], [445, 'colgante'],
      [451, 'hueco'], [480, 'trepador'], [486, 'errante'], [515, 'civilAlto'], [540, 'viveres']
    ]
  }
];
