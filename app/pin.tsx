import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput, Title } from "react-native-paper";

const PIN_KEY = "CLIPVAULT_PIN";

export default function PinScreen() {
  const [pin, setPin] = useState("");
  const [storedPin, setStoredPin] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const savedPin = await SecureStore.getItemAsync(PIN_KEY);
      setStoredPin(savedPin);
    })();
  }, []);

  const handlePinSubmit = async () => {
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
    <View style={styles.container}>
      <Title style={{ marginBottom: 16 }}>
        {storedPin ? "Enter PIN" : "Create a 4-digit PIN"}
      </Title>
      <TextInput
        label="PIN"
        value={pin}
        onChangeText={setPin}
        keyboardType="number-pad"
        secureTextEntry
        maxLength={4}
        style={{ width: 200, marginBottom: 10 }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button mode="contained" onPress={handlePinSubmit}>
        {storedPin ? "Unlock" : "Set PIN"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
});
