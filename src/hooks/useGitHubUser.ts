import { useState, useEffect } from 'react';
import { GitHubUser } from '../types';

const USER_STORAGE_KEY = 'campuslands_devtype_github_user';

const DEFAULT_USER: GitHubUser = {
  username: 'camper-campuslands',
  name: 'Camper Astronauta',
  avatarUrl: 'https://avatars.githubusercontent.com/u/104395015?v=4',
  bio: 'Estudiante apasionado en Campuslands aprendiendo a programar con superpoderes de tipeo.',
  publicRepos: 12,
  rankBadge: 'Camper Astronauta'
};

export function useGitHubUser() {
  const [user, setUser] = useState<GitHubUser>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Error guardando usuario:', e);
    }
  }, [user]);

  const fetchGitHubProfile = async (username: string) => {
    const cleanUser = username.trim().replace(/^@/, '');
    if (!cleanUser) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`https://api.github.com/users/${cleanUser}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Usuario de GitHub no encontrado');
        } else {
          // Rate limit or other error, fallback to avatar URL directly
          const fallbackUser: GitHubUser = {
            username: cleanUser,
            name: cleanUser,
            avatarUrl: `https://avatars.githubusercontent.com/${cleanUser}`,
            bio: 'Camper de Campuslands',
            publicRepos: 0,
            rankBadge: 'Camper Padawan'
          };
          setUser(fallbackUser);
          setIsLoading(false);
          return;
        }
      }

      const data = await res.json();
      const updatedUser: GitHubUser = {
        username: data.login,
        name: data.name || data.login,
        avatarUrl: data.avatar_url,
        bio: data.bio || 'Camper de Campuslands explorando el universo del código',
        publicRepos: data.public_repos ?? 0,
        rankBadge: 'Camper Astronauta'
      };

      setUser(updatedUser);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con GitHub';
      setError(msg);
      // Still set the username with github avatar URL so student can play
      setUser(prev => ({
        ...prev,
        username: cleanUser,
        avatarUrl: `https://avatars.githubusercontent.com/${cleanUser}`
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const updateBadgeByWpm = (wpm: number) => {
    let badge = 'Camper Padawan (Junior)';
    if (wpm >= 95) badge = 'Alien Hacker (Legendary)';
    else if (wpm >= 75) badge = 'Astronauta Senior';
    else if (wpm >= 50) badge = 'Camper Explorer (Mid)';

    setUser(prev => ({ ...prev, rankBadge: badge }));
  };

  return {
    user,
    setUser,
    fetchGitHubProfile,
    updateBadgeByWpm,
    isLoading,
    error
  };
}
