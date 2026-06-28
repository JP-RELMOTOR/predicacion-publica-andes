import type { Hermano, Punto } from './types'

// ---- Puntos / exhibidores ----
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

// ---- Hermanos (precargados desde las capturas + el programa de junio) ----
// El primer nombre se usa como id (slug). Los admin: Bastián Zelada, Pablo Vargas, Juan Pablo Correa.
const NOMBRES_ADMIN = ['Bastián Zelada', 'Pablo Vargas', 'Juan Pablo Correa']

const NOMBRES: string[] = [
  'Alejandra Marchant',
  'Alfredo Guzmán',
  'Anita Lizana',
  'Anita Oyarce',
  'Bastián Villagrán',
  'Bastián Zelada',
  'Constanza Fridman',
  'Cony Fridman',
  'David Durán',
  'Dyancarlos Pedra',
  'Eduardo Villota',
  'Elianny Medina',
  'Esperanza (mamá Vane y Felipe)',
  'Evelyn Latín',
  'F. Gabriel Medina',
  'Giovani Durán',
  'Jessica de Vargas',
  'Juan Pablo Correa',
  'Juan Sepúlveda',
  'Julio Durán',
  'Julio Lizana',
  'Lizelot Mancilla',
  'Lorena Durán',
  'María Cecilia Rebuffo',
  'Melissa Gómez',
  'Michelle Villota',
  'Mijal de Correa',
  'Nelson Padilla',
  'Nicole Latín',
  'Oswlanger Guzmán',
  'Pablo Mancilla',
  'Pablo Vargas',
  'Patricia Sandoval',
  'Saúl Fridman',
  'Steysi Andes',
  'Tibisay Padilla',
  'Viviana (esposa de Claudio)',
  'Zamira (hija Arrias)',
]

function slug(nombre: string): string {
  return (
    'h_' +
    nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
  )
}

export const HERMANOS_SEMILLA: Hermano[] = NOMBRES.map((nombre) => ({
  id: slug(nombre),
  nombre,
  esAdmin: NOMBRES_ADMIN.includes(nombre),
  activo: true,
}))
