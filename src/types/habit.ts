export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface IHabit {
  id: string;
  name: string;
  createdAt: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // "YYYY-MM-DD"
  completedAt: string;
}

export interface AppData {
  version: string;
  habits: IHabit[];
  completions: HabitCompletion[];
  createdAt: string;
  lastModified: string;
}

export interface IHabitLogs {
  habitId: string;
  date: string
}