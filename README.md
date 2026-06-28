# Predicación Pública · Andes

App web (celular) para organizar la predicación pública con **carritos y exhibidores**
de la Congregación Andes. Los hermanos marcan su disponibilidad y el encargado arma el
programa mensual y lo exporta en PDF.

## Cómo usarla en tu computador

```bash
npm install      # solo la primera vez
npm run dev      # inicia la app en http://localhost:5173
```

Abre la dirección que aparece (`Local` o `Network` para verla desde el celular en la
misma red Wi-Fi).

## Qué hace

**Para los hermanos**
- Entran eligiendo su nombre (sin contraseña).
- Marcan su **semana habitual** (lun–vie, turnos 08:00 / 10:00) — se llena una vez y vale todo el mes.
- Marcan su **punto preferido**.
- Marcan los **sábados exactos** que pueden (turno único 08:00–10:00).
- Ven el **programa** publicado y sus asignaciones.

**Para el encargado (admin)**
- Abre/cierra la recepción de disponibilidad del mes.
- Ve quién respondió y su disponibilidad.
- **Arma las parejas** por turno (aparecen primero los disponibles; ⭐ = prefieren ese punto).
- Publica el programa y lo **exporta en PDF** (botón “Guardar PDF” → imprimir → Guardar como PDF).
- Gestiona hermanos y puntos.

Admins precargados: **Bastián Zelada**, **Pablo Vargas**, **Juan Pablo Correa**.

## En línea

- **App publicada:** https://jp-relmotor.github.io/predicacion-publica-andes/
- **Repo:** https://github.com/JP-RELMOTOR/predicacion-publica-andes
- Cada `git push` a `main` la vuelve a publicar sola (GitHub Actions).

## Paso pendiente: conectar la base de datos compartida (gratis)

⚠️ Hasta conectar Firebase, la app **guarda los datos en cada dispositivo** (modo local).
Para que **todos compartan los mismos datos en tiempo real**, falta pegar la config de
Firebase (5 min, gratis). Pasos completos en [`src/firebaseConfig.ts`](src/firebaseConfig.ts):

1. Crear proyecto en https://console.firebase.google.com → activar **Realtime Database**.
2. Copiar el `firebaseConfig` (ícono web `</>`) y pegarlo en `src/firebaseConfig.ts`.
3. Publicar las reglas de [`database.rules.json`](database.rules.json) en la consola.
4. `git push` (o el auto-deploy) y listo: datos compartidos.

## Estructura del código

```
src/
  types.ts            Modelo de datos
  seed.ts             Hermanos y puntos precargados
  store.ts            Datos + sesión (capa lista para base de datos)
  lib/dates.ts        Fechas en español, semanas, sábados
  lib/programa.ts     Filas del programa y candidatos por turno
  components/ProgramaTabla.tsx
  screens/            Login, Disponibilidad, VerPrograma, Imprimir
  screens/admin/      Admin, Armar, Disponibilidades, Hermanos, Puntos
```
