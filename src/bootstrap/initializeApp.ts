import { getAppData, setAppData } from "../storage/storage";

export async function initializeApp() {
    const existingData = await getAppData();

    if (!existingData){
        const initialData = {
            version: 1,
            habits: [],
            setting: {
                reminderCheckTime:"12:00"
            }
        }
        await setAppData(initialData)
        console.log("Data initialized")
    }else {
        console.log("Data founded")
    }
}