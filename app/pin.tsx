import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import ClipVaultLogo from "../assets/images/ClipVaultLogo";

const PIN_KEY = "CLIPVAULT_PIN";

export default function PinScreen() {
  const [pin, setPin] = useState("");
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showPin, setShowPin] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      const savedPin = await SecureStore.getItemAsync(PIN_KEY);
      setStoredPin(savedPin);
    })();
  }, []);

  const handlePinSubmit = async () => {
    setError("");
    if (!storedPin) {
      if (pin.length === 4) {
        await SecureStore.setItemAsync(PIN_KEY, pin);
        router.replace("/(tabs)");
      } else {
        setError("PIN must be 4 digits");
      }
    } else {
      if (pin === storedPin) {
        router.replace("/(tabs)");
      } else {
        setError("Incorrect PIN");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.outer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.centerContainer}>
        <ClipVaultLogo style={styles.logo} />
        <Text style={styles.welcome}>Welcome to</Text>
        <Text style={styles.appName}>ClipVault</Text>
        <Card style={styles.card} elevation={4}>
          <Card.Content>
            <Text style={styles.title}>
              {storedPin ? "Enter your PIN" : "Set up your 4-digit PIN"}
            </Text>
            <TextInput
              label="PIN"
              value={pin}
              onChangeText={setPin}
              keyboardType="number-pad"
              secureTextEntry={!showPin}
              maxLength={4}
              mode="outlined"
              style={styles.pinInput}
              right={
                <TextInput.Icon
                  icon={showPin ? "eye-off" : "eye"}
                  onPress={() => setShowPin(!showPin)}
                />
              }
              outlineColor={theme.colors.outline}
              activeOutlineColor={theme.colors.primary}
              autoFocus
            />
            {error ? (
              <View style={styles.errorContainer}>
                <IconButton icon="alert-circle" size={16} iconColor="#ff5252" />
                <Text style={styles.error}>{error}</Text>
              </View>
            ) : null}
            <Button
              mode="contained"
              onPress={handlePinSubmit}
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
              disabled={pin.length !== 4}
            >
              {storedPin ? "Unlock" : "Set PIN"}
            </Button>
          </Card.Content>
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  welcome: {
    fontSize: 20,
    color: "#888",
    fontWeight: "500",
    marginBottom: 0,
    letterSpacing: 1,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#6200ee",
    marginBottom: 20,
    letterSpacing: 2,
  },
  card: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 18,
    paddingVertical: 24,
    backgroundColor: "#fff",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "600",
    fontSize: 18,
    color: "#222",
    letterSpacing: 0.5,
  },
  pinInput: {
    marginBottom: 10,
    backgroundColor: "#faf6ff",
    fontSize: 18,
    letterSpacing: 8,
    width: 220,
    alignSelf: "center",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "center",
  },
  error: {
    color: "#ff5252",
    marginLeft: 2,
    fontSize: 14,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    alignSelf: "center",
    width: "80%",
    backgroundColor: "#6200ee",
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
