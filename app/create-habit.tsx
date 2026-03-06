import { HabitRepository } from "@/src/repository/habitRepository";
import { useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";

export default function CreateHabitScreen() {

  const [habit, setHabit] = useState("");
  
  const createHabit = async () => {
    if(habit.trim() === "") return;
    
    await HabitRepository.createHabit(Date.now().toString().substring(7), habit, []);
    setHabit("");
  }
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium">Crear Hábito</Text>
      <TextInput 
        label="New habit"
        value={habit}
        onChangeText={text => setHabit(text)}
      />
      <Button
        onPress={createHabit}
      >
        Create
      </Button>
    </View>
  );
}