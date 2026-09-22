import { ShortcutItem } from '../types';

export const VSCODE_SHORTCUTS: ShortcutItem[] = [
  {
    id: 'cmd-palette',
    name: 'Paleta de Comandos',
    description: 'Abre el menú principal de comandos y extensiones de VS Code.',
    macKeys: ['Meta', 'Shift', 'P'],
    winKeys: ['Control', 'Shift', 'P'],
    category: 'navigation',
    difficulty: 'easy'
  },
  {
    id: 'quick-open',
    name: 'Búsqueda Rápida de Archivos',
    description: 'Salta a cualquier archivo del proyecto escribiendo su nombre.',
    macKeys: ['Meta', 'P'],
    winKeys: ['Control', 'P'],
    category: 'navigation',
    difficulty: 'easy'
  },
  {
    id: 'multi-cursor',
    name: 'Multicursor / Siguiente Ocurrencia',
    description: 'Selecciona la siguiente aparición de la palabra actual para editar en simultáneo.',
    macKeys: ['Meta', 'D'],
    winKeys: ['Control', 'D'],
    category: 'selection',
    difficulty: 'easy'
  },
  {
    id: 'move-line',
    name: 'Mover Línea Arriba / Abajo',
    description: 'Desplaza la línea actual o bloque sin necesidad de cortar y pegar.',
    macKeys: ['Alt', 'ArrowDown'],
    winKeys: ['Alt', 'ArrowDown'],
    category: 'editing',
    difficulty: 'medium'
  },
  {
    id: 'duplicate-line',
    name: 'Duplicar Línea',
    description: 'Clona la línea de código actual hacia abajo al instante.',
    macKeys: ['Shift', 'Alt', 'ArrowDown'],
    winKeys: ['Shift', 'Alt', 'ArrowDown'],
    category: 'editing',
    difficulty: 'medium'
  },
  {
    id: 'toggle-comment',
    name: 'Comentar / Descomentar Línea',
    description: 'Añade o retira el comentario de la línea de código actual.',
    macKeys: ['Meta', '/'],
    winKeys: ['Control', '/'],
    category: 'editing',
    difficulty: 'easy'
  },
  {
    id: 'toggle-sidebar',
    name: 'Ocultar / Mostrar Barra Lateral',
    description: 'Maximiza el espacio de trabajo colapsando el explorador de archivos.',
    macKeys: ['Meta', 'B'],
    winKeys: ['Control', 'B'],
    category: 'navigation',
    difficulty: 'easy'
  },
  {
    id: 'toggle-terminal',
    name: 'Abrir / Ocultar Terminal Integrada',
    description: 'Accede a la consola de comandos sin salir del editor.',
    macKeys: ['Control', '`'],
    winKeys: ['Control', '`'],
    category: 'terminal',
    difficulty: 'medium'
  },
  {
    id: 'select-all-occurrences',
    name: 'Seleccionar Todas las Ocurrencias',
    description: 'Coloca cursores en todas las coincidencias del texto seleccionado.',
    macKeys: ['Meta', 'Shift', 'L'],
    winKeys: ['Control', 'Shift', 'L'],
    category: 'selection',
    difficulty: 'hard'
  },
  {
    id: 'find-in-files',
    name: 'Búsqueda Global en Proyecto',
    description: 'Busca referencias de texto o regex en todos los archivos del repositorio.',
    macKeys: ['Meta', 'Shift', 'F'],
    winKeys: ['Control', 'Shift', 'F'],
    category: 'navigation',
    difficulty: 'medium'
  },
  {
    id: 'trigger-intellisense',
    name: 'Forzar Sugerencias (IntelliSense)',
    description: 'Invoca manualmente el menú de autocompletado y documentación.',
    macKeys: ['Control', ' '],
    winKeys: ['Control', ' '],
    category: 'editing',
    difficulty: 'easy'
  },
  {
    id: 'word-wrap',
    name: 'Alternar Ajuste de Línea (Word Wrap)',
    description: 'Envuelve líneas largas para que no se desborden de la pantalla.',
    macKeys: ['Alt', 'Z'],
    winKeys: ['Alt', 'Z'],
    category: 'editing',
    difficulty: 'medium'
  }
];
