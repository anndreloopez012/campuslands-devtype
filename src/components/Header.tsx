import React, { useState } from 'react';
import { Volume2, VolumeX, Trophy, User, Keyboard, Sparkles, Terminal } from 'lucide-react';
import { SwitchProfile, GitHubUser, GameMode } from '../types';
import { soundEngine } from '../audio/soundEngine';

interface HeaderProps {
  currentProfile: SwitchProfile;
  onProfileChange: (p: SwitchProfile) => void;
  user: GitHubUser;
  onOpenProfile: () => void;
  onOpenLeaderboard: () => void;
  currentMode: GameMode;
  onModeChange: (m: GameMode) => void;
  vsCodeShortcutCheck: boolean;
  onToggleShortcutCheck: (checked: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProfile,
  onProfileChange,
  user,
  onOpenProfile,
  onOpenLeaderboard,
  currentMode,
  onModeChange,
  vsCodeShortcutCheck,
  onToggleShortcutCheck
}) => {
  const [volume, setVolume] = useState<number>(0.5);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
  };

  const switchOptions: { id: SwitchProfile; label: string; desc: string }[] = [
    { id: 'thocky', label: 'Brown Thock', desc: 'Gateron Brown' },
    { id: 'clicky', label: 'Blue Click', desc: 'Cherry MX Blue' },
    { id: 'cream', label: 'Cream Lubed', desc: 'Boba U4T' },
    { id: 'arcade', label: '8-Bit Synth', desc: 'Arcade Blip' },
    { id: 'mute', label: 'Mute', desc: 'Sin sonido' }
  ];

  return (
    <header className="border-b border-brand-border/60 bg-brand-petroleum/90 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onModeChange('sprint')}>
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-brand-deep via-brand-cyan-dark to-brand-cyan p-[2px] shadow-lg shadow-brand-cyan/20 group-hover:shadow-brand-cyan/40 transition-all">
            <div className="w-full h-full bg-brand-petroleum rounded-[10px] flex items-center justify-center overflow-hidden">
              <img src="./favicon.svg" alt="Campuslands Helmet" className="w-8 h-8 object-contain filter drop-shadow(0 0 4px #2CAAFF)" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-aqua opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-aqua"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-xl bg-gradient-to-r from-white via-brand-sky to-brand-cyan bg-clip-text text-transparent">
                CAMPUSLANDS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase bg-brand-deep/60 border border-brand-cyan/40 text-brand-sky rounded-md">
                DEVTYPE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
              <Terminal className="w-3 h-3 text-brand-aqua" />
              <span>Mecanografía de Código & Atajos</span>
            </p>
          </div>
        </div>

        {/* Center: Modes & VS Code Shortcuts Checkbox */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="bg-brand-darker/70 p-1.5 rounded-xl border border-brand-border/60 flex items-center gap-1">
            <button
              onClick={() => onModeChange('sprint')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentMode === 'sprint'
                  ? 'bg-brand-cyan text-brand-petroleum shadow-md shadow-brand-cyan/30'
                  : 'text-slate-300 hover:text-white hover:bg-brand-surface'
              }`}
            >
              <span>⚡</span> Speed Sprint
            </button>

            <button
              onClick={() => onModeChange('blaster')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentMode === 'blaster'
                  ? 'bg-brand-cyan text-brand-petroleum shadow-md shadow-brand-cyan/30'
                  : 'text-slate-300 hover:text-white hover:bg-brand-surface'
              }`}
            >
              <span>👾</span> Bug Blaster
            </button>

            <button
              onClick={() => onModeChange('symbols')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                currentMode === 'symbols'
                  ? 'bg-brand-cyan text-brand-petroleum shadow-md shadow-brand-cyan/30'
                  : 'text-slate-300 hover:text-white hover:bg-brand-surface'
              }`}
            >
              <span>{`{ ; }`}</span> Symbol Storm
            </button>
          </div>

          {/* VS Code Shortcut Training Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer bg-brand-darker/60 hover:bg-brand-surface/70 px-3 py-2 rounded-xl border border-brand-border/60 transition-all select-none">
            <input
              type="checkbox"
              checked={vsCodeShortcutCheck}
              onChange={(e) => {
                onToggleShortcutCheck(e.target.checked);
                if (e.target.checked && currentMode !== 'shortcuts') {
                  onModeChange('shortcuts');
                } else if (!e.target.checked && currentMode === 'shortcuts') {
                  onModeChange('sprint');
                }
              }}
              className="w-4 h-4 rounded text-brand-cyan bg-brand-surface border-brand-border focus:ring-brand-cyan focus:ring-offset-brand-petroleum accent-brand-cyan cursor-pointer"
            />
            <div className="flex items-center gap-1.5">
              <Keyboard className="w-3.5 h-3.5 text-brand-sky" />
              <span className="text-xs font-medium text-slate-200">
                Atajos VS Code
              </span>
              <span className="bg-brand-aqua/20 text-brand-aqua text-[9px] px-1.5 py-0.2 rounded font-mono">
                Dojo
              </span>
            </div>
          </label>
        </div>

        {/* Right side: Audio Switches, Leaderboard & GitHub Profile */}
        <div className="flex items-center gap-3">
          {/* Switch Sound Picker */}
          <div className="hidden sm:flex items-center gap-2 bg-brand-darker/60 p-1.5 px-2.5 rounded-xl border border-brand-border/60">
            <select
              value={currentProfile}
              onChange={(e) => {
                const val = e.target.value as SwitchProfile;
                onProfileChange(val);
                soundEngine.setProfile(val);
                soundEngine.playKeypress();
              }}
              className="bg-transparent text-xs font-mono text-brand-sky focus:outline-none cursor-pointer"
              title="Perfil de Switches Mecánicos"
            >
              {switchOptions.map(opt => (
                <option key={opt.id} value={opt.id} className="bg-brand-petroleum text-slate-200">
                  ⌨️ {opt.label}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 border-l border-brand-border/60 pl-2">
              {volume === 0 || currentProfile === 'mute' ? (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-brand-aqua" />
              )}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-14 h-1 bg-brand-surface rounded-lg appearance-none cursor-pointer accent-brand-cyan"
                title="Volumen de teclado"
              />
            </div>
          </div>

          {/* Ranking Button */}
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-brand-deep/40 hover:bg-brand-deep/80 border border-brand-blue/50 text-brand-sky hover:text-white transition-all shadow-sm group"
            title="Ver Tabla de Clasificación"
          >
            <Trophy className="w-3.5 h-3.5 text-brand-amber group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Ranking</span>
          </button>

          {/* GitHub Camper Profile Button */}
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-brand-surface/80 hover:bg-brand-surfaceLight border border-brand-border/80 transition-all group"
            title="Perfil de Camper GitHub"
          >
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-7 h-7 rounded-full border border-brand-cyan/60 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://avatars.githubusercontent.com/u/104395015?v=4';
              }}
            />
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-white leading-none flex items-center gap-1">
                <span>@{user.username}</span>
                <Sparkles className="w-3 h-3 text-brand-cyan" />
              </p>
              <p className="text-[10px] text-brand-sky/80 font-mono mt-0.5">
                {user.rankBadge?.split(' ')[1] || 'Camper'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};
