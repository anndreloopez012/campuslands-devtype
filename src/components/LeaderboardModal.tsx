import React, { useState, useEffect } from 'react';
import { X, Trophy, Search, RotateCcw, Check, GitBranch, Medal } from 'lucide-react';
import { ScoreRecord, SupportedLanguage, CamperLevel, GameMode } from '../types';
import { getFilteredLeaderboard, fetchRemoteScores } from '../data/leaderboardData';
import { LANGUAGE_METADATA } from '../data/codeSnippets';
import { LanguageIcon } from './LanguageIcon';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose }) => {
  const [selectedLang, setSelectedLang] = useState<SupportedLanguage | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<CamperLevel | 'all'>('all');
  const [selectedMode, setSelectedMode] = useState<GameMode | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [, setRefreshTick] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setIsRefreshing(true);
      fetchRemoteScores().finally(() => {
        setIsRefreshing(false);
        setRefreshTick(t => t + 1);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    fetchRemoteScores().finally(() => {
      setIsRefreshing(false);
      setRefreshTick(t => t + 1);
    });
  };

  const records: ScoreRecord[] = getFilteredLeaderboard(selectedLang, selectedLevel, selectedMode);

  const filteredRecords = records.filter(r =>
    r.camperName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.githubUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.campus.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top3 = filteredRecords.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-darker/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-brand-petroleum border-2 border-brand-cyan/60 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-brand-cyan/20 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-amber/20 border border-brand-amber/50 flex items-center justify-center text-brand-amber">
              <Trophy className="w-6 h-6 text-brand-amber" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <span>Ranking Oficial de Campers</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40">
                  Campuslands Git
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Récords oficiales sincronizados y validados por GitHub Actions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-xl bg-brand-surface hover:bg-brand-surfaceLight border border-brand-border text-slate-300 hover:text-white transition-all disabled:opacity-50"
              title="Actualizar tabla desde Git"
            >
              <RotateCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-brand-cyan' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-brand-surface hover:bg-brand-coral/20 border border-brand-border text-slate-400 hover:text-brand-coral transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 py-4 border-b border-brand-border/40">
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar camper o sede..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-darker border border-brand-border rounded-xl py-2 pl-9 pr-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-brand-cyan"
            />
          </div>

          {/* Language filter */}
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value as SupportedLanguage | 'all')}
            className="bg-brand-darker border border-brand-border rounded-xl py-2 px-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-cyan"
          >
            <option value="all">Todos los Lenguajes</option>
            {Object.entries(LANGUAGE_METADATA).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>

          {/* Level filter */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as CamperLevel | 'all')}
            className="bg-brand-darker border border-brand-border rounded-xl py-2 px-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-cyan"
          >
            <option value="all">Todos los Niveles</option>
            <option value="junior">Junior (Padawan)</option>
            <option value="mid">Mid (Explorer)</option>
            <option value="senior">Senior (Astronaut)</option>
          </select>

          {/* Mode filter */}
          <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value as GameMode | 'all')}
            className="bg-brand-darker border border-brand-border rounded-xl py-2 px-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-cyan"
          >
            <option value="all">Todos los Modos</option>
            <option value="sprint">Speed Sprint</option>
            <option value="blaster">Bug Blaster</option>
            <option value="shortcuts">Shortcuts Dojo</option>
            <option value="symbols">Symbol Storm</option>
          </select>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 py-4 pr-1 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
          {/* Top 3 Podium */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {top3.map((record, index) => {
                const colors = [
                  'from-brand-amber/30 to-brand-amber/5 border-brand-amber/60 text-brand-amber',
                  'from-slate-300/20 to-slate-400/5 border-slate-300/60 text-slate-200',
                  'from-amber-700/20 to-amber-900/5 border-amber-600/60 text-amber-500'
                ];
                const labels = ['1er Lugar', '2do Lugar', '3er Lugar'];

                return (
                  <div
                    key={record.id}
                    className={`bg-gradient-to-b ${colors[index]} border-2 rounded-2xl p-4 flex flex-col items-center text-center relative shadow-lg`}
                  >
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Medal className="w-3.5 h-3.5" />
                      <span>{labels[index]}</span>
                    </span>

                    <img
                      src={record.avatarUrl}
                      alt={record.camperName}
                      className="w-14 h-14 rounded-full border-2 border-white/50 object-cover shadow-md mb-2 flex-shrink-0"
                      style={{ width: '56px', height: '56px', minWidth: '56px', minHeight: '56px', borderRadius: '9999px', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://avatars.githubusercontent.com/u/104395015?v=4';
                      }}
                    />

                    <p className="font-bold text-white text-sm leading-tight">{record.camperName}</p>
                    <p className="text-xs text-brand-sky font-mono mt-0.5">@{record.githubUsername}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">{record.campus}</span>

                    <div className="mt-3 pt-3 border-t border-white/10 w-full flex items-center justify-around">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-mono">Velocidad</span>
                        <strong className="text-lg text-white font-mono font-black">{record.wpm} WPM</strong>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] text-slate-400 block font-mono">Lenguaje</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <LanguageIcon language={record.language} size={14} />
                          <span className="text-xs text-brand-sky font-mono font-bold">{LANGUAGE_METADATA[record.language]?.label}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-mono">Precisión</span>
                        <strong className="text-base text-brand-aqua font-mono font-black">{record.accuracy}%</strong>
                      </div>
                    </div>

                    {record.verifiedInGit && (
                      <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-brand-aqua/20 text-brand-aqua border border-brand-aqua/40">
                        <Check className="w-3 h-3" /> Git Verificado
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Remaining List Table */}
          <div className="bg-brand-darker/60 rounded-2xl border border-brand-border/60 overflow-hidden">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-brand-surface/60 text-slate-400 uppercase tracking-wider text-[10px] border-b border-brand-border/40">
                <tr>
                  <th className="py-2.5 px-4 text-center">Pos</th>
                  <th className="py-2.5 px-4">Camper</th>
                  <th className="py-2.5 px-4 hidden sm:table-cell">Sede Campus</th>
                  <th className="py-2.5 px-4 text-center">Lenguaje</th>
                  <th className="py-2.5 px-4 text-center">Estado Git</th>
                  <th className="py-2.5 px-4 text-center">WPM</th>
                  <th className="py-2.5 px-4 text-center">Precisión</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/30">
                {filteredRecords.map((r, i) => (
                  <tr key={r.id} className="hover:bg-brand-surface/40 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-400">
                      #{i + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={r.avatarUrl}
                          alt={r.camperName}
                          className="w-7 h-7 rounded-full object-cover border border-brand-border flex-shrink-0"
                          style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px', borderRadius: '9999px', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://avatars.githubusercontent.com/u/104395015?v=4';
                          }}
                        />
                        <div>
                          <p className="font-bold text-white text-xs">{r.camperName}</p>
                          <a
                            href={`https://github.com/${r.githubUsername}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-brand-sky hover:underline"
                          >
                            @{r.githubUsername}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 hidden sm:table-cell">
                      {r.campus}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-surface border border-brand-border/60 text-[10px] text-slate-300">
                        <LanguageIcon language={r.language} size={12} />
                        <span>{LANGUAGE_METADATA[r.language]?.label || r.language}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {r.verifiedInGit ? (
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-brand-aqua/15 text-brand-aqua border border-brand-aqua/30 font-bold">
                          <Check className="w-2.5 h-2.5" /> Git
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-brand-surface text-slate-400 border border-brand-border/50">
                          Local
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-brand-cyan text-sm">
                      {r.wpm}
                    </td>
                    <td className="py-3 px-4 text-center text-brand-aqua font-semibold">
                      {r.accuracy}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
