import type { Punto } from './types'

// ---- Puntos de predicación ----
// El NOMBRE del punto es el lugar donde se predica; el retiro del exhibidor
// es la dirección/familia donde se busca el carrito o pendón.
// NOTA: los hermanos NO se siembran desde el código (privacidad: el repo es
// público). La lista de hermanos vive únicamente en Firebase; los admins la
// gestionan desde Admin → Hermanos.
export const PUNTOS_SEMILLA: Punto[] = [
  {
    id: 'p_correa',
    nombre: 'San Pablo / Radal',
    tipo: 'carrito',
    familia: 'Familia Correa',
    lugarRetiro: 'Tadeo Vargas 892',
    operaSemana: true,
    operaSabado: true,
    activo: true,
  },
  {
    id: 'p_oyarce',
    nombre: 'Plaza Simón Bolívar',
    tipo: 'carrito',
    familia: 'Familia Oyarce',
    lugarRetiro: 'Alejandro Fierro 4464',
    operaSemana: true,
    operaSabado: true,
    activo: true,
  },
  {
    id: 'p_mansilla',
    nombre: 'Acceso Edificios RADAL 1225',
    tipo: 'pendon',
    familia: 'Familia Mansilla',
    lugarRetiro: 'Radal 1225',
    operaSemana: false,
    operaSabado: true,
    activo: true,
  },
]
