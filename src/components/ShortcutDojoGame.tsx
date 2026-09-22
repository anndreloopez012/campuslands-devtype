import React, { useState, useEffect, useCallback } from 'react';
import { Keyboard, CheckCircle2, Trophy, RotateCcw, Sparkles, Flame } from 'lucide-react';
import { VSCODE_SHORTCUTS } from '../data/shortcutsData';
import { soundEngine } from '../audio/soundEngine';
import { ShortcutItem } from '../types';

interface ShortcutDojoGameProps {
  onFinishDojo?: (score: number) => void;
}

export const ShortcutDojoGame: React.FC<ShortcutDojoGameProps> = ({ onFinishDojo }) => {
  const [isMac, setIsMac] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const currentShortcut: ShortcutItem = VSCODE_SHORTCUTS[currentIndex] || VSCODE_SHORTCUTS[0];
  const requiredKeys = isMac ? currentShortcut.macKeys : currentShortcut.winKeys;

  const checkCombination = useCallback((activeKeys: Set<string>) => {
    // Normalize target keys
    const match = requiredKeys.every(k => {
      const lower = k.toLowerCase();
      if (lower === 'meta' || lower === 'cmd') return activeKeys.has('meta');
      if (lower === 'control' || lower === 'ctrl') return activeKeys.has('control');
      if (lower === 'shift') return activeKeys.has('shift');
      if (lower === 'alt' || lower === 'option') return activeKeys.has('alt');
      return activeKeys.has(lower);
    });

    if (match) {
      soundEngine.playKeypress();
      soundEngine.playComboMilestone(streak + 1);
      setIsSuccess(true);
      setScore(prev => prev + 150 + streak * 25);
      setStreak(prev => prev + 1);

      setTimeout(() => {
        setIsSuccess(false);
        setPressedKeys(new Set());
        if (currentIndex + 1 < VSCODE_SHORTCUTS.length) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setIsDone(true);
          soundEngine.playVictory();
          if (onFinishDojo) onFinishDojo(score + 200);
        }
      }, 700);
    }
  }, [requiredKeys, streak, currentIndex, onFinishDojo, score]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDone || isSuccess) return;

      // Prevent default for common VS Code combinations inside the game so browser doesn't close or open print
      if (
        (e.metaKey || e.ctrlKey) &&
        ['p', 'b', 'd', 'f', 'l', '/'].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }

      setPressedKeys(prev => {
        const next = new Set(prev);
        if (e.metaKey) next.add('meta');
        if (e.ctrlKey) next.add('control');
        if (e.shiftKey) next.add('shift');
        if (e.altKey) next.add('alt');
        if (e.key && !['Meta', 'Control', 'Shift', 'Alt'].includes(e.key)) {
          next.add(e.key.toLowerCase());
        }
        checkCombination(next);
        return next;
      });
    };

    const handleKeyUp = () => {
      // Clear release
      setTimeout(() => {
        setPressedKeys(new Set());
      }, 300);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [checkCombination, isDone, isSuccess]);

  const handleManualPass = () => {
    // For students whose browser strictly locks certain keys
    soundEngine.playKeypress();
    setScore(prev => prev + 100);
    if (currentIndex + 1 < VSCODE_SHORTCUTS.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsDone(true);
      soundEngine.playVictory();
    }
  };

  const resetGame = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setIsDone(false);
    setIsSuccess(false);
    setPressedKeys(new Set());
  };

  const formatKeyName = (k: string) => {
    if (k === 'Meta') return '⌘ Cmd';
    if (k === 'Control') return 'Ctrl';
    if (k === 'Shift') return '⇧ Shift';
    if (k === 'Alt') return isMac ? '⌥ Option' : 'Alt';
    if (k === 'ArrowDown') return '↓ Flecha Abajo';
    if (k === 'ArrowUp') return '↑ Flecha Arriba';
    if (k === ' ') return 'Espacio';
    if (k === '`') return '` Backtick';
    return k.toUpperCase();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
      {/* Top Banner */}
      <div className="w-full flex items-center justify-between bg-brand-petroleum/90 border border-brand-border/70 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-deep/80 border border-brand-cyan/40 flex items-center justify-center text-brand-sky">
            <Keyboard className="w-5 h-5 text-brand-cyan" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>VS Code Shortcuts Dojo</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-sky font-mono border border-brand-cyan/30">
                {isMac ? 'Modo macOS' : 'Modo Windows/Linux'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">Entrenamiento muscular de atajos esenciales</p>
          </div>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-400 uppercase">Puntaje</p>
            <p className="text-xl font-black text-brand-cyan font-mono">{score}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-400 uppercase">Racha</p>
            <p className="text-xl font-black text-brand-amber font-mono flex items-center justify-end gap-1">
              <span>{streak}</span>
              <Flame className="w-4 h-4 text-brand-amber" />
            </p>
          </div>
        </div>
      </div>

      {/* Main Challenge Card */}
      {!isDone ? (
        <div
          className={`w-full bg-brand-petroleum/95 border-2 ${
            isSuccess ? 'border-brand-aqua bg-brand-aqua/10 shadow-2xl shadow-brand-aqua/30' : 'border-brand-border/80'
          } rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-8 backdrop-blur-xl transition-all relative overflow-hidden`}
        >
          {/* Progress bar */}
          <div className="w-full bg-brand-darker h-2 rounded-full overflow-hidden border border-brand-border/40">
            <div
              className="bg-gradient-to-r from-brand-blue to-brand-cyan h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / VSCODE_SHORTCUTS.length) * 100}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400">
            <span>Reto {currentIndex + 1} de {VSCODE_SHORTCUTS.length}</span>
            <span className="capitalize text-brand-sky font-semibold">
              Categoría: {currentShortcut.category}
            </span>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-brand-aqua block mb-2">
              Acción a Ejecutar
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {currentShortcut.name}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-lg mx-auto leading-relaxed">
              {currentShortcut.description}
            </p>
          </div>

          {/* Key Combination Display */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {requiredKeys.map((key, idx) => (
              <React.Fragment key={idx}>
                <div
                  className={`px-5 py-3 rounded-2xl border-2 text-base sm:text-lg font-mono font-bold shadow-lg transition-all ${
                    isSuccess
                      ? 'bg-brand-aqua border-brand-aqua text-brand-darker scale-110 shadow-brand-aqua/50'
                      : 'bg-brand-darker border-brand-cyan/60 text-brand-sky shadow-brand-cyan/20 animate-pulse'
                  }`}
                >
                  {formatKeyName(key)}
                </div>
                {idx < requiredKeys.length - 1 && (
                  <span className="text-slate-500 font-mono text-xl font-bold">+</span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Feedback & Fallback */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-brand-sky">
              <Sparkles className="w-3.5 h-3.5 text-brand-aqua" />
              Presiona la combinación en tu teclado ahora
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <button
              onClick={handleManualPass}
              className="text-slate-400 hover:text-white underline cursor-pointer"
              title="Si tu navegador bloquea el atajo del sistema, haz clic aquí para validar"
            >
              ¿Tu navegador intercepta el atajo? Validar manualmente
            </button>
          </div>
        </div>
      ) : (
        /* Victory Screen */
        <div className="w-full bg-brand-petroleum/95 border-2 border-brand-aqua rounded-3xl p-10 text-center flex flex-col items-center gap-6 shadow-2xl shadow-brand-aqua/20">
          <div className="w-16 h-16 rounded-full bg-brand-aqua/20 border-2 border-brand-aqua flex items-center justify-center text-brand-aqua">
            <Trophy className="w-8 h-8 text-brand-aqua" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white">¡Dojo de Atajos Superado!</h3>
            <p className="text-slate-300 text-sm mt-1">
              Has dominado los atajos de teclado esenciales de VS Code para desarrollar a velocidad de la luz.
            </p>
          </div>

          <div className="bg-brand-darker/80 px-6 py-4 rounded-2xl border border-brand-border/60">
            <span className="text-xs font-mono text-slate-400 uppercase">Puntaje Final</span>
            <p className="text-4xl font-black text-brand-cyan font-mono mt-1">{score} pts</p>
          </div>

          <button
            onClick={resetGame}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-deep to-brand-blue border border-brand-cyan text-white font-bold text-sm shadow-lg shadow-brand-blue/30 hover:scale-105 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repetir Entrenamiento</span>
          </button>
        </div>
      )}
    </div>
  );
};
