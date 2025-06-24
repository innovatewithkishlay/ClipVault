import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, IconButton, Text, useTheme } from "react-native-paper";
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

  const renderPinDots = () => (
    <View style={styles.pinDotsRow}>
      {[0, 1, 2, 3].map((i) => (
        <View
          key={i}
          style={[
            styles.pinDot,
            pin.length > i && styles.pinDotActive,
            showPin && pin.length > i && styles.pinDotShow,
          ]}
        >
          {showPin && pin.length > i ? (
            <Text style={styles.pinDigit}>{pin[i]}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );

  const handleKeyPress = (digit: string) => {
    if (pin.length < 4) setPin(pin + digit);
  };
  const handleBackspace = () => setPin(pin.slice(0, -1));

  return (
    <KeyboardAvoidingView
      style={styles.outer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.centerContainer}>
        <View style={styles.logoContainer}>
          <ClipVaultLogo style={styles.logo} />
        </View>
        <Text style={styles.welcome}>Welcome to</Text>
        <Text style={styles.appName}>ClipVault</Text>
        <Card style={styles.card} elevation={0}>
          <Card.Content>
            <Text style={styles.title}>
              {storedPin ? "Enter your PIN" : "Set up your 4-digit PIN"}
            </Text>
            {renderPinDots()}
            <Pressable
              style={styles.eyeButton}
              onPress={() => setShowPin(!showPin)}
              android_ripple={{ color: "#eee" }}
            >
              <IconButton
                icon={showPin ? "eye-off" : "eye"}
                size={22}
                iconColor="#888"
                style={{ margin: 0 }}
              />
            </Pressable>
            {error ? (
              <View style={styles.errorContainer}>
                <IconButton icon="alert-circle" size={16} iconColor="#ff5252" />
                <Text style={styles.error}>{error}</Text>
              </View>
            ) : null}
            <View style={styles.numpad}>
              {[
                ["1", "2", "3"],
                ["4", "5", "6"],
                ["7", "8", "9"],
                ["", "0", "<"],
              ].map((row, rowIdx) => (
                <View key={rowIdx} style={styles.numpadRow}>
                  {row.map((key, idx) =>
                    key === "" ? (
                      <View key={idx} style={styles.numpadKeyBlank} />
                    ) : key === "<" ? (
                      <Pressable
                        key={idx}
                        style={styles.numpadKey}
                        onPress={handleBackspace}
                        android_ripple={{ color: "#e0e0e0" }}
                      >
                        <IconButton
                          icon="backspace-outline"
                          size={26}
                          iconColor="#888"
                        />
                      </Pressable>
                    ) : (
                      <Pressable
                        key={idx}
                        style={styles.numpadKey}
                        onPress={() => handleKeyPress(key)}
                        android_ripple={{ color: "#e0e0e0" }}
                      >
                        <Text style={styles.numpadKeyText}>{key}</Text>
                      </Pressable>
                    )
                  )}
                </View>
              ))}
            </View>
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
    backgroundColor: "#f6f7fb",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    elevation: 6,
    shadowColor: "#1bc1a1",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
  },
  logo: {
    width: 64,
    height: 64,
  },
  welcome: {
    fontSize: 18,
    color: "#888",
    fontWeight: "500",
    marginBottom: 0,
    letterSpacing: 1,
    textAlign: "center",
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#7b2ff2",
    marginBottom: 20,
    letterSpacing: 2,
    textAlign: "center",
  },
  card: {
    width: "100%",
    maxWidth: 370,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    marginTop: 8,
    paddingVertical: 18,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
    fontSize: 18,
    color: "#222",
    letterSpacing: 0.5,
  },
  pinDotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
    marginTop: 4,
  },
  pinDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#bdbdbd",
    marginHorizontal: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  pinDotActive: {
    backgroundColor: "#7b2ff2",
    borderColor: "#7b2ff2",
  },
  pinDotShow: {
    backgroundColor: "#fff",
    borderColor: "#7b2ff2",
  },
  pinDigit: {
    color: "#7b2ff2",
    fontWeight: "bold",
    fontSize: 16,
  },
  eyeButton: {
    position: "absolute",
    right: 30,
    top: 52,
    zIndex: 2,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
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
  numpad: {
    marginTop: 10,
    marginBottom: 18,
  },
  numpadRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  numpadKey: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#7b2ff2",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  numpadKeyBlank: {
    width: 56,
    height: 56,
    marginHorizontal: 10,
  },
  numpadKeyText: {
    fontSize: 22,
    color: "#7b2ff2",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    alignSelf: "center",
    width: "90%",
    backgroundColor: "#7b2ff2",
    elevation: 2,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
});
