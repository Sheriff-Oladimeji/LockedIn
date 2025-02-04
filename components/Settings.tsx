'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useStore from '@/lib/store';
import { useState } from 'react';

export default function Settings() {
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
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Customize your work and rest session durations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
    </Card>
  );
}