import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { AppData, Habit, HabitCompletion } from '../types/habit';

const STORAGE_KEY = 'habit_tracker_data';
const CURRENT_VERSION = '1.0.0';

interface HabitStore {
  habits: Habit[];
  completions: HabitCompletion[];
  isLoaded: boolean;
  
  // Inicialización
  loadData: () => Promise<void>;
  
  // Hábitos
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  
  // Completaciones
  toggleCompletion: (habitId: string, date: string) => Promise<void>;
  isHabitCompleted: (habitId: string, date: string) => boolean;
  
  // Utilidades
  getTodayHabits: (currentDay: number) => Habit[];
  exportData: () => AppData;
  importData: (data: AppData) => Promise<void>;
}

const getInitialData = (): AppData => ({
  version: CURRENT_VERSION,
  habits: [],
  completions: [],
  createdAt: new Date().toISOString(),
  lastModified: new Date().toISOString(),
});

const saveToStorage = async (data: AppData): Promise<void> => {
  try {
    const updatedData = {
      ...data,
      lastModified: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

export const useHabitStore = create<HabitStore>((set, get) => ({
  habits: [],
  completions: [],
  isLoaded: false,

  loadData: async () => {
    try {
      const dataString = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (!dataString) {
        const initialData = getInitialData();
        await saveToStorage(initialData);
        set({ habits: [], completions: [], isLoaded: true });
        return;
      }

      const data: AppData = JSON.parse(dataString);
      set({
        habits: data.habits || [],
        completions: data.completions || [],
        isLoaded: true,
      });
    } catch (error) {
      console.error('Error loading data:', error);
      set({ habits: [], completions: [], isLoaded: true });
    }
  },

  addHabit: async (habitData) => {
    const newHabit: Habit = {
      ...habitData,
      id: `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    const state = get();
    const newHabits = [...state.habits, newHabit];
    
    await saveToStorage({
      version: CURRENT_VERSION,
      habits: newHabits,
      completions: state.completions,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    });

    set({ habits: newHabits });
  },

  updateHabit: async (id, updates) => {
    const state = get();
    const newHabits = state.habits.map((h) =>
      h.id === id ? { ...h, ...updates } : h
    );

    await saveToStorage({
      version: CURRENT_VERSION,
      habits: newHabits,
      completions: state.completions,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    });

    set({ habits: newHabits });
  },

  deleteHabit: async (id) => {
    const state = get();
    const newHabits = state.habits.filter((h) => h.id !== id);
    const newCompletions = state.completions.filter((c) => c.habitId !== id);

    await saveToStorage({
      version: CURRENT_VERSION,
      habits: newHabits,
      completions: newCompletions,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    });

    set({ habits: newHabits, completions: newCompletions });
  },

  toggleCompletion: async (habitId, date) => {
    const state = get();
    const existingIndex = state.completions.findIndex(
      (c) => c.habitId === habitId && c.date === date
    );

    let newCompletions: HabitCompletion[];

    if (existingIndex >= 0) {
      newCompletions = state.completions.filter((_, i) => i !== existingIndex);
    } else {
      newCompletions = [
        ...state.completions,
        {
          habitId,
          date,
          completedAt: new Date().toISOString(),
        },
      ];
    }

    await saveToStorage({
      version: CURRENT_VERSION,
      habits: state.habits,
      completions: newCompletions,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    });

    set({ completions: newCompletions });
  },

  isHabitCompleted: (habitId, date) => {
    const { completions } = get();
    return completions.some(
      (c) => c.habitId === habitId && c.date === date
    );
  },

  getTodayHabits: (currentDay) => {
    const { habits } = get();
    return habits.filter((habit) => habit.activeDays.includes(currentDay as any));
  },

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

  importData: async (data) => {
    await saveToStorage(data);
    set({
      habits: data.habits,
      completions: data.completions,
    });
  },
}));
