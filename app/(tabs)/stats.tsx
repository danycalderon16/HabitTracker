import { HabitRepository } from "@/src/repository/habitRepository";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function StatsScreen() {
  const theme = useTheme();
  const [stats, setStats] = useState<any[]>([]);

  const loadStats = useCallback(async () => {
    const date = new Date().toISOString().split('T')[0];
    const res = await HabitRepository.getLogsByDay(date);
    setStats(res || []);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [loadStats])
  );
  

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>
        Estadísticas
      </Text>
      {stats?.length > 0 ? (
        stats.map((habit: any) => (
          <Text key={habit.name}>{habit.name}</Text>
        ))
      ) : (
        <Text variant="bodyMedium" style={styles.emptyText}>
          No completed habits today
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 32,
    opacity: 0.6,
  },
});