import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { AppData, Habit, HabitCompletion } from '../types/habit';

const CURRENT_VERSION = '1.0.0';

interface HabitStore {
  habits: Habit[];
  completions: HabitCompletion[];

  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;

  toggleCompletion: (habitId: string, date: string) => void;
  isHabitCompleted: (habitId: string, date: string) => boolean;

  getTodayHabits: (currentDay: number) => Habit[];

  exportData: () => AppData;
  importData: (data: AppData) => void;
}

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      completions: [],

      addHabit: (habitData) =>
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habitData,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        })),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          completions: state.completions.filter(
            (c) => c.habitId !== id
          ),
        })),

      toggleCompletion: (habitId, date) =>
        set((state) => {
          const exists = state.completions.some(
            (c) => c.habitId === habitId && c.date === date
          );

          return {
            completions: exists
              ? state.completions.filter(
                  (c) => !(c.habitId === habitId && c.date === date)
                )
              : [
                  ...state.completions,
                  {
                    habitId,
                    date,
                    completedAt: new Date().toISOString(),
                  },
                ],
          };
        }),

      isHabitCompleted: (habitId, date) => {
        return get().completions.some(
          (c) => c.habitId === habitId && c.date === date
        );
      },

      getTodayHabits: (currentDay) =>
        get().habits.filter((habit) =>
          habit.activeDays.includes(currentDay as any)
        ),

      exportData: () => {
        const state = get();
        return {
          version: CURRENT_VERSION,
          habits: state.habits,
          completions: state.completions,
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
        };
      },

      importData: (data) =>
        set({
          habits: data.habits,
          completions: data.completions,
        }),
    }),
    {
      name: 'habit-tracker-storage',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    }
  )
);