import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const date = new Date();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDark ? '#1c1b1f' : '#ffffff',
          borderTopColor: isDark ? '#2d2d2d' : '#e0e0e0',
        },
        tabBarActiveTintColor: isDark ? '#d0bcff' : '#6750a4',
        tabBarInactiveTintColor: isDark ? '#938f99' : '#79747e',
        headerStyle: {
          backgroundColor: isDark ? '#1c1b1f' : '#ffffff',
        },
        headerTintColor: isDark ? '#e6e1e5' : '#1c1b1f',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: `${date.toDateString()}`,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkbox-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "Estadísticas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}