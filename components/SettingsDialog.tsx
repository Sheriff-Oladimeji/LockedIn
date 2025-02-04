'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useStore from '@/lib/store';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, updateSettings } = useStore();
  const [workMinutes, setWorkMinutes] = useState(
    Math.floor(settings.workDuration / 60)
  );
  const [restMinutes, setRestMinutes] = useState(
    Math.floor(settings.restDuration / 60)
  );

  const handleSave = () => {
    updateSettings({
      workDuration: workMinutes * 60,
      restDuration: restMinutes * 60,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Customize your work and rest session durations
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="workDuration">Work Duration (minutes)</Label>
            <Input
              id="workDuration"
              type="number"
              min="1"
              value={workMinutes}
              onChange={(e) => setWorkMinutes(parseInt(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="restDuration">Rest Duration (minutes)</Label>
            <Input
              id="restDuration"
              type="number"
              min="1"
              value={restMinutes}
              onChange={(e) => setRestMinutes(parseInt(e.target.value))}
            />
          </div>
          <Button className="w-full" onClick={handleSave}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}