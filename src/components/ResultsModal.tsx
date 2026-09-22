import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Download, RotateCcw, Share2, Check, ArrowRight, Zap, Target, Clock, AlertTriangle } from 'lucide-react';
import { SupportedLanguage, CamperLevel, GameMode, GitHubUser, WpmSample } from '../types';
import { saveScore } from '../data/leaderboardData';
import { LANGUAGE_METADATA, LEVEL_METADATA } from '../data/codeSnippets';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  stats: {
    wpm: number;
    cpm: number;
    accuracy: number;
    errors: number;
    timeSeconds: number;
    wpmHistory: WpmSample[];
  };
  language: SupportedLanguage;
  level: CamperLevel;
  mode: GameMode;
  user: GitHubUser;
  onOpenLeaderboard: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  isOpen,
  onClose,
  onPlayAgain,
  stats,
  language,
  level,
  mode,
  user,
  onOpenLeaderboard
}) => {
  const [scoreUploaded, setScoreUploaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Fire confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2CAAFF', '#57BBFF', '#00AA80', '#FFB800', '#1B00BF']
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUploadScore = () => {
    saveScore({
      githubUsername: user.username,
      camperName: user.name || user.username,
      avatarUrl: user.avatarUrl,
      campus: 'Campuslands',
      language,
      level,
      mode,
      wpm: stats.wpm,
      cpm: stats.cpm,
      accuracy: stats.accuracy,
      errors: stats.errors,
      timeSeconds: stats.timeSeconds
    });

    setScoreUploaded(true);
    setTimeout(() => {
      onOpenLeaderboard();
      onClose();
    }, 1200);
  };

  const handleDownloadCard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw Cyberpunk Certificate Card (1200 x 630 px for social sharing)
    canvas.width = 1200;
    canvas.height = 630;

    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#07102B');
    bgGrad.addColorStop(0.5, '#0B132B');
    bgGrad.addColorStop(1, '#000051');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Border neon glow
    ctx.strokeStyle = '#2CAAFF';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, 1160, 590);

    // Decorative inner lines
    ctx.strokeStyle = 'rgba(44, 170, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1120, 550);

    // Header Title
    ctx.fillStyle = '#57BBFF';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('CAMPUSLANDS DEVTYPE // CERTIFICADO OFICIAL', 80, 110);

    // Camper Info
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 54px sans-serif';
    ctx.fillText(user.name || user.username, 80, 190);

    ctx.fillStyle = '#2CAAFF';
    ctx.font = '30px monospace';
    ctx.fillText(`@${user.username} · ${user.rankBadge || 'Camper Astronauta'}`, 80, 240);

    // Stats Grid Box
    ctx.fillStyle = 'rgba(13, 24, 56, 0.9)';
    ctx.fillRect(80, 290, 1040, 190);
    ctx.strokeStyle = '#1E3264';
    ctx.strokeRect(80, 290, 1040, 190);

    // WPM
    ctx.fillStyle = '#57BBFF';
    ctx.font = '24px monospace';
    ctx.fillText('VELOCIDAD', 140, 340);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 64px monospace';
    ctx.fillText(`${stats.wpm} WPM`, 140, 420);

    // Accuracy
    ctx.fillStyle = '#00AA80';
    ctx.font = '24px monospace';
    ctx.fillText('PRECISIÓN', 480, 340);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 64px monospace';
    ctx.fillText(`${stats.accuracy}%`, 480, 420);

    // Language & Level
    ctx.fillStyle = '#FFB800';
    ctx.font = '24px monospace';
    ctx.fillText('LENGUAJE & NIVEL', 780, 340);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText(LANGUAGE_METADATA[language]?.label || language, 780, 400);
    ctx.font = '26px monospace';
    ctx.fillStyle = '#2CAAFF';
    ctx.fillText(LEVEL_METADATA[level]?.label || level, 780, 440);

    // Footer
    ctx.fillStyle = '#94A3B8';
    ctx.font = '22px monospace';
    ctx.fillText('Validado en Campuslands DevType • https://github.com/anndreloopez012/campuslands-devtype', 80, 540);

    // Export to PNG
    const link = document.createElement('a');
    link.download = `campuslands-devtype-${user.username}-${stats.wpm}wpm.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const getSpeedVerdict = (wpm: number) => {
    if (wpm >= 95) return { title: '🌌 VELOCIDAD CÓSMICA', desc: 'Tu velocidad de tipeo está en el top 1% de desarrolladores.' };
    if (wpm >= 75) return { title: '🚀 NIVEL ASTRONAUTA', desc: 'Ritmo excepcional para escribir algoritmos en caliente.' };
    if (wpm >= 50) return { title: '🛸 CAMPER EXPLORER', desc: 'Excelente fluidez y solidez en sintaxis de programación.' };
    return { title: '🌱 EN ENTRENAMIENTO', desc: '¡Gran práctica! La memoria muscular se forja línea a línea.' };
  };

  const verdict = getSpeedVerdict(stats.wpm);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-darker/85 backdrop-blur-md animate-fadeIn">
      {/* Hidden Canvas for Card Generation */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-2xl bg-brand-petroleum border-2 border-brand-cyan/60 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-brand-cyan/30 text-center flex flex-col items-center gap-6 overflow-hidden">
        {/* Decorative ambient glow */}
        <div className="absolute -top-20 -left-20 w-52 h-52 bg-brand-cyan/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-brand-deep/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Verdict Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-brand-cyan/20 border border-brand-cyan/50 text-brand-sky text-xs font-mono font-bold tracking-widest uppercase">
          <Trophy className="w-4 h-4 text-brand-amber" />
          {verdict.title}
        </div>

        <div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            ¡Misión Completada!
          </h2>
          <p className="text-slate-300 text-sm mt-2 max-w-md mx-auto">
            {verdict.desc}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          <div className="bg-brand-darker/80 border border-brand-border/70 rounded-2xl p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-brand-cyan" /> Velocidad
            </span>
            <p className="text-3xl font-black text-white font-mono mt-1">{stats.wpm}</p>
            <span className="text-[10px] text-brand-sky font-mono">WPM</span>
          </div>

          <div className="bg-brand-darker/80 border border-brand-border/70 rounded-2xl p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-center gap-1">
              <Target className="w-3.5 h-3.5 text-brand-aqua" /> Precisión
            </span>
            <p className="text-3xl font-black text-brand-aqua font-mono mt-1">{stats.accuracy}%</p>
            <span className="text-[10px] text-slate-400 font-mono">Exactitud</span>
          </div>

          <div className="bg-brand-darker/80 border border-brand-border/70 rounded-2xl p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-sky" /> Tiempo
            </span>
            <p className="text-3xl font-black text-white font-mono mt-1">{stats.timeSeconds}s</p>
            <span className="text-[10px] text-slate-400 font-mono">{stats.cpm} CPM</span>
          </div>

          <div className="bg-brand-darker/80 border border-brand-border/70 rounded-2xl p-4">
            <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center justify-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-brand-coral" /> Errores
            </span>
            <p className={`text-3xl font-black font-mono mt-1 ${stats.errors > 0 ? 'text-brand-coral' : 'text-slate-400'}`}>
              {stats.errors}
            </p>
            <span className="text-[10px] text-slate-400 font-mono">Fallos</span>
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
          {/* Upload Score Button */}
          <button
            onClick={handleUploadScore}
            disabled={scoreUploaded}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-brand-deep to-brand-blue border border-brand-cyan/60 text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-brand-blue/30 hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {scoreUploaded ? (
              <>
                <Check className="w-4 h-4 text-brand-aqua" />
                <span>¡Puntaje Registrado!</span>
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 text-brand-amber" />
                <span>Subir al Ranking Global</span>
              </>
            )}
          </button>

          {/* Download Certificate Card */}
          <button
            onClick={handleDownloadCard}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-brand-surface hover:bg-brand-surfaceLight border border-brand-border text-brand-sky font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            title="Descargar imagen oficial para compartir en redes"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Tarjeta</span>
          </button>

          {/* Play Again */}
          <button
            onClick={() => {
              onClose();
              onPlayAgain();
            }}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-brand-darker hover:bg-brand-surface border border-brand-border text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reintentar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
