import { useState, useEffect, useRef, useCallback } from 'react';
import { soundEngine } from '../audio/soundEngine';
import { WpmSample } from '../types';

interface UseTypingEngineProps {
  targetCode: string;
  onFinish?: (stats: {
    wpm: number;
    cpm: number;
    accuracy: number;
    errors: number;
    timeSeconds: number;
    wpmHistory: WpmSample[];
  }) => void;
}

export function useTypingEngine({ targetCode, onFinish }: UseTypingEngineProps) {
  const [typed, setTyped] = useState<string>('');
  const [errors, setErrors] = useState<number>(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [wpmHistory, setWpmHistory] = useState<WpmSample[]>([]);
  const [combo, setCombo] = useState<number>(0);

  const timerRef = useRef<number | null>(null);
  const finishTriggered = useRef<boolean>(false);

  // Reset when targetCode changes
  const reset = useCallback(() => {
    setTyped('');
    setErrors(0);
    setTotalKeystrokes(0);
    setStartTime(null);
    setElapsedTime(0);
    setIsCompleted(false);
    setWpmHistory([]);
    setCombo(0);
    soundEngine.resetCombo();
    finishTriggered.current = false;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    reset();
  }, [targetCode, reset]);

  // Timer effect for real-time WPM calculation and tracking
  useEffect(() => {
    if (startTime && !isCompleted) {
      timerRef.current = window.setInterval(() => {
        const now = Date.now();
        const seconds = Math.max(1, (now - startTime) / 1000);
        setElapsedTime(seconds);

        // Record WPM sample every second
        const correctChars = typed.length;
        const currentWpm = Math.round((correctChars / 5) / (seconds / 60)) || 0;
        const currentAcc = totalKeystrokes > 0 ? Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100) : 100;

        setWpmHistory(prev => {
          const secInt = Math.floor(seconds);
          if (prev.length === 0 || prev[prev.length - 1].second !== secInt) {
            return [...prev, { second: secInt, wpm: currentWpm, accuracy: currentAcc }];
          }
          return prev;
        });
      }, 250);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime, isCompleted, typed.length, totalKeystrokes, errors]);

  // Handle Key Press
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isCompleted) return;

    // Ignore modifiers
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
      if (e.key === 'Tab') {
        e.preventDefault(); // prevent losing focus
      }
      return;
    }

    // Start timer on first keystroke
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      setTyped(prev => prev.slice(0, -1));
      soundEngine.playKeypress();
      return;
    }

    const currentIndex = typed.length;
    if (currentIndex >= targetCode.length) return;

    let inputChar = e.key;

    // Handle Enter
    if (e.key === 'Enter') {
      inputChar = '\n';
    }

    // Only process 1 character length
    if (inputChar.length !== 1) return;

    e.preventDefault();
    setTotalKeystrokes(prev => prev + 1);

    const expectedChar = targetCode[currentIndex];

    if (inputChar === expectedChar) {
      // Correct character
      soundEngine.playKeypress();
      const currentStreak = soundEngine.incrementCombo();
      setCombo(currentStreak);

      let nextTyped = typed + inputChar;

      // Smart indentation skip: If user pressed Enter and next chars are spaces/indentation, auto-fill them
      if (inputChar === '\n') {
        let skipCount = 0;
        while (
          currentIndex + 1 + skipCount < targetCode.length &&
          targetCode[currentIndex + 1 + skipCount] === ' '
        ) {
          skipCount++;
        }
        if (skipCount > 0) {
          nextTyped += ' '.repeat(skipCount);
        }
      }

      setTyped(nextTyped);

      // Check if finished
      if (nextTyped.length >= targetCode.length) {
        setIsCompleted(true);
        soundEngine.playVictory();
        if (timerRef.current) clearInterval(timerRef.current);

        const now = Date.now();
        const durationSeconds = Math.max(1, (now - (startTime || now)) / 1000);
        const finalWpm = Math.round((nextTyped.length / 5) / (durationSeconds / 60)) || 0;
        const finalCpm = Math.round(nextTyped.length / (durationSeconds / 60)) || 0;
        const total = totalKeystrokes + 1;
        const finalAcc = Math.max(0, Math.min(100, Math.round(((total - errors) / total) * 100)));

        if (!finishTriggered.current && onFinish) {
          finishTriggered.current = true;
          onFinish({
            wpm: finalWpm,
            cpm: finalCpm,
            accuracy: finalAcc,
            errors,
            timeSeconds: Math.round(durationSeconds),
            wpmHistory
          });
        }
      }
    } else {
      // Mistake
      soundEngine.playError();
      soundEngine.resetCombo();
      setCombo(0);
      setErrors(prev => prev + 1);
    }
  }, [isCompleted, startTime, typed, targetCode, totalKeystrokes, errors, onFinish, wpmHistory]);

  const durationMin = elapsedTime > 0 ? elapsedTime / 60 : 0.001;
  const currentWpm = Math.round((typed.length / 5) / durationMin) || 0;
  const currentCpm = Math.round(typed.length / durationMin) || 0;
  const currentAccuracy = totalKeystrokes > 0
    ? Math.max(0, Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100))
    : 100;

  return {
    typed,
    errors,
    totalKeystrokes,
    elapsedTime,
    isCompleted,
    currentWpm,
    currentCpm,
    currentAccuracy,
    combo,
    wpmHistory,
    handleKeyDown,
    reset
  };
}
