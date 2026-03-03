import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";



export default function RootLayout() {

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        console.log("inside")
        await new Promise(resolve => setTimeout(resolve, 1500));  
      } catch (error) {
        console.warn(error)
      } finally {
        setIsReady(true)
        await SplashScreen.hideAsync()
      }
    }
    prepare()
  }, [])
  
  if(!isReady){
    return null;
  }


  return (
    <PaperProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PaperProvider>
  );
}