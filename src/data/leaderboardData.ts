import { ScoreRecord, SupportedLanguage, CamperLevel, GameMode } from '../types';

const INITIAL_CAMPUS_LEADERBOARD: ScoreRecord[] = [
  {
    id: 'rank-1',
    githubUsername: 'anndreloopez012',
    camperName: 'Andre Lopez',
    avatarUrl: 'https://avatars.githubusercontent.com/u/104395015?v=4',
    campus: 'Campuslands Guatemala',
    language: 'javascript',
    level: 'senior',
    mode: 'sprint',
    wpm: 104,
    cpm: 520,
    accuracy: 99.4,
    errors: 1,
    timeSeconds: 28,
    date: '2026-09-22'
  },
  {
    id: 'rank-2',
    githubUsername: 'valen-code-bga',
    camperName: 'Valentina Restrepo',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    campus: 'Campuslands Bucaramanga',
    language: 'typescript',
    level: 'senior',
    mode: 'sprint',
    wpm: 98,
    cpm: 490,
    accuracy: 98.7,
    errors: 2,
    timeSeconds: 32,
    date: '2026-09-21'
  },
  {
    id: 'rank-3',
    githubUsername: 'mateo-dev-mde',
    camperName: 'Mateo Osorio',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    campus: 'Campuslands Medellín',
    language: 'python',
    level: 'mid',
    mode: 'sprint',
    wpm: 92,
    cpm: 460,
    accuracy: 99.1,
    errors: 1,
    timeSeconds: 35,
    date: '2026-09-20'
  },
  {
    id: 'rank-4',
    githubUsername: 'camilo-rust-cali',
    camperName: 'Camilo Benítez',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    campus: 'Campuslands Cali',
    language: 'rust',
    level: 'senior',
    mode: 'blaster',
    wpm: 89,
    cpm: 445,
    accuracy: 97.9,
    errors: 3,
    timeSeconds: 40,
    date: '2026-09-19'
  },
  {
    id: 'rank-5',
    githubUsername: 'sofia-java-bga',
    camperName: 'Sofía Calderón',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    campus: 'Campuslands Bucaramanga',
    language: 'java',
    level: 'mid',
    mode: 'shortcuts',
    wpm: 86,
    cpm: 430,
    accuracy: 100,
    errors: 0,
    timeSeconds: 42,
    date: '2026-09-18'
  },
  {
    id: 'rank-6',
    githubUsername: 'daniel-go-gua',
    camperName: 'Daniel Asturias',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    campus: 'Campuslands Guatemala',
    language: 'go',
    level: 'junior',
    mode: 'sprint',
    wpm: 78,
    cpm: 390,
    accuracy: 96.5,
    errors: 4,
    timeSeconds: 45,
    date: '2026-09-17'
  }
];

const STORAGE_KEY = 'campuslands_devtype_leaderboard_v1';

export function getLeaderboard(): ScoreRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CAMPUS_LEADERBOARD));
      return INITIAL_CAMPUS_LEADERBOARD;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CAMPUS_LEADERBOARD;
  }
}

export function saveScore(record: Omit<ScoreRecord, 'id' | 'date'>): ScoreRecord {
  const current = getLeaderboard();
  const newRecord: ScoreRecord = {
    ...record,
    id: 'score-' + Date.now(),
    date: new Date().toISOString().split('T')[0]
  };

  const updated = [newRecord, ...current].sort((a, b) => {
    // Sort by WPM descending, then accuracy descending
    if (b.wpm !== a.wpm) return b.wpm - a.wpm;
    return b.accuracy - a.accuracy;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 100)));
  } catch (err) {
    console.error('Error guardando en localStorage:', err);
  }

  return newRecord;
}

export function getFilteredLeaderboard(
  language?: SupportedLanguage | 'all',
  level?: CamperLevel | 'all',
  mode?: GameMode | 'all'
): ScoreRecord[] {
  const records = getLeaderboard();
  return records.filter(r => {
    if (language && language !== 'all' && r.language !== language) return false;
    if (level && level !== 'all' && r.level !== level) return false;
    if (mode && mode !== 'all' && r.mode !== mode) return false;
    return true;
  });
}
