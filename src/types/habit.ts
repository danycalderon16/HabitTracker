export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Habit {
  id: string;
  name: string;
  description?: string;
  activeDays: DayOfWeek[];
  reminderTime: string; // "HH:mm"
  createdAt: string;
  color?: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // "YYYY-MM-DD"
  completedAt: string;
}

export interface AppData {
  version: string;
  habits: Habit[];
  completions: HabitCompletion[];
  createdAt: string;
  lastModified: string;
}
