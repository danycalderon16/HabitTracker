import AsyncStorage from '@react-native-async-storage/async-storage';

// Funciones auxiliares para AsyncStorage
export const getAppData = async () => {
  try {
    const data = await AsyncStorage.getItem('habit_tracker_data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting app data:', error);
    return null;
  }
};

export const setAppData = async (data: any) => {
  try {
    await AsyncStorage.setItem('habit_tracker_data', JSON.stringify(data));
  } catch (error) {
    console.error('Error setting app data:', error);
  }
};
