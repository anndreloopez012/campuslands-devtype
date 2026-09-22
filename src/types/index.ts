export type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'csharp'
  | 'php'
  | 'go'
  | 'rust'
  | 'sql'
  | 'html_css';

export type CamperLevel = 'junior' | 'mid' | 'senior';

export type GameMode = 'sprint' | 'blaster' | 'shortcuts' | 'symbols';

export type SwitchProfile = 'clicky' | 'thocky' | 'cream' | 'arcade' | 'mute';

export interface GitHubUser {
  username: string;
  name: string;
  avatarUrl: string;
  bio?: string;
  publicRepos?: number;
  rankBadge?: string;
}

export interface ScoreRecord {
  id: string;
  githubUsername: string;
  camperName: string;
  avatarUrl: string;
  campus: string;
  language: SupportedLanguage;
  level: CamperLevel;
  mode: GameMode;
  wpm: number;
  cpm: number;
  accuracy: number;
  errors: number;
  timeSeconds: number;
  date: string;
}

export interface SnippetItem {
  id: string;
  language: SupportedLanguage;
  level: CamperLevel;
  title: string;
  code: string;
  description: string;
}

export interface ShortcutItem {
  id: string;
  name: string;
  description: string;
  macKeys: string[];
  winKeys: string[];
  category: 'editing' | 'navigation' | 'selection' | 'terminal';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface WpmSample {
  second: number;
  wpm: number;
  accuracy: number;
}
