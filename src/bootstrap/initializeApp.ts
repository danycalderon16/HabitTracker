import { useHabitStore } from '../store/habitStore';

export async function initializeApp() {
  // Cargar datos desde AsyncStorage al store de Zustand
  await useHabitStore.getState().loadData();
  console.log('App initialized with data loaded');
}
