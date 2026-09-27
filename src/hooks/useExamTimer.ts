/**
 * Exam Countdown Timer Hook
 * Provides synchronized countdown, formatting, and auto-submission trigger.
 */

import { useState, useEffect, useRef } from 'react';

interface UseExamTimerProps {
  initialMinutes: number;
  onTimeExpired: () => void;
  isRunning?: boolean;
}

export function useExamTimer({ initialMinutes, onTimeExpired, isRunning = true }: UseExamTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialMinutes * 60);
  const onTimeExpiredRef = useRef(onTimeExpired);
  onTimeExpiredRef.current = onTimeExpired;

  useEffect(() => {
    if (!isRunning || secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeExpiredRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining]);

  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;

  const formattedTime = [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');

  const isLowTime = secondsRemaining <= 300 && secondsRemaining > 0; // last 5 minutes

  return {
    secondsRemaining,
    formattedTime,
    isLowTime,
    isExpired: secondsRemaining === 0,
  };
}
