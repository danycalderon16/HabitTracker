import { HabitRepository } from "@/src/repository/habitRepository";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { FAB, Text } from "react-native-paper";

export default function HomeScreen() {

  const [habits, setHabits] = useState([])

  useEffect(() => {
    const getHabits = async () => {
     const habits = await HabitRepository.getHabits() 
     setHabits(habits)
    }  
    getHabits()
  }, [])
  


  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium">Hábitos de Hoy</Text>
      {
        habits && habits.map((habit: any) => (
          <Text key={habit.id}>{habit.name}</Text>
        ))
      }
      <FAB
        icon="plus"
        style={{ position: "absolute", right: 16, bottom: 16 }}
        onPress={() => router.push("/create-habit")}
      />
    </View>
  );
}