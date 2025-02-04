'use client';

import { Card } from '@/components/ui/card';
import useStore from '@/lib/store';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ProgressTracker() {
  const { dailyProgress } = useStore();

  const getTotalWorkMinutes = () => {
    return dailyProgress.reduce((total, day) => {
      const workMinutes = day.sessions
        .filter((session) => session.type === 'work')
        .reduce((acc, session) => acc + session.duration / 60, 0);
      return total + workMinutes;
    }, 0);
  };

  const getIntensityColor = (minutes: number) => {
    if (minutes === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (minutes < 30) return 'bg-green-200 dark:bg-green-900';
    if (minutes < 60) return 'bg-green-400 dark:bg-green-700';
    if (minutes < 120) return 'bg-green-600 dark:bg-green-500';
    return 'bg-green-800 dark:bg-green-300';
  };

  const formatHours = (minutes: number) => {
    const hours = minutes / 60;
    return hours.toFixed(1);
  };

  const getDailyMinutes = (date: string) => {
    const day = dailyProgress.find((d) => d.date === date);
    if (!day) return 0;
    return day.sessions
      .filter((session) => session.type === 'work')
      .reduce((acc, session) => acc + session.duration / 60, 0);
  };

  const getDailySessions = (date: string) => {
    const day = dailyProgress.find((d) => d.date === date);
    if (!day) return [];
    return day.sessions.filter((session) => session.type === 'work');
  };

  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  return (
    <Card className="p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-4">Progress Tracker</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-1">
          <TooltipProvider>
            {last30Days.map((date) => {
              const minutes = getDailyMinutes(date);
              const sessions = getDailySessions(date);
              return (
                <Tooltip key={date}>
                  <TooltipTrigger>
                    <div
                      className={`aspect-square rounded-sm ${getIntensityColor(
                        minutes
                      )}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="space-y-2">
                      <p className="font-semibold">{format(new Date(date), 'MMM d, yyyy')}</p>
                      <p>{formatHours(minutes)} hours</p>
                      {sessions.map((session, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          {format(new Date(session.timestamp), 'h:mm a')}: {(session.duration / 3600).toFixed(1)}h
                        </p>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm" />
            <div className="w-3 h-3 bg-green-200 dark:bg-green-900 rounded-sm" />
            <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded-sm" />
            <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm" />
            <div className="w-3 h-3 bg-green-800 dark:bg-green-300 rounded-sm" />
          </div>
          <span>More</span>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">
            {formatHours(getTotalWorkMinutes())} hours
          </p>
          <p className="text-sm text-gray-500">Total deep work time</p>
        </div>
      </div>
    </Card>
  );
}