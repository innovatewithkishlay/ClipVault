// import { MaterialIcons } from "@expo/vector-icons";
// import { Tabs } from "expo-router";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// export default function TabLayout() {
//   const insets = useSafeAreaInsets();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: "#6200ee",
//         tabBarStyle: {
//           borderRadius: 16,
//           height: 60 + insets.bottom,
//           backgroundColor: "#fff",
//           elevation: 8,
//           shadowColor: "#000",
//           shadowOpacity: 0.1,
//           shadowOffset: { width: 0, height: 2 },
//           shadowRadius: 8,
//           marginHorizontal: 12,
//           marginBottom: insets.bottom ? insets.bottom + 6 : 6,
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           marginBottom: 4,
//         },
//         headerTitleStyle: {
//           fontWeight: "bold",
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: "ClipVault",
//           headerTitle: "ClipVault",
//           tabBarLabel: "Clipboard",
//           tabBarIcon: ({ color }) => (
//             <MaterialIcons name="content-paste" size={24} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="settings"
//         options={{
//           title: "ClipVault",
//           headerTitle: "ClipVault",
//           tabBarLabel: "Settings",
//           tabBarIcon: ({ color }) => (
//             <MaterialIcons name="settings" size={24} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
