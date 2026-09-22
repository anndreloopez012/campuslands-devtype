# 🚀 Campuslands DevType

> Plataforma interactiva de mecanografía para desarrolladores por niveles, entrenamiento de atajos de VS Code, sintetizador de switches mecánicos, perfiles de GitHub y ranking competitivo para Campers de **Campuslands**.

[![Deploy to GitHub Pages](https://github.com/anndreloopez012/campuslands-devtype/actions/workflows/deploy.yml/badge.svg)](https://github.com/anndreloopez012/campuslands-devtype/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-2CAAFF?style=flat&logo=github)](https://anndreloopez012.github.io/campuslands-devtype/)
[![Campuslands](https://img.shields.io/badge/Campuslands-Space%20Academy-1B00BF?style=flat)](https://campuslands.com)

---

## 🌟 Características Destacadas

### 1. 💻 Mecanografía de Código Real por Niveles
A diferencia de los tests genéricos de palabras en inglés o español, **Campuslands DevType** entrena la memoria muscular sobre sintaxis y símbolos reales de programación:
- **10 Lenguajes Soportados:** JavaScript, TypeScript, Python, Java, C#, PHP, Go (Golang), Rust, SQL, HTML/CSS.
- **3 Niveles Progresivos (Campers Ranks):**
  - **🚀 Nivel 1 — Camper Padawan (Junior):** Variables, bucles, condicionales, funciones y lógica base.
  - **🛸 Nivel 2 — Camper Explorer (Mid):** Métodos funcionales, `async/await`, clases, contratos de tipos y regex.
  - **🌌 Nivel 3 — Astronaut Hacker (Senior):** Algoritmos avanzados, concurrencia (goroutines, promises, channels), patrones y generics.
- **Auto-indentación inteligente:** Al presionar `Enter`, el editor salta y añade los espacios de sangría automáticamente para una experiencia fluida sin frustración.

### 2. ⌨️ VS Code Shortcuts Dojo
- **Check interactivo:** Un switch en el encabezado permite activar el modo de atajos de teclado de VS Code.
- Detección nativa del sistema operativo (**macOS** con `⌘ Cmd` / `⌥ Option` o **Windows/Linux** con `Ctrl` / `Alt`).
- Retos prácticos: Paleta de comandos (`Cmd+Shift+P`), Multicursor (`Cmd+D`), Mover línea (`Alt+Down`), Duplicar línea (`Shift+Alt+Down`), Comentar (`Cmd+/`), Búsqueda global (`Cmd+Shift+F`) y más.

### 3. 👾 Minijuegos Arcade Adicionales
- **Syntax Bug Blaster:** Defiende el firewall de Campuslands escribiendo tokens y palabras clave antes de que impacten los escudos.
- **Bracket & Symbol Storm:** Entrenamiento de alta velocidad enfocado en caracteres críticos: `{ } [ ] ( ) ; : => === && || ! < > -> :: $`.

### 4. 🎧 Motor de Audio de Switches Mecánicos (Web Audio API)
Sintetizador acústico en tiempo real sin dependencias de red externas:
- **Cherry MX Blue:** Clic táctil y agudo.
- **Gateron Brown:** Sonido "thocky" profundo.
- **Boba U4T Cream:** Pop suave y lubricado.
- **8-Bit Arcade:** Beeps retro estilo chiptune.
- **Arpegios de Racha:** Sonidos armónicos que aumentan de tono a medida que acumulas combos (10x, 25x, 50x, 100x).

### 5. 🏆 Perfiles de GitHub y Ranking para GitHub Pages
- **Conexión de Camper:** Ingresa tu usuario de GitHub (`@usuario`) para obtener tu avatar real, nombre y repositorios.
- **Tabla de Clasificación Oficial:** Compite contra campers de Bucaramanga, Medellín, Cali, Bogotá y Guatemala.
- **Filtros Dinámicos:** Por lenguaje, nivel de dificultad y modo de juego.
- **Generador de Tarjeta de Certificación (PNG):** Descarga una tarjeta oficial de rendimiento para compartir en Discord, LinkedIn o Twitter.

---

## 🛠️ Instalación y Desarrollo Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/anndreloopez012/campuslands-devtype.git
cd campuslands-devtype

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Compilar para producción (GitHub Pages)
npm run build

# 5. Previsualizar compilación local
npm run preview
```

---

## 🚀 Despliegue en GitHub Pages

El repositorio cuenta con un workflow de GitHub Actions en [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

1. Sube los cambios a la rama `main`:
   ```bash
   git push origin main
   ```
2. En GitHub, ve a **Settings** > **Pages** de tu repositorio.
3. En **Build and deployment** > **Source**, selecciona **GitHub Actions**.
4. ¡El sitio se compilará y desplegará automáticamente en tu URL de GitHub Pages!

---

## 🛰️ Paleta Oficial de Campuslands

| Color | Hex | Uso |
|---|---|---|
| Petroleum | `#07102B` | Fondo espacial profundo |
| Darker | `#030816` | Fondo terminal |
| Deep Blue | `#1B00BF` | Botones de acción y gradientes |
| Cyan | `#2CAAFF` | Acento principal, cursor y combos |
| Sky | `#57BBFF` | Texto destacado y subtítulos |
| Aqua | `#00AA80` | Precisión alta y éxito |
| Amber | `#FFB800` | Racha de combo y fuego |
| Coral | `#FF4D6D` | Errores y alarmas del firewall |

---

Diseñado con ❤️ para la comunidad de **Campers de Campuslands**.
