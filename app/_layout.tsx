import { MaterialIcons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useThemeContext } from "../utils/ThemeContext";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  );
}

function AppWithTheme() {
  const { theme } = useThemeContext();

  return (
    <PaperProvider theme={theme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          screenOptions={{
            drawerActiveTintColor: theme.colors.primary,
            drawerInactiveTintColor: theme.colors.onBackground,
            drawerLabelStyle: { fontSize: 16 },
            headerStyle: {
              backgroundColor:
                theme.colors.elevation?.level2 || theme.colors.background,
            },
            headerTitleStyle: {
              fontWeight: "bold",
              color: theme.colors.onBackground,
            },
            headerTintColor: theme.colors.onBackground,
            drawerStyle: {
              backgroundColor: theme.colors.background,
            },
            drawerItemStyle: {
              backgroundColor: "transparent",
            },
          }}
        >
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: "Clipboard",
              title: "ClipVault",
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="content-paste" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="settings"
            options={{
              drawerLabel: "Settings",
              title: "ClipVault",
              drawerIcon: ({ color, size }) => (
                <MaterialIcons name="settings" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="pin"
            options={{
              drawerItemStyle: { display: "none" },
              headerShown: false,
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
    </PaperProvider>
  );
}
