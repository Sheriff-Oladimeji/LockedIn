'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Square } from 'lucide-react';
import useTimer from '@/hooks/useTimer';

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};

export default function TimerDisplay() {
  const { currentSession, settings, startTimer, pauseTimer, resetTimer, stopTimer, toggleMode } =
    useTimer();

  const progress =
    ((currentSession.mode === 'work'
      ? settings.workDuration
      : settings.restDuration) -
      currentSession.timeRemaining) /
    (currentSession.mode === 'work'
      ? settings.workDuration
      : settings.restDuration) *
    100;

  return (
    <Card className="w-full max-w-md p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Button
          variant={currentSession.mode === 'work' ? 'default' : 'outline'}
          onClick={() => currentSession.mode === 'rest' && !currentSession.isActive && toggleMode()}
          disabled={currentSession.isActive}
        >
          Work
        </Button>
        <Button
          variant={currentSession.mode === 'rest' ? 'default' : 'outline'}
          onClick={() => currentSession.mode === 'work' && !currentSession.isActive && toggleMode()}
          disabled={currentSession.isActive}
        >
          Rest
        </Button>
      </div>

      <div className="text-center">
        <h2 className="text-7xl font-mono tracking-wider">
          {formatTime(currentSession.timeRemaining)}
        </h2>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          disabled={currentSession.isActive}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          onClick={currentSession.isActive ? pauseTimer : startTimer}
        >
          {currentSession.isActive ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        {currentSession.isActive && (
          <Button
            variant="destructive"
            size="icon"
            onClick={stopTimer}
          >
            <Square className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}