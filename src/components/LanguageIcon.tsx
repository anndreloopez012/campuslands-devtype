import React from 'react';
import { SupportedLanguage } from '../types';
import {
  SiJavascript,
  SiTypescript,
  SiPython,
  SiPhp,
  SiGo,
  SiRust,
  SiPostgresql,
  SiHtml5
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa6';
import { TbBrandCSharp } from 'react-icons/tb';

interface LanguageIconProps {
  language: SupportedLanguage;
  className?: string;
  size?: number;
}

export const LanguageIcon: React.FC<LanguageIconProps> = ({
  language,
  className = 'w-4 h-4',
  size = 16
}) => {
  switch (language) {
    case 'javascript':
      return <SiJavascript className={`${className} text-[#F7DF1E] flex-shrink-0`} size={size} title="JavaScript Oficial" />;
    case 'typescript':
      return <SiTypescript className={`${className} text-[#3178C6] flex-shrink-0`} size={size} title="TypeScript Oficial" />;
    case 'python':
      return <SiPython className={`${className} text-[#3776AB] flex-shrink-0`} size={size} title="Python Oficial" />;
    case 'java':
      return <FaJava className={`${className} text-[#ED8B00] flex-shrink-0`} size={size} title="Java Oficial" />;
    case 'csharp':
      return <TbBrandCSharp className={`${className} text-[#68217A] flex-shrink-0`} size={size} title="C# Oficial" />;
    case 'php':
      return <SiPhp className={`${className} text-[#777BB4] flex-shrink-0`} size={size} title="PHP Oficial" />;
    case 'go':
      return <SiGo className={`${className} text-[#00ADD8] flex-shrink-0`} size={size} title="Go Oficial" />;
    case 'rust':
      return <SiRust className={`${className} text-[#DEA584] flex-shrink-0`} size={size} title="Rust Oficial" />;
    case 'sql':
      return <SiPostgresql className={`${className} text-[#336791] flex-shrink-0`} size={size} title="SQL / PostgreSQL Oficial" />;
    case 'html_css':
      return <SiHtml5 className={`${className} text-[#E34F26] flex-shrink-0`} size={size} title="HTML5 & CSS3 Oficial" />;
    default:
      return null;
  }
};
