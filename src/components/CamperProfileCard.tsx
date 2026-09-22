import React, { useState } from 'react';
import { X, Sparkles, Check, Loader2, GitBranch } from 'lucide-react';
import { GitHubUser } from '../types';

interface CamperProfileCardProps {
  isOpen: boolean;
  onClose: () => void;
  user: GitHubUser;
  onUpdateUsername: (username: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const CamperProfileCard: React.FC<CamperProfileCardProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUsername,
  isLoading,
  error
}) => {
  const [inputUsername, setInputUsername] = useState(user.username);
  const [successSaved, setSuccessSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUsername.trim()) return;
    await onUpdateUsername(inputUsername);
    setSuccessSaved(true);
    setTimeout(() => setSuccessSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-darker/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-brand-petroleum border-2 border-brand-cyan/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-brand-cyan/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-brand-darker/60 hover:bg-brand-surface border border-brand-border/60 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-aqua animate-ping"></span>
          <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
            Carnet de Camper
          </h3>
        </div>

        {/* Cyber ID Card Preview */}
        <div className="bg-gradient-to-br from-brand-deep/60 via-brand-petroleum to-brand-surface rounded-2xl p-5 border border-brand-cyan/40 shadow-inner mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-cyan/10 rounded-full blur-2xl"></div>

          <div className="flex items-center gap-4 relative z-10">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-16 h-16 rounded-2xl border-2 border-brand-cyan object-cover shadow-lg shadow-brand-cyan/30 flex-shrink-0"
              style={{ width: '64px', height: '64px', minWidth: '64px', minHeight: '64px', objectFit: 'cover', borderRadius: '16px' }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://avatars.githubusercontent.com/u/104395015?v=4';
              }}
            />
            <div>
              <h4 className="text-lg font-black text-white leading-tight flex items-center gap-1.5">
                <span>{user.name || user.username}</span>
                <Sparkles className="w-4 h-4 text-brand-aqua" />
              </h4>
              <p className="text-xs text-brand-sky font-mono">@{user.username}</p>
              <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan">
                {user.rankBadge || 'Camper Astronauta'}
              </div>
            </div>
          </div>

          {user.bio && (
            <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-brand-border/40 line-clamp-2">
              {user.bio}
            </p>
          )}

          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Campus: <strong className="text-slate-200">Campuslands</strong></span>
            <span>Repos: <strong className="text-brand-sky">{user.publicRepos ?? 0}</strong></span>
          </div>
        </div>

        {/* GitHub Username Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-brand-cyan" />
            <span>Ingresa tu Usuario de GitHub para asociar tus récords:</span>
          </label>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                @
              </span>
              <input
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                placeholder="ej: anndreloopez012"
                className="w-full bg-brand-darker border border-brand-border/80 focus:border-brand-cyan rounded-xl py-2.5 pl-8 pr-3 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-brand-cyan"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-brand-cyan hover:bg-brand-sky text-brand-petroleum font-bold text-xs shadow-lg shadow-brand-cyan/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : successSaved ? (
                <Check className="w-4 h-4" />
              ) : (
                <span>Sincronizar</span>
              )}
            </button>
          </div>

          {error && <p className="text-xs text-brand-coral font-mono">{error}</p>}
          {successSaved && (
            <p className="text-xs text-brand-aqua font-mono flex items-center gap-1">
              <Check className="w-3 h-3" /> Perfil de GitHub sincronizado correctamente
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
