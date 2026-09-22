import React, { useEffect, useRef, useState } from 'react';
import { RotateCcw, Flame, CheckCircle2, ChevronRight, Zap, Lightbulb } from 'lucide-react';
import { SnippetItem, WpmSample } from '../types';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { VirtualKeyboard } from './VirtualKeyboard';

interface CodeSprintGameProps {
  snippet: SnippetItem;
  onNextSnippet: () => void;
  onFinishGame: (stats: {
    wpm: number;
    cpm: number;
    accuracy: number;
    errors: number;
    timeSeconds: number;
    wpmHistory: WpmSample[];
  }) => void;
}

export const CodeSprintGame: React.FC<CodeSprintGameProps> = ({
  snippet,
  onNextSnippet,
  onFinishGame
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastChar, setLastChar] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  const {
    typed,
    errors,
    elapsedTime,
    currentWpm,
    currentAccuracy,
    combo,
    handleKeyDown,
    reset
  } = useTypingEngine({
    targetCode: snippet.code,
    onFinish: (stats) => {
      onFinishGame(stats);
    }
  });

  // Focus container on mount and click
  useEffect(() => {
    containerRef.current?.focus();
  }, [snippet]);

  const onKeyDownWrapper = (e: React.KeyboardEvent<HTMLDivElement>) => {
    setLastChar(e.key);
    const currIdx = typed.length;
    const expected = snippet.code[currIdx];

    if (e.key.length === 1 && expected && e.key !== expected && e.key !== 'Backspace') {
      setHasError(true);
      setTimeout(() => setHasError(false), 200);
    }

    handleKeyDown(e.nativeEvent);
  };

  const codeChars = snippet.code.split('');
  const lines = snippet.code.split('\n');
  const expectedChar = snippet.code[typed.length] || '';

  // Calculate completion percentage
  const progressPercent = Math.min(100, Math.round((typed.length / snippet.code.length) * 100));

  return (
    <div className="w-full flex flex-col items-center gap-6">
      {/* HUD Dashboard */}
      <div id="tour-hud-dashboard" className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* WPM Stat */}
        <div className="bg-brand-petroleum/90 border border-brand-border/70 rounded-2xl p-4 flex items-center justify-between shadow-lg relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-brand-cyan/10 rounded-full blur-xl group-hover:bg-brand-cyan/20 transition-all"></div>
          <div>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-brand-cyan" />
              Velocidad
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-white font-mono">{currentWpm}</span>
              <span className="text-xs font-mono text-brand-sky">WPM</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-mono block">Progreso</span>
            <span className="text-xs font-bold text-brand-cyan font-mono">{progressPercent}%</span>
          </div>
        </div>

        {/* Accuracy Stat */}
        <div className="bg-brand-petroleum/90 border border-brand-border/70 rounded-2xl p-4 flex items-center justify-between shadow-lg relative overflow-hidden group">
          <div>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-aqua" />
              Precisión
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-white font-mono">{currentAccuracy}%</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-mono block">Errores</span>
            <span className={`text-xs font-bold font-mono ${errors > 0 ? 'text-brand-coral' : 'text-slate-400'}`}>
              {errors}
            </span>
          </div>
        </div>

        {/* Combo Multiplier */}
        <div className="bg-brand-petroleum/90 border border-brand-border/70 rounded-2xl p-4 flex items-center justify-between shadow-lg relative overflow-hidden group">
          <div>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className={`w-3.5 h-3.5 ${combo > 10 ? 'text-brand-amber animate-bounce' : 'text-slate-400'}`} />
              Racha Combo
            </p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-brand-amber font-mono">{combo}x</span>
            </div>
          </div>
          {combo >= 20 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-amber/20 text-brand-amber border border-brand-amber/40 animate-pulse flex items-center gap-1">
              <Flame className="w-3 h-3 text-brand-amber" />
              <span>EN LLAMAS</span>
            </span>
          )}
        </div>

        {/* Timer & Controls */}
        <div className="bg-brand-petroleum/90 border border-brand-border/70 rounded-2xl p-4 flex items-center justify-between shadow-lg">
          <div>
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Tiempo</p>
            <p className="text-2xl font-black text-white font-mono mt-0.5">
              {Math.floor(elapsedTime)}s
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                reset();
                containerRef.current?.focus();
              }}
              className="p-2.5 rounded-xl bg-brand-darker hover:bg-brand-surfaceLight border border-brand-border/60 text-slate-300 hover:text-white transition-all shadow-sm"
              title="Reiniciar ejercicio"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                onNextSnippet();
                reset();
              }}
              className="p-2.5 rounded-xl bg-brand-blue/30 hover:bg-brand-blue/60 border border-brand-blue text-brand-sky hover:text-white transition-all shadow-sm"
              title="Siguiente fragmento"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Code Terminal Box */}
      <div
        id="tour-code-editor"
        ref={containerRef}
        tabIndex={0}
        onKeyDown={onKeyDownWrapper}
        className="w-full max-w-5xl bg-brand-petroleum/95 border-2 border-brand-border/80 rounded-3xl p-6 sm:p-8 font-mono text-base sm:text-lg focus:outline-none focus:border-brand-cyan/80 focus:shadow-2xl focus:shadow-brand-cyan/20 transition-all cursor-text relative overflow-hidden backdrop-blur-xl group"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-brand-border/40 select-none">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-brand-coral/80"></div>
            <div className="w-3 h-3 rounded-full bg-brand-amber/80"></div>
            <div className="w-3 h-3 rounded-full bg-brand-aqua/80"></div>
            <span className="ml-3 text-xs text-slate-400 font-mono">
              {snippet.title} — <span className="text-brand-sky">{snippet.language}</span>
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
            Haz clic dentro y comienza a tipear
          </div>
        </div>

        {/* Code Renderer with line numbers & character states */}
        <div className="relative leading-relaxed sm:leading-loose whitespace-pre-wrap font-mono tracking-wide">
          {codeChars.map((char, index) => {
            const isTyped = index < typed.length;
            const isCurrent = index === typed.length;
            const isCorrect = isTyped && typed[index] === char;
            const isErrorChar = isTyped && typed[index] !== char;

            let charClass = 'text-slate-500 transition-colors duration-75';

            if (isCorrect) {
              charClass = 'text-brand-cyan font-semibold drop-shadow(0 0 6px rgba(44,170,255,0.6))';
            } else if (isErrorChar) {
              charClass = 'text-white bg-brand-coral/80 rounded px-[1px] animate-shake-fast';
            }

            return (
              <span key={index} className="relative inline-block">
                {isCurrent && (
                  <span className="absolute -left-[1px] top-0 bottom-0 w-[2.5px] bg-brand-cyan animate-pulse shadow-md shadow-brand-cyan"></span>
                )}
                <span className={charClass}>
                  {char === '\n' ? '↵\n' : char}
                </span>
              </span>
            );
          })}
        </div>

        {/* Bottom Tip */}
        <div className="mt-6 pt-4 border-t border-brand-border/30 flex items-center justify-between text-xs text-slate-400 font-mono select-none">
          <span className="flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Presiona <kbd className="px-1.5 py-0.5 rounded bg-brand-darker border border-brand-border text-brand-sky">Enter</kbd> para saltar líneas (la auto-sangría se añade sola).</span>
          </span>
          <span className="hidden sm:inline">Fragmento {lines.length} líneas</span>
        </div>
      </div>

      {/* Visual Touch Keyboard */}
      <VirtualKeyboard
        expectedChar={expectedChar}
        lastPressedChar={lastChar}
        isError={hasError}
      />
    </div>
  );
};
