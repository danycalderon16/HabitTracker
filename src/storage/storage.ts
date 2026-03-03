import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "appData";

export async function getAppData() {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export async function setAppData(data: any) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}