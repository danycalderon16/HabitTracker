import { HabitRepository } from "@/src/repository/habitRepository";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Snackbar, Text, useTheme } from "react-native-paper";

export default function SettingsScreen() {
  const theme = useTheme();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const createTestLog = async () => {
    try {
      const habits = await HabitRepository.getHabits();
      
      if (habits.length === 0) {
        setSnackbarMessage("No habits found. Create a habit first!");
        setSnackbarVisible(true);
        return;
      }

      // Create a log for the first habit on March 12, 2026
      await HabitRepository.createTestLog(habits[0].id, "2026-03-12");
      
      setSnackbarMessage("Test log created for March 12, 2026!");
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage("Error creating test log");
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={styles.title}>
        Configuración
      </Text>

      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Testing
        </Text>
        <Button 
          mode="contained" 
          onPress={createTestLog}
          style={styles.button}
        >
          Create Test Log (March 12, 2026)
        </Button>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
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
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
  button: {
    marginTop: 8,
  },
});