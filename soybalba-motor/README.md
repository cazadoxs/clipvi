# Motor de Shorts SoyBalba

Animación 100 % por código (canvas 2D) + voz edge-tts + música y efectos sintetizados.

1. `python3 scripts.py` → genera `jobs.json` con los guiones.
2. En el PC: `python tts.py jobs.json out` (edge-tts, gratis, con tiempos por palabra) y copiar `out/` a `voz/`.
3. `python3 assemble.py` → une las frases, recorta silencios y crea `build/<vid>.json` (línea de tiempo).
4. `./make.sh <vid> bouncy|tender` → renderiza (Playwright + ffmpeg), mezcla audio y saca `out/<vid>.mp4`.

Escenas: `eng/scenes/f1*.js` (¿Qué pasaría si…?), `f2*.js` (Dato inútil), `f3*.js` (En este pueblo…).
Necesita `npm i @fontsource/lilita-one @fontsource/baloo-2` en `eng/`.
