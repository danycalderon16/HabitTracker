import { runMigrations } from "../database/migrations";

export async function initializeApp() {
  try {
    await runMigrations()
  } catch (error) {
    console.error('Error initializing app:', error);
  }
}