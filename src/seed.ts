import type { Punto } from './types'

// ---- Puntos / exhibidores ----
// NOTA: los hermanos NO se siembran desde el código (privacidad: el repo es
// público). La lista de hermanos vive únicamente en Firebase; los admins la
// gestionan desde Admin → Hermanos.
export const PUNTOS_SEMILLA: Punto[] = [
  {
    id: 'p_correa',
    nombre: 'Carrito Tadeo Vargas 892',
    tipo: 'carrito',
    familia: 'Familia Correa',
    lugarRetiro: 'Tadeo Vargas 892',
    lugarAsignacion: 'San Pablo / Radal',
    operaSemana: true,
    operaSabado: true,
    activo: true,
  },
  {
    id: 'p_oyarce',
    nombre: 'Carrito Alejandro Fierro 4464',
    tipo: 'carrito',
    familia: 'Familia Oyarce',
    lugarRetiro: 'Alejandro Fierro 4464',
    lugarAsignacion: 'Plaza Simón Bolívar',
    operaSemana: true,
    operaSabado: true,
    activo: true,
  },
  {
    id: 'p_mansilla',
    nombre: 'Pendón Radal',
    tipo: 'pendon',
    familia: 'Familia Mansilla',
    lugarRetiro: 'Radal 1225',
    lugarAsignacion: 'Acceso Edificios RADAL 1225',
    operaSemana: false,
    operaSabado: true,
    activo: true,
  },
]
