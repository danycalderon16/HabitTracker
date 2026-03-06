import { dbPromise } from './db';

export async function runMigrations() {

    const db = await dbPromise;

    db.execSync(`
        CREATE TABLE IF NOT EXISTS habits (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        createdAt TEXT NOT NULL
        );
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS habit_days (
        habitId TEXT NOT NULL,
        day INTEGER NOT NULL
        );
    `);

    db.execSync(`
        CREATE TABLE IF NOT EXISTS habit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        habitId TEXT NOT NULL,
        date TEXT NOT NULL,
        completedAt TEXT NOT NULL
        );
    `);

}