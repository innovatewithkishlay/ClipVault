import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider
      theme={{
        mode: colorScheme || "light",
        colors: {
          primary: "#6200ee",
          background: colorScheme === "dark" ? "#121212" : "#f5f5f5",
        },
      }}
    >
      <Stack>
        <Stack.Screen name="pin" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
