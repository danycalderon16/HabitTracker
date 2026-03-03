import { router } from "expo-router";
import { View } from "react-native";
import { FAB, Text } from "react-native-paper";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text variant="headlineMedium">Hábitos de Hoy</Text>

      <FAB
        icon="plus"
        style={{ position: "absolute", right: 16, bottom: 16 }}
        onPress={() => router.push("/create-habit")}
      />
    </View>
  );
}