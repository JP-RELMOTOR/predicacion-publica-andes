// ============================================================================
//  CONFIGURACIÓN DE FIREBASE  (base de datos compartida, gratis)
// ----------------------------------------------------------------------------
//  Cómo obtener estos valores (una sola vez):
//   1. Entra a https://console.firebase.google.com  con tu cuenta Google.
//   2. "Agregar proyecto" → nombre: predicacion-andes → crear.
//   3. Menú "Build" → "Realtime Database" → "Crear base de datos"
//      → ubicación EE. UU. → empezar en "modo bloqueado".
//   4. Engranaje ⚙ (arriba izq.) → "Configuración del proyecto" → baja a
//      "Tus apps" → ícono web </> → registra una app (sin Hosting).
//   5. Copia el objeto firebaseConfig y pégalo abajo, reemplazando los "PEGAR".
//
//  La apiKey NO es secreta (es normal en apps web de Firebase); la seguridad
//  real son las reglas de la base de datos (ver database.rules.json).
//
//  Mientras esté en "PEGAR…", la app funciona igual pero guarda los datos solo
//  en este dispositivo (modo local). Al pegar la config real, pasa a compartir
//  los datos entre todos en tiempo real.
// ============================================================================

export const FIREBASE_CONFIG = {
  apiKey: 'PEGAR_API_KEY',
  authDomain: 'PEGAR_AUTH_DOMAIN',
  databaseURL: 'PEGAR_DATABASE_URL',
  projectId: 'PEGAR_PROJECT_ID',
  storageBucket: 'PEGAR_STORAGE_BUCKET',
  messagingSenderId: 'PEGAR_SENDER_ID',
  appId: 'PEGAR_APP_ID',
}

// ¿Está configurada la nube? (si no, la app usa solo localStorage)
export function nubeConfigurada(): boolean {
  const u = FIREBASE_CONFIG.databaseURL
  return !!u && !u.startsWith('PEGAR')
}
