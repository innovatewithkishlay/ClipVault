import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  const customTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      primary: "#6200ee",
      background: colorScheme === "dark" ? "#121212" : "#f5f5f5",
    },
  };

  return (
    <PaperProvider theme={customTheme}>
      <Stack>
        <Stack.Screen name="pin" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}
