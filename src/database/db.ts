import * as SQLite from "expo-sqlite"

export const dbPromise = SQLite.openDatabaseAsync("habits.db")