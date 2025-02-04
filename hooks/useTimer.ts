'use client';

import { useEffect, useCallback } from 'react';
import useStore from '@/lib/store';

export const useTimer = () => {
  const {
    currentSession,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleMode,
    tick,
    addSession,
    stopTimer,
  } = useStore();

  const handleTimerComplete = useCallback(() => {
    if (currentSession.timeRemaining === 0 && currentSession.isActive) {
      pauseTimer();
      addSession({
        duration:
          currentSession.mode === 'work'
            ? settings.workDuration
            : settings.restDuration,
        timestamp: Date.now(),
        type: currentSession.mode,
      });

      // Request notification permission and show notification
      if (typeof window !== 'undefined' && 'Notification' in window) {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(
              `${currentSession.mode === 'work' ? 'Work' : 'Rest'} session complete!`
            );
          }
        });
      }
    }
  }, [
    currentSession.timeRemaining,
    currentSession.isActive,
    currentSession.mode,
    settings.workDuration,
    settings.restDuration,
    pauseTimer,
    addSession,
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (currentSession.isActive && currentSession.timeRemaining > 0) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [currentSession.isActive, currentSession.timeRemaining, tick]);

  useEffect(() => {
    handleTimerComplete();
  }, [currentSession.timeRemaining, handleTimerComplete]);

  return {
    currentSession,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    toggleMode,
    stopTimer,
  };
};

export default useTimer;