import { ScoreRecord, SupportedLanguage, CamperLevel, GameMode } from '../types';

const STORAGE_KEY = 'campuslands_devtype_leaderboard_v1';
const REPO_OWNER = 'anndreloopez012';
const REPO_NAME = 'campuslands-devtype';

const INITIAL_FALLBACK_SCORES: ScoreRecord[] = [
  {
    id: 'score-git-1',
    githubUsername: 'anndreloopez012',
    camperName: 'Andre Lopez',
    avatarUrl: 'https://avatars.githubusercontent.com/u/104395015?v=4',
    campus: 'Campuslands Guatemala',
    language: 'javascript',
    level: 'senior',
    mode: 'sprint',
    wpm: 112,
    cpm: 560,
    accuracy: 99.8,
    errors: 1,
    timeSeconds: 26,
    date: '2026-09-22',
    verifiedInGit: true
  },
  {
    id: 'score-git-2',
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
    date: '2026-09-21',
    verifiedInGit: true
  },
  {
    id: 'score-git-3',
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
    date: '2026-09-20',
    verifiedInGit: true
  }
];

export async function fetchRemoteScores(): Promise<ScoreRecord[]> {
  try {
    // Attempt to load from relative public/scores.json with cache buster
    const localRes = await fetch(`./scores.json?t=${Date.now()}`, { cache: 'no-store' });
    if (localRes.ok) {
      const data = await localRes.json();
      if (Array.isArray(data) && data.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    }
  } catch {
    // Fallback to raw GitHub if relative path fails
    try {
      const gitRawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/public/scores.json?t=${Date.now()}`;
      const rawRes = await fetch(gitRawUrl, { cache: 'no-store' });
      if (rawRes.ok) {
        const data = await rawRes.json();
        if (Array.isArray(data) && data.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
          return data;
        }
      }
    } catch {
      // Fallback to local storage or defaults
    }
  }

  return getLeaderboard();
}

export function getLeaderboard(): ScoreRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_FALLBACK_SCORES));
      return INITIAL_FALLBACK_SCORES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_FALLBACK_SCORES;
  }
}

export function saveScore(record: Omit<ScoreRecord, 'id' | 'date'>): ScoreRecord {
  const current = getLeaderboard();
  const newRecord: ScoreRecord = {
    ...record,
    id: 'score-local-' + Date.now(),
    date: new Date().toISOString().split('T')[0],
    verifiedInGit: false
  };

  const updated = [newRecord, ...current.filter(c => c.id !== newRecord.id)].sort((a, b) => {
    if (b.wpm !== a.wpm) return b.wpm - a.wpm;
    return b.accuracy - a.accuracy;
  });

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 150)));
  } catch (err) {
    console.error('Error guardando en localStorage:', err);
  }

  return newRecord;
}

export function generateGitIssuePayload(record: Omit<ScoreRecord, 'id' | 'date'>) {
  const payload = {
    githubUsername: record.githubUsername,
    camperName: record.camperName,
    avatarUrl: record.avatarUrl,
    campus: record.campus || 'Campuslands',
    language: record.language,
    level: record.level,
    mode: record.mode,
    wpm: record.wpm,
    cpm: record.cpm,
    accuracy: record.accuracy,
    errors: record.errors,
    timeSeconds: record.timeSeconds
  };

  const title = `[SCORE] ${record.githubUsername} - ${record.wpm} WPM (${record.language})`;
  const body = `### 🏆 Solicitud de Registro de Score Oficial en Git

Un camper ha completado una prueba verificada en Campuslands DevType.

\`\`\`json
${JSON.stringify(payload, null, 2)}
\`\`\`

> *Este Issue es procesado y validado automáticamente por el workflow de GitHub Actions \`record-score.yml\` para incorporar el récord en \`public/scores.json\`.*`;

  return { title, body };
}

export function getGitIssueSubmissionUrl(record: Omit<ScoreRecord, 'id' | 'date'>): string {
  const { title, body } = generateGitIssuePayload(record);
  return `https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=score-submission`;
}

export async function submitScoreViaGitHubApi(
  record: Omit<ScoreRecord, 'id' | 'date'>,
  token?: string
): Promise<{ success: boolean; issueUrl?: string; error?: string }> {
  const { title, body } = generateGitIssuePayload(record);

  if (!token) {
    return {
      success: false,
      error: 'Token de GitHub no provisto'
    };
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        body,
        labels: ['score-submission']
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      return { success: false, error: errData.message || 'Error al comunicarse con GitHub API' };
    }

    const data = await res.json();
    return { success: true, issueUrl: data.html_url };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error inesperado';
    return { success: false, error: msg };
  }
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
