# Protocolo Multi-Agente: Campuslands DevType

Este repositorio forma parte de los proyectos de formación y desarrollo de **Campuslands**, colaborando en conjunto con Antigravity, Codex y Claude Code utilizando el baúl compartido de Obsidian (`/Users/macbookpro/Documents/Obsidian Vault`).

## Arquitectura y Stack
- **Framework:** React 18 + TypeScript + Vite
- **Estilos:** Tailwind CSS con tokens oficiales de Campuslands
- **Audio:** Web Audio API nativo (`src/audio/soundEngine.ts`)
- **Hosting:** GitHub Pages con workflow en `.github/workflows/deploy.yml`

## Directivas de Desarrollo
1. Toda modificación debe verificar `npm run build` para garantizar cero errores de TypeScript y bundle limpio.
2. Mantener `base: './'` en `vite.config.ts` para que los assets funcionen en cualquier subruta de GitHub Pages.
3. El motor de audio no debe requerir archivos MP3 externos; siempre usar síntesis Web Audio para evitar 404s en red.
4. Respetar la paleta de colores de Campuslands definida en `tailwind.config.js`.
