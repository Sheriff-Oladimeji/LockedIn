'use client';

import TimerDisplay from '@/components/TimerDisplay';
import ProgressTracker from '@/components/ProgressTracker';
import SettingsDialog from '@/components/SettingsDialog';
import { Button } from '@/components/ui/button';
import { Settings2 } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">LockIn</h1>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
            >
              <Settings2 className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <TimerDisplay />
          </div>
          <ProgressTracker />
        </div>

        <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
      </div>
    </main>
  );
}