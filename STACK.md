# 🧰 Stack técnico — Predicación Pública Andes

Mismo enfoque que **Cocina SAET**, adaptado a una app React:
**web instalable, en tiempo real, sin servidor propio y gratis.**

```
   📱 Celular/PC                 ☁️ Nube (Google)          🤖 GitHub
 ┌──────────────┐   lee/escribe ┌──────────────────┐    ┌──────────────────────┐
 │  App React   │ ◀───────────▶ │ Firebase Realtime│    │ GitHub Pages (hosting)│
 │ (Vite build) │   en vivo     │    Database      │    │ GitHub Actions (build)│
 └──────────────┘               └──────────────────┘    └──────────────────────┘
        └── respaldo local (localStorage) ─┘   push a main → build → deploy solo
```

## Componentes

| Pieza | Proveedor | Para qué | Costo |
|---|---|---|---|
| **Hosting** | GitHub Pages (build por Actions) | URL pública `jp-relmotor.github.io/predicacion-publica-andes/` | Gratis |
| **Código** | GitHub — `JP-RELMOTOR/predicacion-publica-andes` | Guardar código y versiones | Gratis |
| **App** | React + Vite + TypeScript + Tailwind v4 | Pantallas, lógica, estilos | Gratis |
| **Base de datos** | Firebase Realtime Database (plan Spark) | Datos compartidos en tiempo real | Gratis |
| **Build/Deploy** | GitHub Actions (`.github/workflows/deploy.yml`) | Compila y publica en cada push | Gratis |
| **Auto-deploy** | Hook PostToolUse en `.claude/settings.json` | `git push` automático en cada cambio | — |

## Diferencia con SAET
SAET es un `index.html` estático (se sirve tal cual). Esta app es React/Vite y
**necesita compilar** (`npm run build` → `dist/`), por eso el deploy va por
**GitHub Actions** en vez de servir la rama directo. El `base: './'` de Vite hace
que funcione bajo el subdirectorio del repo.

## Base de datos (cómo la usa)
- Config en `src/firebaseConfig.ts` (la apiKey NO es secreta; la seguridad real
  son las reglas en `database.rules.json`).
- `src/firebase.ts` inicializa solo si está configurada; si no, la app usa solo
  localStorage (modo local, por dispositivo).
- `src/store.ts`: escucha `predicacion` con `onValue` (tiempo real) y escribe en
  rutas concretas para no pisar lo de otros:
  - `predicacion/hermanos/<id>`, `predicacion/puntos/<id>`, `predicacion/meses/<id>`
  - `predicacion/disponibilidad/<mes>/<hermano>` (cada uno escribe lo suyo)
  - `predicacion/asignaciones/<mes>/<slot>` (lo arma el admin)
  - `predicacion/config/mesActivoId`
- **Offline-first:** localStorage (rápido/local) + Firebase (compartido).
- **Semilla:** si la nube está vacía, la app carga hermanos/puntos/mes inicial.

## Seguridad
- Reglas cerradas por defecto; solo el árbol `predicacion` es accesible, con
  estructura validada y `$otro: validate false` para bloquear claves basura.
- **Sin login** (acceso anónimo): cualquiera con el enlace puede escribir datos
  *válidos*. Aceptable para datos no críticos. Para algo privado: cerrar reglas
  + Firebase Auth.

## Replicar / mantener
1. Crear repo + habilitar Pages (build_type=workflow).
2. `npm run build` lo hace Actions en cada push.
3. Pegar `firebaseConfig` real en `src/firebaseConfig.ts` y publicar reglas.
4. Hook PostToolUse para `git push` automático.
