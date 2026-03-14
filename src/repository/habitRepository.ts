import { dbPromise } from "../database/db";
import { IHabit } from "../types/habit";

export class HabitRepository {

    static async getHabits(): Promise<IHabit[]> {
        const db = await dbPromise;

        return await db.getAllAsync<IHabit>(
            `SELECT * FROM habits`
        );
    }
    
    static async createHabit(
        id: string,
        name: string,
        days: number[]
    ) {
        const db = await dbPromise;

        await db.runAsync(
            `INSERT INTO habits (id, name, createdAt) VALUES (?, ?, ?)`,
            id, name, new Date().toISOString()
        );

        for (const day of days) {
            await db.runAsync(
                `INSERT INTO habit_days (habitId, day) VALUES (?, ?)`,
                id, day
            );
        }
    }

    static async getAllLogs(){
        const db = await dbPromise;
        return await db.getAllAsync(
            `SELECT * FROM habit_logs`
        );
    }

    static async getLogsByDay(date:string){
        const db = await dbPromise;
        return await db.getAllAsync(`SELECT h.name
            FROM habits h 
            JOIN habit_logs hl ON h.id = hl.habitId
            WHERE hl.date = ?
        `, date)
    }

    static async getHabitsDay(day: number) {
        const db = await dbPromise;

        return await db.getAllAsync(
            `SELECT h.id, h.name FROM habits h
            JOIN habit_days hd ON h.id = hd.habitId
            WHERE hd.day = ?`,
            day
        );
    }

    static async toggleHabitLog(habitId: string, date: string){
        const db = await dbPromise;

        const existing = await db.getFirstAsync(
            `SELECT * FROM habit_logs WHERE habitId = ? AND date = ?`,
            habitId, date
        );

        console.log("Habit exists", existing);
        

        if(existing){
            await db.runAsync(
                `DELETE FROM habit_logs WHERE habitId = ? AND date = ?`,
                habitId, date
            );
        }else {
            await db.runAsync(
                `INSERT INTO habit_logs (habitId, date, completedAt) VALUES (?, ?, ?)`,
                habitId, date, new Date().toISOString()
            );
        }
    }

    // function to get the first day of logs
    static async getFirstLogDate(): Promise<string>{
        const db = await dbPromise;
        const result = await db.getFirstAsync<{ firstDate: string }>(
            `SELECT MIN(date) as firstDate FROM habit_logs`
        );
        return result?.firstDate ?? new Date().toISOString().split('T')[0];
    }


    static async isHabitLogged(habitId: string, date: string){
        const db = await dbPromise;

        const log = await db.getFirstAsync(
            `SELECT * FROM habit_logs WHERE habitId = ? AND date = ?`,
            habitId, date
        );

        return !!log;
    }

    // Test method to create a log with a specific date
    static async createTestLog(habitId: string, date: string) {
        const db = await dbPromise;
        
        await db.runAsync(
            `INSERT INTO habit_logs (habitId, date, completedAt) VALUES (?, ?, ?)`,
            habitId, date, new Date().toISOString()
        );
    }


}