import React from 'react';
import { SupportedLanguage } from '../types';
import { LANGUAGE_METADATA } from '../data/codeSnippets';
import { LanguageIcon } from './LanguageIcon';

interface LanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage
}) => {
  const languages = Object.keys(LANGUAGE_METADATA) as SupportedLanguage[];

  return (
    <div id="tour-language-selector" className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-cyan"></span>
          Lenguaje de Programación
        </span>
        <span className="text-[11px] text-brand-sky font-mono hidden sm:inline flex items-center gap-1.5">
          <LanguageIcon language={currentLanguage} size={14} />
          <span>{LANGUAGE_METADATA[currentLanguage].label} seleccionado</span>
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent">
        {languages.map((lang) => {
          const meta = LANGUAGE_METADATA[lang];
          const isSelected = currentLanguage === lang;

          return (
            <button
              key={lang}
              onClick={() => onSelectLanguage(lang)}
              className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                isSelected
                  ? 'bg-brand-surfaceLight border-brand-cyan text-white shadow-lg shadow-brand-cyan/20 scale-105'
                  : 'bg-brand-darker/80 border-brand-border/60 text-slate-300 hover:border-brand-sky/50 hover:bg-brand-surface'
              }`}
            >
              <LanguageIcon language={lang} size={16} />
              <span>{meta.label}</span>
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-aqua animate-pulse"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
