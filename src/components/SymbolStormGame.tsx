import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';

interface SymbolStormGameProps {
  onFinish?: (score: number) => void;
}

const PROGRAMMING_SYMBOLS = [
  '{ }', '[ ]', '( )', '=>', '===', '!==', '&&', '||', '!=',
  '++', '--', '+=', '-=', '*=', '/=', '->', '::', '<?php', '/>',
  '${ }', '<T>', '?:', '??', '!=', '<=', '>=', ';', '/*', '*/',
  '[]', '{}', '()', '=>', '||', '&&', '==', '!=', '<', '>'
];

export const SymbolStormGame: React.FC<SymbolStormGameProps> = ({ onFinish }) => {
  const [targetList, setTargetList] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [typedInput, setTypedInput] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(30); // 30 seconds sprint
  const [isActive, setIsActive] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const initGame = useCallback(() => {
    // Shuffle and pick 40 symbols
    const shuffled = [...PROGRAMMING_SYMBOLS, ...PROGRAMMING_SYMBOLS]
      .sort(() => 0.5 - Math.random())
      .slice(0, 30);
    setTargetList(shuffled);
    setCurrentIndex(0);
    setTypedInput('');
    setScore(0);
    setCombo(0);
    setTimer(30);
    setIsActive(false);
    setIsCompleted(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  // Countdown timer
  useEffect(() => {
    if (!isActive || isCompleted) return;

    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          setIsCompleted(true);
          soundEngine.playVictory();
          if (onFinish) onFinish(score);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isCompleted, onFinish, score]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isActive) setIsActive(true);

    const val = e.target.value;
    setTypedInput(val);

    const currentTarget = targetList[currentIndex];
    if (!currentTarget) return;

    if (val === currentTarget) {
      soundEngine.playKeypress();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      soundEngine.playComboMilestone(nextCombo);

      const points = 100 + nextCombo * 10;
      setScore(s => s + points);

      setTypedInput('');
      if (currentIndex + 1 < targetList.length) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsCompleted(true);
        soundEngine.playVictory();
        if (onFinish) onFinish(score + points);
      }
    } else if (currentTarget.startsWith(val)) {
      soundEngine.playKeypress();
    } else {
      soundEngine.playError();
      setCombo(0);
      soundEngine.resetCombo();
    }
  };

  const currentTarget = targetList[currentIndex] || '';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between bg-brand-petroleum/90 border border-brand-border/70 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-deep/80 border border-brand-cyan/40 flex items-center justify-center font-mono text-base font-bold text-brand-sky">
            {`{ }`}
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Bracket & Symbol Storm</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-sky font-mono border border-brand-cyan/30">
                Velocidad Pura
              </span>
            </h2>
            <p className="text-xs text-slate-400">Entrenamiento muscular de llaves, corchetes y operadores</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-400 uppercase">Tiempo</p>
            <p className={`text-xl font-black font-mono ${timer <= 5 ? 'text-brand-coral animate-ping' : 'text-white'}`}>
              {timer}s
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-400 uppercase">Racha</p>
            <p className="text-xl font-black text-brand-amber font-mono">{combo}x</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-400 uppercase">Puntos</p>
            <p className="text-2xl font-black text-brand-cyan font-mono">{score}</p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      {!isCompleted ? (
        <div className="w-full bg-brand-petroleum/95 border-2 border-brand-border/80 rounded-3xl p-8 sm:p-12 text-center flex flex-col items-center gap-6 backdrop-blur-xl shadow-2xl relative">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Símbolo {currentIndex + 1} de {targetList.length}
          </span>

          {/* Current Target in Huge Font */}
          <div className="py-6 px-12 rounded-3xl bg-brand-darker/90 border-2 border-brand-cyan/60 shadow-2xl shadow-brand-cyan/20">
            <span className="text-5xl sm:text-7xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-sky to-brand-cyan tracking-wider drop-shadow(0 0 15px rgba(44,170,255,0.5))">
              {currentTarget}
            </span>
          </div>

          {/* Upcoming symbols preview */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-sm py-2 opacity-60">
            {targetList.slice(currentIndex + 1, currentIndex + 6).map((sym, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg bg-brand-surface border border-brand-border/50 text-xs font-mono text-slate-400"
              >
                {sym}
              </span>
            ))}
          </div>

          {/* Input field */}
          <div className="w-full max-w-xs">
            <input
              ref={inputRef}
              type="text"
              value={typedInput}
              onChange={handleInputChange}
              placeholder="Tipea el símbolo exacto..."
              autoFocus
              className="w-full text-center bg-brand-darker border-2 border-brand-border/80 focus:border-brand-cyan rounded-2xl py-3 px-4 font-mono text-2xl text-white tracking-widest focus:outline-none focus:shadow-xl focus:shadow-brand-cyan/20 transition-all"
            />
          </div>

          <p className="text-xs font-mono text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-brand-aqua" />
            Tipea el símbolo con precisión para avanzar al siguiente
          </p>
        </div>
      ) : (
        /* Completed Screen */
        <div className="w-full bg-brand-petroleum/95 border-2 border-brand-aqua rounded-3xl p-10 text-center flex flex-col items-center gap-6 shadow-2xl shadow-brand-aqua/20">
          <div className="w-16 h-16 rounded-full bg-brand-aqua/20 border-2 border-brand-aqua flex items-center justify-center text-brand-aqua">
            <Trophy className="w-8 h-8 text-brand-aqua" />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-white">¡Ronda de Símbolos Finalizada!</h3>
            <p className="text-slate-300 text-sm mt-1">
              Excelente control muscular de llaves y caracteres de programación.
            </p>
          </div>

          <div className="bg-brand-darker/80 px-8 py-4 rounded-2xl border border-brand-border/60">
            <span className="text-xs font-mono text-slate-400 uppercase">Puntaje Obtenido</span>
            <p className="text-4xl font-black text-brand-cyan font-mono mt-1">{score} pts</p>
          </div>

          <button
            onClick={initGame}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-deep to-brand-blue border border-brand-cyan text-white font-bold text-sm shadow-xl shadow-brand-blue/40 hover:scale-105 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repetir Desafío de Símbolos</span>
          </button>
        </div>
      )}
    </div>
  );
};
