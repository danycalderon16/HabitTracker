import { initializeApp } from "@/src/bootstrap/initializeApp";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await initializeApp();
      setIsReady(true)
      await SplashScreen.hideAsync();
    }
    prepare()
  }, [])
  
  if(!isReady){
    return null;
  }


  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="create-habit" options={{ presentation: 'modal' }} />
      </Stack>
    </PaperProvider>
  );
}