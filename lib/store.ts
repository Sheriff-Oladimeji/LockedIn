import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SessionType = 'work' | 'rest';

interface Session {
  duration: number;
  timestamp: number;
  type: SessionType;
}

interface DailyProgress {
  date: string;
  sessions: Session[];
}

interface Settings {
  workDuration: number;
  restDuration: number;
}

interface TimerState {
  mode: SessionType;
  timeRemaining: number;
  isActive: boolean;
  startTime: number | null;
  initialDuration: number;
}

interface DeepWorkStore {
  settings: Settings;
  currentSession: TimerState;
  dailyProgress: DailyProgress[];
  updateSettings: (settings: Partial<Settings>) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  stopTimer: () => void;
  toggleMode: () => void;
  tick: () => void;
  addSession: (session: Session) => void;
}

const useStore = create<DeepWorkStore>()(
  persist(
    (set) => ({
      settings: {
        workDuration: 60 * 60, // 60 minutes in seconds
        restDuration: 10 * 60, // 10 minutes in seconds
      },
      currentSession: {
        mode: 'work',
        timeRemaining: 60 * 60,
        isActive: false,
        startTime: null,
        initialDuration: 60 * 60,
      },
      dailyProgress: [],
      updateSettings: (newSettings) =>
        set((state) => {
          const newDuration = state.currentSession.mode === 'work'
            ? newSettings.workDuration ?? state.settings.workDuration
            : newSettings.restDuration ?? state.settings.restDuration;
          return {
            settings: { ...state.settings, ...newSettings },
            currentSession: {
              ...state.currentSession,
              timeRemaining: newDuration,
              initialDuration: newDuration,
            },
          };
        }),
      startTimer: () =>
        set((state) => ({
          currentSession: {
            ...state.currentSession,
            isActive: true,
            startTime: Date.now(),
            initialDuration: state.currentSession.timeRemaining,
          },
        })),
      pauseTimer: () =>
        set((state) => {
          if (state.currentSession.startTime && state.currentSession.initialDuration) {
            const elapsedTime = Math.floor(
              (state.currentSession.initialDuration - state.currentSession.timeRemaining)
            );
            if (elapsedTime > 0) {
              const session = {
                duration: elapsedTime,
                timestamp: Date.now(),
                type: state.currentSession.mode,
              };
              const today = new Date().toISOString().split('T')[0];
              const existingDayIndex = state.dailyProgress.findIndex(
                (day) => day.date === today
              );

              let newDailyProgress = [...state.dailyProgress];
              if (existingDayIndex >= 0) {
                newDailyProgress[existingDayIndex] = {
                  ...newDailyProgress[existingDayIndex],
                  sessions: [...newDailyProgress[existingDayIndex].sessions, session],
                };
              } else {
                newDailyProgress = [
                  ...newDailyProgress,
                  { date: today, sessions: [session] },
                ];
              }

              return {
                currentSession: {
                  ...state.currentSession,
                  isActive: false,
                  startTime: null,
                },
                dailyProgress: newDailyProgress,
              };
            }
          }
          return {
            currentSession: {
              ...state.currentSession,
              isActive: false,
              startTime: null,
            },
          };
        }),
      resetTimer: () =>
        set((state) => ({
          currentSession: {
            ...state.currentSession,
            timeRemaining:
              state.currentSession.mode === 'work'
                ? state.settings.workDuration
                : state.settings.restDuration,
            isActive: false,
            startTime: null,
            initialDuration:
              state.currentSession.mode === 'work'
                ? state.settings.workDuration
                : state.settings.restDuration,
          },
        })),
      stopTimer: () =>
        set((state) => {
          if (state.currentSession.startTime && state.currentSession.initialDuration) {
            const elapsedTime = Math.floor(
              (state.currentSession.initialDuration - state.currentSession.timeRemaining)
            );
            if (elapsedTime > 0) {
              const session = {
                duration: elapsedTime,
                timestamp: Date.now(),
                type: state.currentSession.mode,
              };
              const today = new Date().toISOString().split('T')[0];
              const existingDayIndex = state.dailyProgress.findIndex(
                (day) => day.date === today
              );

              let newDailyProgress = [...state.dailyProgress];
              if (existingDayIndex >= 0) {
                newDailyProgress[existingDayIndex] = {
                  ...newDailyProgress[existingDayIndex],
                  sessions: [...newDailyProgress[existingDayIndex].sessions, session],
                };
              } else {
                newDailyProgress = [
                  ...newDailyProgress,
                  { date: today, sessions: [session] },
                ];
              }

              return {
                currentSession: {
                  mode: state.currentSession.mode,
                  timeRemaining:
                    state.currentSession.mode === 'work'
                      ? state.settings.workDuration
                      : state.settings.restDuration,
                  isActive: false,
                  startTime: null,
                  initialDuration:
                    state.currentSession.mode === 'work'
                      ? state.settings.workDuration
                      : state.settings.restDuration,
                },
                dailyProgress: newDailyProgress,
              };
            }
          }
          return {
            currentSession: {
              mode: state.currentSession.mode,
              timeRemaining:
                state.currentSession.mode === 'work'
                  ? state.settings.workDuration
                  : state.settings.restDuration,
              isActive: false,
              startTime: null,
              initialDuration:
                state.currentSession.mode === 'work'
                  ? state.settings.workDuration
                  : state.settings.restDuration,
            },
          };
        }),
      toggleMode: () =>
        set((state) => ({
          currentSession: {
            mode: state.currentSession.mode === 'work' ? 'rest' : 'work',
            timeRemaining:
              state.currentSession.mode === 'work'
                ? state.settings.restDuration
                : state.settings.workDuration,
            isActive: false,
            startTime: null,
            initialDuration:
              state.currentSession.mode === 'work'
                ? state.settings.restDuration
                : state.settings.workDuration,
          },
        })),
      tick: () =>
        set((state) => ({
          currentSession: {
            ...state.currentSession,
            timeRemaining: Math.max(0, state.currentSession.timeRemaining - 1),
          },
        })),
      addSession: (session) =>
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const existingDayIndex = state.dailyProgress.findIndex(
            (day) => day.date === today
          );

          if (existingDayIndex >= 0) {
            const newDailyProgress = [...state.dailyProgress];
            newDailyProgress[existingDayIndex] = {
              ...newDailyProgress[existingDayIndex],
              sessions: [...newDailyProgress[existingDayIndex].sessions, session],
            };
            return { dailyProgress: newDailyProgress };
          }

          return {
            dailyProgress: [
              ...state.dailyProgress,
              { date: today, sessions: [session] },
            ],
          };
        }),
    }),
    {
      name: 'deep-work-store',
    }
  )
);

export default useStore;