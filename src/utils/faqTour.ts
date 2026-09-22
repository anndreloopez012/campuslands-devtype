import { driver, DriveStep } from 'driver.js';
import 'driver.js/dist/driver.css';

export const startFaqTour = () => {
  const steps: DriveStep[] = [
    {
      element: '#tour-brand-logo',
      popover: {
        title: '🚀 ¿Qué es Campuslands DevType?',
        description:
          'Es la plataforma oficial de mecanografía de código para Campers de Campuslands. A diferencia de otras herramientas de typing tradicionales, aquí practicas sintaxis real de desarrollo de software (imports, clases, async/await, tipado estricto y consultas SQL) para acelerar tu velocidad de programación.',
        side: 'bottom',
        align: 'start'
      }
    },
    {
      element: '#tour-language-selector',
      popover: {
        title: '💻 ¿Cómo elijo el lenguaje de programación?',
        description:
          'Selecciona entre 10 tecnologías esenciales del stack de Campuslands: TypeScript, JavaScript, Python, Java, C#, PHP, Go, Rust, SQL y HTML/CSS. Cada fragmento contiene código limpio y patrones de producción.',
        side: 'bottom',
        align: 'start'
      }
    },
    {
      element: '#tour-level-selector',
      popover: {
        title: '📈 ¿Cómo funcionan los niveles Junior, Mid y Senior?',
        description:
          '• Junior: Variables, condicionales, bucles y lógica fundamental.\n• Mid: Funciones asíncronas, manipulación de colecciones y programación orientada a objetos.\n• Senior: Genéricos complejos, decoradores, pipelines concurrentes y optimización de bajo nivel.',
        side: 'bottom',
        align: 'end'
      }
    },
    {
      element: '#tour-game-modes',
      popover: {
        title: '🎮 ¿Cuáles son los Modos de Juego?',
        description:
          '• Speed Sprint: Mecanografía de código continua con métricas de WPM y precisión en vivo.\n• Bug Blaster: Detecta y corrige errores sintácticos contra el cronómetro.\n• Symbol Storm: Lluvia intensiva de caracteres especiales ({}, [], =>, &&, ||, ?) para ganar agilidad de dedos.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#tour-vscode-shortcuts',
      popover: {
        title: '⚡ ¿Para qué sirve el Modo Atajos de VS Code?',
        description:
          'Activa este interruptor para ingresar al "Shortcut Dojo". Aprenderás los atajos de teclado clave de Visual Studio Code para navegar, editar y refactorizar código sin tocar el mouse. Detecta automáticamente tu sistema operativo.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#tour-switch-profile',
      popover: {
        title: '⌨️ ¿Cómo configuro el sonido de switches mecánicos?',
        description:
          'Generado en tiempo real con Web Audio API: elige entre Cherry MX Blue (Clicky), Gateron Brown (Thock), Boba U4T Cream (Lubricado), 8-Bit Synth o siléncialo ajustando el control de volumen.',
        side: 'bottom',
        align: 'end'
      }
    },
    {
      element: '#tour-hud-dashboard',
      popover: {
        title: '⏱️ ¿Cómo se calculan mis métricas y WPM?',
        description:
          '• WPM: Palabras por minuto netas (5 caracteres = 1 palabra estándar).\n• CPM: Caracteres tipeados por minuto.\n• Precisión: Porcentaje de pulsaciones correctas.\n• Racha de Combo: Cada 10 caracteres consecutivos sin fallar incrementas tu racha.',
        side: 'bottom',
        align: 'center'
      }
    },
    {
      element: '#tour-code-editor',
      popover: {
        title: '⌨️ ¿Cómo tipear en el editor de código?',
        description:
          'Haz clic dentro de la consola y comienza a escribir. El caracter actual se ilumina en cyan brillante. Si te equivocas, la letra parpadeará en rojo para que la corrijas con Backspace o continúes.',
        side: 'top',
        align: 'center'
      }
    },
    {
      element: '#tour-virtual-keyboard',
      popover: {
        title: '🎹 ¿Cómo me ayuda el Teclado Virtual reactivo?',
        description:
          'El teclado en pantalla te guía visualmente destacando la siguiente tecla a presionar. Está pensado para ayudarte a no mirar el teclado físico y perfeccionar tu memoria muscular táctil.',
        side: 'top',
        align: 'center'
      }
    },
    {
      element: '#tour-camper-profile',
      popover: {
        title: '👤 ¿Cómo vinculo mi GitHub y descargo mi certificado?',
        description:
          'Haz clic en tu tarjeta de perfil para ingresar tu usuario de GitHub. El sistema obtendrá automáticamente tu avatar y campus, permitiéndote además descargar un Certificado Oficial PNG de tus récords.',
        side: 'bottom',
        align: 'end'
      }
    },
    {
      element: '#tour-leaderboard-btn',
      popover: {
        title: '🏆 ¿Cómo funciona la sincronización REAL de puntajes en Git?',
        description:
          '¡Tus récords se guardan de forma permanente en Git! Al terminar una partida pulsa "Sincronizar en Git Oficial". El sistema envía un Issue validado por GitHub Actions, que commitea tu score directamente en public/scores.json con insignia "VERIFICADO EN GIT".',
        side: 'bottom',
        align: 'end'
      }
    }
  ];

  const driverObj = driver({
    showProgress: true,
    animate: true,
    allowClose: true,
    overlayColor: 'rgba(3, 8, 22, 0.85)',
    stagePadding: 8,
    stageRadius: 16,
    popoverClass: 'campuslands-driver-popover',
    nextBtnText: 'Siguiente →',
    prevBtnText: '← Anterior',
    doneBtnText: '¡Listo para teclear! 🚀',
    progressText: '{{current}} de {{total}}',
    steps
  });

  driverObj.drive();
};
