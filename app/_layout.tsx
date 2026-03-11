import { initializeApp } from "@/src/bootstrap/initializeApp";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const colorScheme = useColorScheme();

  const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;

  useEffect(() => {
    async function prepare() {
      await initializeApp();
      setIsReady(true);
      await SplashScreen.hideAsync();
    }
    prepare();
  }, []);
  
  if (!isReady) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background }
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="create-habit" options={{ presentation: 'modal' }} />
      </Stack>
    </PaperProvider>
  );
}