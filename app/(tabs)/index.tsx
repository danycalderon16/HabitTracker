import { HabitRepository } from "@/src/repository/habitRepository";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Card, FAB, IconButton, Text, useTheme } from "react-native-paper";

export default function HomeScreen() {
  const [habits, setHabits] = useState<any[]>([]);
  const [completedHabits, setCompletedHabits] = useState<Set<string>>(new Set());
  const theme = useTheme();
  const today = new Date().toISOString().split('T')[0];

  const loadHabits = async () => {
    const habits = await HabitRepository.getHabits();
    setHabits(habits || []);
    
    // Load completed status for each habit
    const completed = new Set<string>();
    for (const habit of habits || []) {
      const isLogged = await HabitRepository.isHabitLogged(habit.id, today);
      if (isLogged) {
        completed.add(habit.id);
      }
    }
    setCompletedHabits(completed);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleHabitPress = async (habitId: string) => {
    await HabitRepository.toggleHabitLog(habitId, today);
    
    // Refresh the completed status
    const isLogged = await HabitRepository.isHabitLogged(habitId, today);
    setCompletedHabits(prev => {
      const newSet = new Set(prev);
      if (isLogged) {
        newSet.add(habitId);
      } else {
        newSet.delete(habitId);
      }
      return newSet;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>
        Hábitos de Hoy
      </Text>
      {habits?.length > 0 ? (
        habits.map((habit: any) => (
          <Pressable key={habit.id} onPress={() => handleHabitPress(habit.id)}>
            {({ pressed }) => (
              <Card 
                style={[
                  styles.habitCard,
                  pressed && { opacity: 0.7 }
                ]} 
                mode="elevated"
              >
                <Card.Content style={styles.cardContent}>
                  <IconButton
                    icon={completedHabits.has(habit.id) ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                    size={28}
                    iconColor={completedHabits.has(habit.id) ? theme.colors.primary : theme.colors.outline}
                    style={styles.checkbox}
                  />
                  <Text variant="bodyLarge" style={styles.habitText}>
                    {habit.name}
                  </Text>
                </Card.Content>
              </Card>
            )}
          </Pressable>
        ))
      ) : (
        <Text variant="bodyMedium" style={styles.emptyText}>
          No habits yet. Tap + to create one!
        </Text>
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push("/create-habit")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
    fontWeight: "bold",
  },
  habitCard: {
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  checkbox: {
    margin: 0,
  },
  habitText: {
    flex: 1,
    marginLeft: 8,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    opacity: 0.6,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});