import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { LevelSelector } from './components/LevelSelector';
import { CodeSprintGame } from './components/CodeSprintGame';
import { BugBlasterGame } from './components/BugBlasterGame';
import { ShortcutDojoGame } from './components/ShortcutDojoGame';
import { SymbolStormGame } from './components/SymbolStormGame';
import { CamperProfileCard } from './components/CamperProfileCard';
import { LeaderboardModal } from './components/LeaderboardModal';
import { ResultsModal } from './components/ResultsModal';
import { useGitHubUser } from './hooks/useGitHubUser';
import { SupportedLanguage, CamperLevel, GameMode, SwitchProfile, WpmSample } from './types';
import { CODE_SNIPPETS } from './data/codeSnippets';
import { fetchRemoteScores } from './data/leaderboardData';

export function App() {
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [level, setLevel] = useState<CamperLevel>('junior');
  const [mode, setMode] = useState<GameMode>('sprint');
  const [vsCodeShortcutCheck, setVsCodeShortcutCheck] = useState<boolean>(false);
  const [switchProfile, setSwitchProfile] = useState<SwitchProfile>('thocky');
  const [snippetIndex, setSnippetIndex] = useState<number>(0);

  // Modals
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [resultsStats, setResultsStats] = useState<{
    isOpen: boolean;
    wpm: number;
    cpm: number;
    accuracy: number;
    errors: number;
    timeSeconds: number;
    wpmHistory: WpmSample[];
  }>({
    isOpen: false,
    wpm: 0,
    cpm: 0,
    accuracy: 100,
    errors: 0,
    timeSeconds: 0,
    wpmHistory: []
  });

  const {
    user,
    fetchGitHubProfile,
    updateBadgeByWpm,
    isLoading: userLoading,
    error: userError
  } = useGitHubUser();

  useEffect(() => {
    fetchRemoteScores();
  }, []);

  // Filter snippets matching current language and level
  const availableSnippets = useMemo(() => {
    const matched = CODE_SNIPPETS.filter(
      s => s.language === language && s.level === level
    );
    return matched.length > 0 ? matched : CODE_SNIPPETS.filter(s => s.language === language);
  }, [language, level]);

  const currentSnippet = availableSnippets[snippetIndex % availableSnippets.length] || CODE_SNIPPETS[0];

  const handleNextSnippet = () => {
    setSnippetIndex(prev => (prev + 1) % availableSnippets.length);
  };

  const handleFinishGame = (stats: {
    wpm: number;
    cpm: number;
    accuracy: number;
    errors: number;
    timeSeconds: number;
    wpmHistory: WpmSample[];
  }) => {
    updateBadgeByWpm(stats.wpm);
    setResultsStats({
      isOpen: true,
      ...stats
    });
  };

  return (
    <div className="min-h-screen bg-brand-darker bg-starfield flex flex-col justify-between selection:bg-brand-cyan selection:text-brand-darker">
      {/* Top Header */}
      <Header
        currentProfile={switchProfile}
        onProfileChange={setSwitchProfile}
        user={user}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        currentMode={mode}
        onModeChange={setMode}
        vsCodeShortcutCheck={vsCodeShortcutCheck}
        onToggleShortcutCheck={setVsCodeShortcutCheck}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 items-center">
        {/* Subheader bar: Language & Level Selectors (only for sprint and blaster) */}
        {['sprint', 'blaster'].includes(mode) && (
          <div className="w-full max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-brand-petroleum/60 p-4 rounded-2xl border border-brand-border/40 backdrop-blur-sm">
            <div className="w-full sm:flex-1">
              <LanguageSelector
                currentLanguage={language}
                onSelectLanguage={(lang) => {
                  setLanguage(lang);
                  setSnippetIndex(0);
                }}
              />
            </div>

            {mode === 'sprint' && (
              <div className="flex-shrink-0 self-start sm:self-center">
                <LevelSelector
                  currentLevel={level}
                  onSelectLevel={(lvl) => {
                    setLevel(lvl);
                    setSnippetIndex(0);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Active Game Mode */}
        {mode === 'sprint' && (
          <CodeSprintGame
            snippet={currentSnippet}
            onNextSnippet={handleNextSnippet}
            onFinishGame={handleFinishGame}
          />
        )}

        {mode === 'blaster' && (
          <BugBlasterGame
            language={language}
            onFinishGame={(score) => {
              handleFinishGame({
                wpm: Math.round(score / 15),
                cpm: score,
                accuracy: 98,
                errors: 0,
                timeSeconds: 45,
                wpmHistory: []
              });
            }}
          />
        )}

        {mode === 'shortcuts' && (
          <ShortcutDojoGame
            onFinishDojo={(score) => {
              handleFinishGame({
                wpm: Math.round(score / 12),
                cpm: score,
                accuracy: 100,
                errors: 0,
                timeSeconds: 30,
                wpmHistory: []
              });
            }}
          />
        )}

        {mode === 'symbols' && (
          <SymbolStormGame
            onFinish={(score) => {
              handleFinishGame({
                wpm: Math.round(score / 10),
                cpm: score,
                accuracy: 99,
                errors: 1,
                timeSeconds: 30,
                wpmHistory: []
              });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-brand-border/60 bg-brand-petroleum/90 py-6 mt-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-cyan"></span>
            <span>Campuslands DevType &copy; {new Date().getFullYear()} — Diseñado con amor para Campers</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsLeaderboardOpen(true)}
              className="hover:text-brand-sky transition-colors cursor-pointer"
            >
              Tabla de Clasificación
            </button>
            <span>•</span>
            <button
              onClick={() => setIsProfileOpen(true)}
              className="hover:text-brand-aqua transition-colors cursor-pointer"
            >
              Vincular GitHub
            </button>
            <span>•</span>
            <a
              href="https://campuslands.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              campuslands.com
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CamperProfileCard
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdateUsername={fetchGitHubProfile}
        isLoading={userLoading}
        error={userError}
      />

      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
      />

      <ResultsModal
        isOpen={resultsStats.isOpen}
        onClose={() => setResultsStats(prev => ({ ...prev, isOpen: false }))}
        onPlayAgain={handleNextSnippet}
        stats={resultsStats}
        language={language}
        level={level}
        mode={mode}
        user={user}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />
    </div>
  );
}

export default App;
