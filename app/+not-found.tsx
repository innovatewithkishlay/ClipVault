import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.big}>Page Not Found</Text>
      <Text style={styles.text}>Sorry, we could not find that page.</Text>
      <Link href="/" style={styles.link}>
        Go to Home
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  big: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: "#888",
  },
  link: {
    color: "#6200ee",
    fontSize: 18,
    fontWeight: "bold",
  },
});
