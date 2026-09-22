import React from 'react';
import { CamperLevel } from '../types';
import { LEVEL_METADATA } from '../data/codeSnippets';

interface LevelSelectorProps {
  currentLevel: CamperLevel;
  onSelectLevel: (lvl: CamperLevel) => void;
}

export const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  onSelectLevel
}) => {
  const levels: CamperLevel[] = ['junior', 'mid', 'senior'];

  return (
    <div id="tour-level-selector" className="flex items-center gap-1.5 bg-brand-darker/80 p-1 rounded-xl border border-brand-border/60">
      {levels.map((lvl) => {
        const meta = LEVEL_METADATA[lvl];
        const isSelected = currentLevel === lvl;

        return (
          <button
            key={lvl}
            onClick={() => onSelectLevel(lvl)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isSelected
                ? 'bg-gradient-to-r from-brand-deep to-brand-blue text-white shadow-md shadow-brand-blue/30 scale-102 border border-brand-cyan/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-brand-surface'
            }`}
            title={meta.description}
          >
            <span>{meta.badge.split(' ')[0]}</span>
            <span className="capitalize">{lvl}</span>
          </button>
        );
      })}
    </div>
  );
};
