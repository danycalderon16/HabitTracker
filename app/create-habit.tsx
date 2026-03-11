import { HabitRepository } from "@/src/repository/habitRepository";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, Snackbar, Text, TextInput, useTheme } from "react-native-paper";

export default function CreateHabitScreen() {
  const [habit, setHabit] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [error, setError] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const theme = useTheme();

  const days = [
    { label: "Sun", value: 0 },
    { label: "Mon", value: 1 },
    { label: "Tue", value: 2 },
    { label: "Wed", value: 3 },
    { label: "Thu", value: 4 },
    { label: "Fri", value: 5 },
    { label: "Sat", value: 6 },
  ];

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    );
  };
  
  const createHabit = async () => {
    const trimmedHabit = habit.trim();
    
    if (trimmedHabit === "") {
      setError("Habit name cannot be empty");
      return;
    }
    
    if (trimmedHabit.length < 3) {
      setError("Habit name must be at least 3 characters");
      return;
    }
    
    if (trimmedHabit.length > 50) {
      setError("Habit name must be less than 50 characters");
      return;
    }

    if (selectedDays.length === 0) {
      setError("Please select at least one day");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      await HabitRepository.createHabit(
        Date.now().toString().substring(7), 
        trimmedHabit, 
        selectedDays
      );
      setHabit("");
      setSnackbarVisible(true);
      
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (err) {
      setError("Failed to create habit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>
            Create New Habit
          </Text>
          
          <Text variant="bodyMedium" style={styles.subtitle}>
            Start building a positive habit today
          </Text>
          
          <TextInput 
            label="Habit name"
            value={habit}
            onChangeText={(text) => {
              setHabit(text);
              setError("");
            }}
            mode="outlined"
            style={styles.input}
            placeholder="e.g., Drink 8 glasses of water"
            error={!!error}
            disabled={loading}
            maxLength={50}
            autoFocus
          />
          
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>
          
          <HelperText type="info" visible={!error && habit.length > 0}>
            {habit.length}/50 characters
          </HelperText>

          <Text variant="titleMedium" style={styles.sectionTitle}>
            Repeat on
          </Text>

          <View style={styles.daysContainer}>
            {days.map((day) => (
              <Chip
                key={day.value}
                selected={selectedDays.includes(day.value)}
                onPress={() => toggleDay(day.value)}
                style={styles.dayChip}
                mode="outlined"
              >
                {day.label}
              </Chip>
            ))}
          </View>
          
          <Button
            mode="contained"
            onPress={createHabit}
            style={styles.button}
            loading={loading}
            disabled={loading || habit.trim() === ""}
          >
            Create Habit
          </Button>
          
          <Button
            mode="text"
            onPress={() => router.back()}
            style={styles.cancelButton}
            disabled={loading}
          >
            Cancel
          </Button>
        </View>
      </ScrollView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
      >
        Habit created successfully!
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    marginBottom: 8,
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: 32,
    opacity: 0.7,
  },
  input: {
    marginBottom: 4,
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 12,
    fontWeight: "600",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  dayChip: {
    minWidth: 60,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
  cancelButton: {
    marginTop: 8,
  },
});