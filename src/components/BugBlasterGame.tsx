import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Shield, Zap, RotateCcw, Heart, Flame } from 'lucide-react';
import { soundEngine } from '../audio/soundEngine';
import { SupportedLanguage } from '../types';

interface BugBlasterGameProps {
  language: SupportedLanguage;
  onFinishGame?: (score: number) => void;
}

interface FallingBug {
  id: number;
  word: string;
  x: number; // percentage 10% to 90%
  y: number; // percentage 0% to 100%
  speed: number;
}

const LANGUAGE_KEYWORDS: Record<SupportedLanguage, string[]> = {
  javascript: ['const', 'let', 'async', 'await', 'return', 'import', 'export', 'filter', 'reduce', 'typeof', 'Promise', 'function'],
  typescript: ['interface', 'type', 'readonly', 'implements', 'namespace', 'as', 'keyof', 'unknown', 'any', 'extends', 'declare', 'enum'],
  python: ['def', 'lambda', 'import', 'from', 'class', 'yield', 'async', 'return', 'except', 'finally', 'elif', 'with'],
  java: ['public', 'private', 'class', 'static', 'void', 'package', 'implements', 'interface', 'throws', 'extends', 'final', 'boolean'],
  csharp: ['public', 'record', 'namespace', 'async', 'await', 'override', 'sealed', 'struct', 'delegate', 'yield', 'get', 'set'],
  php: ['function', 'return', 'public', 'private', 'readonly', 'match', 'array', 'namespace', 'implements', 'trait', 'declare', 'echo'],
  go: ['package', 'func', 'import', 'struct', 'type', 'chan', 'go', 'select', 'defer', 'range', 'interface', 'make'],
  rust: ['fn', 'let', 'mut', 'impl', 'struct', 'trait', 'match', 'pub', 'async', 'await', 'unwrap', 'derive'],
  sql: ['SELECT', 'FROM', 'WHERE', 'JOIN', 'GROUP BY', 'HAVING', 'ORDER BY', 'LIMIT', 'INSERT', 'UPDATE', 'DELETE', 'COUNT'],
  html_css: ['div', 'span', 'display', 'flex', 'grid', 'padding', 'margin', 'border', 'color', 'background', 'hover', 'position'],
};

export const BugBlasterGame: React.FC<BugBlasterGameProps> = ({
  language,
  onFinishGame
}) => {
  const [bugs, setBugs] = useState<FallingBug[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(5);
  const [combo, setCombo] = useState<number>(0);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const nextId = useRef<number>(1);
  const animFrameRef = useRef<number | null>(null);

  const keywords = LANGUAGE_KEYWORDS[language] || LANGUAGE_KEYWORDS.javascript;

  // Spawn bug every 1.8 seconds
  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      setBugs(prev => {
        if (prev.length >= 6) return prev;
        const randomWord = keywords[Math.floor(Math.random() * keywords.length)];
        const newBug: FallingBug = {
          id: nextId.current++,
          word: randomWord,
          x: 10 + Math.random() * 75,
          y: 0,
          speed: 0.25 + Math.random() * 0.2
        };
        return [...prev, newBug];
      });
    }, 1600);

    return () => clearInterval(interval);
  }, [keywords, isGameOver]);

  // Game loop: Update positions
  useEffect(() => {
    if (isGameOver) return;

    const updateLoop = () => {
      setBugs(prev => {
        const nextBugs: FallingBug[] = [];
        let livesLost = 0;

        for (const bug of prev) {
          const nextY = bug.y + bug.speed;
          if (nextY >= 92) {
            // Bug reached the bottom firewall
            livesLost++;
            soundEngine.playError();
          } else {
            nextBugs.push({ ...bug, y: nextY });
          }
        }

        if (livesLost > 0) {
          setLives(l => {
            const nextL = l - livesLost;
            if (nextL <= 0) {
              setIsGameOver(true);
              soundEngine.playError();
              if (onFinishGame) onFinishGame(score);
              return 0;
            }
            return nextL;
          });
          setCombo(0);
          soundEngine.resetCombo();
        }

        return nextBugs;
      });

      animFrameRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isGameOver, onFinishGame, score]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    soundEngine.playKeypress();

    // Check if typed word matches any bug on screen
    const matchIndex = bugs.findIndex(b => b.word.toLowerCase() === val.trim().toLowerCase());

    if (matchIndex !== -1) {
      // Hit!
      const destroyedBug = bugs[matchIndex];
      soundEngine.incrementCombo();
      const currentCombo = combo + 1;
      setCombo(currentCombo);
      soundEngine.playComboMilestone(currentCombo);

      const pointsEarned = 100 + currentCombo * 15;
      setScore(s => s + pointsEarned);

      setBugs(prev => prev.filter(b => b.id !== destroyedBug.id));
      setInputVal('');
    }
  };

  const restartGame = useCallback(() => {
    setBugs([]);
    setInputVal('');
    setScore(0);
    setLives(5);
    setCombo(0);
    setIsGameOver(false);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-4">
      {/* Top HUD */}
      <div className="w-full flex items-center justify-between bg-brand-petroleum/90 border border-brand-border/70 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-deep/80 border border-brand-cyan/40 flex items-center justify-center text-brand-sky">
            <Zap className="w-5 h-5 text-brand-cyan" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Syntax Bug Blaster</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-sky font-mono border border-brand-cyan/30">
                {language.toUpperCase()}
              </span>
            </h2>
            <p className="text-xs text-slate-400">Destruye los bugs antes de que rompan el Firewall</p>
          </div>
        </div>

        {/* Lives, Combo & Score */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${
                  i < lives ? 'text-brand-coral fill-brand-coral animate-pulse' : 'text-slate-600'
                }`}
              />
            ))}
          </div>

          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1 justify-end">
              <Flame className="w-3 h-3 text-brand-amber" /> Racha
            </p>
            <p className="text-lg font-black text-brand-amber font-mono">{combo}x</p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-mono text-slate-400 uppercase">Puntaje</p>
            <p className="text-2xl font-black text-brand-cyan font-mono">{score}</p>
          </div>
        </div>
      </div>

      {/* Arcade Canvas Battlefield */}
      <div className="w-full h-[460px] bg-brand-darker/95 border-2 border-brand-border/80 rounded-3xl relative overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col justify-end">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#14224d_1px,transparent_1px),linear-gradient(to_bottom,#14224d_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

        {/* Falling Bugs */}
        {!isGameOver &&
          bugs.map(bug => (
            <div
              key={bug.id}
              className="absolute font-mono text-xs sm:text-sm font-bold px-3 py-1.5 rounded-xl border border-brand-cyan/60 bg-brand-petroleum/90 text-brand-sky shadow-lg shadow-brand-cyan/20 flex items-center gap-1.5 transition-transform duration-75 select-none"
              style={{
                left: `${bug.x}%`,
                top: `${bug.y}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <span className="w-2 h-2 rounded-full bg-brand-coral animate-ping"></span>
              <span>{bug.word}</span>
            </div>
          ))}

        {/* Firewall Shield Line */}
        <div className="relative w-full h-12 border-t-2 border-brand-cyan/70 bg-gradient-to-t from-brand-cyan/15 to-transparent flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-2 text-xs font-mono text-brand-cyan font-semibold">
            <Shield className="w-4 h-4 animate-pulse" />
            <span>FIREWALL CAMPUSLANDS ACTIVO</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Escudo {lives * 20}%</span>
        </div>

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-brand-darker/90 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-20">
            <div className="text-center">
              <span className="text-xs font-mono text-brand-coral uppercase tracking-widest block mb-1">
                Brecha de Seguridad
              </span>
              <h3 className="text-3xl sm:text-4xl font-black text-white">¡FIREWALL COMPROMETIDO!</h3>
              <p className="text-slate-300 text-sm mt-2">
                Puntaje alcanzado: <span className="font-mono text-brand-cyan font-bold">{score} pts</span>
              </p>
            </div>

            <button
              onClick={restartGame}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-deep to-brand-blue border border-brand-cyan text-white font-bold text-sm shadow-xl shadow-brand-blue/40 hover:scale-105 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reintentar Invasión</span>
            </button>
          </div>
        )}
      </div>

      {/* Input Shooter Box */}
      <div className="w-full max-w-md relative">
        <input
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          placeholder="Escribe el token para destruirlo..."
          disabled={isGameOver}
          autoFocus
          className="w-full bg-brand-petroleum border-2 border-brand-border/80 focus:border-brand-cyan rounded-2xl py-3.5 px-5 font-mono text-base text-white placeholder-slate-500 shadow-xl focus:outline-none focus:shadow-brand-cyan/20 transition-all text-center tracking-wide"
        />
        <div className="text-center mt-2 text-xs font-mono text-slate-500">
          Tipea la palabra exacta que cae y se autodestruirá automáticamente
        </div>
      </div>
    </div>
  );
};
