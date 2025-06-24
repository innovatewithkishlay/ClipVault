import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import { StyleSheet, Switch, View } from "react-native";
import { Button, List, Text, TextInput, useTheme } from "react-native-paper";

const PIN_KEY = "CLIPVAULT_PIN";

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");

  const handleChangePin = async () => {
    if (pin.length !== 4) {
      setError("PIN must be 4 digits");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    try {
      await SecureStore.setItemAsync(PIN_KEY, pin);
      setError("");
      router.back();
    } catch (e) {
      setError("Failed to save PIN");
    }
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync(PIN_KEY);
    router.replace("/pin");
  };

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Appearance</List.Subheader>
        <List.Item
          title="Dark Mode"
          right={() => (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              thumbColor={darkMode ? theme.colors.primary : "#f4f3f4"}
              trackColor={{ false: "#767577", true: theme.colors.primary }}
            />
          )}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>Security</List.Subheader>
        <List.Item
          title="Change PIN"
          description="Set a new 4-digit PIN"
          left={(props) => <List.Icon {...props} icon="lock" />}
        />
        <View style={styles.pinContainer}>
          <Text style={styles.label}>New PIN:</Text>
          <TextInput
            secureTextEntry
            keyboardType="number-pad"
            maxLength={4}
            value={pin}
            onChangeText={setPin}
            style={styles.pinInput}
            mode="outlined"
            placeholder="Enter new PIN"
          />

          <Text style={styles.label}>Confirm PIN:</Text>
          <TextInput
            secureTextEntry
            keyboardType="number-pad"
            maxLength={4}
            value={confirmPin}
            onChangeText={setConfirmPin}
            style={styles.pinInput}
            mode="outlined"
            placeholder="Confirm new PIN"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button
            mode="contained"
            onPress={handleChangePin}
            style={styles.button}
          >
            Update PIN
          </Button>
        </View>
      </List.Section>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logoutButton}
        textColor="#ff0000"
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  pinContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
  },
  pinInput: {
    backgroundColor: "white",
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginTop: 5,
  },
  button: {
    marginTop: 10,
  },
  logoutButton: {
    marginTop: 20,
    borderColor: "#ff0000",
  },
});
