import React from 'react';

interface VirtualKeyboardProps {
  expectedChar?: string;
  lastPressedChar?: string;
  isError?: boolean;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  expectedChar = '',
  lastPressedChar = '',
  isError = false
}) => {
  const rows = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['Caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Alt', 'Cmd', 'Space', 'Cmd', 'Alt', 'Ctrl']
  ];

  const normalizeKey = (char: string) => {
    if (!char) return '';
    if (char === ' ') return 'Space';
    if (char === '\n') return 'Enter';
    return char.toLowerCase();
  };

  const normExpected = normalizeKey(expectedChar);
  const normPressed = normalizeKey(lastPressedChar);

  return (
    <div className="w-full max-w-4xl mx-auto bg-brand-petroleum/60 p-3 rounded-2xl border border-brand-border/40 backdrop-blur-sm select-none shadow-xl">
      <div className="flex flex-col gap-1.5 font-mono text-xs">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1.5 w-full">
            {row.map((keyVal, kIdx) => {
              const lowerKey = keyVal.toLowerCase();
              const isTarget = normExpected === lowerKey;
              const isPressed = normPressed === lowerKey;

              let widthClass = 'w-9 sm:w-11';
              if (['Backspace', 'Enter', 'Shift', 'Caps', 'Tab'].includes(keyVal)) {
                widthClass = 'w-16 sm:w-20';
              } else if (keyVal === 'Space') {
                widthClass = 'flex-1 max-w-xs';
              } else if (['Ctrl', 'Alt', 'Cmd'].includes(keyVal)) {
                widthClass = 'w-12 sm:w-14';
              }

              return (
                <div
                  key={`${rIdx}-${kIdx}`}
                  className={`h-8 sm:h-9 flex items-center justify-center rounded-lg border text-[11px] font-semibold transition-all duration-75 ${widthClass} ${
                    isTarget
                      ? 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-md shadow-brand-cyan/40 scale-105 animate-pulse'
                      : isPressed
                      ? isError
                        ? 'bg-brand-coral/30 border-brand-coral text-white scale-95'
                        : 'bg-brand-aqua/30 border-brand-aqua text-white scale-95'
                      : 'bg-brand-darker/70 border-brand-border/40 text-slate-400'
                  }`}
                >
                  {keyVal === 'Space' ? '—' : keyVal}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
