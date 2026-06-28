// Inicialización de Firebase (solo si está configurado).
import { initializeApp } from 'firebase/app'
import { getDatabase, type Database } from 'firebase/database'
import { FIREBASE_CONFIG, nubeConfigurada } from './firebaseConfig'

// Raíz de datos de esta app dentro de la base
export const RAIZ = 'predicacion'

let _db: Database | null = null

if (nubeConfigurada()) {
  try {
    const app = initializeApp(FIREBASE_CONFIG)
    _db = getDatabase(app)
  } catch (e) {
    console.error('No se pudo iniciar Firebase:', e)
    _db = null
  }
}

export const db = _db
export const hayNube = () => _db !== null
