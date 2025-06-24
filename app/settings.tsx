import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, Switch, View } from "react-native";
import {
  Button,
  IconButton,
  List,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

const PIN_KEY = "CLIPVAULT_PIN";

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (successMessage) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
      const timer = setTimeout(() => {
        setSuccessMessage("");
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChangePin = async () => {
    setError("");
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
      setSuccessMessage("PIN updated successfully!");
      setPin("");
      setConfirmPin("");
    } catch (e) {
      setError("Failed to save PIN");
    }
  };

  const handleLogout = () => {
    setSnackVisible(true);
  };

  const confirmLogout = async () => {
    await SecureStore.deleteItemAsync(PIN_KEY);
    router.replace("/pin");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <View style={styles.outer}>
        <View style={styles.content}>
          <List.Section>
            <List.Subheader style={styles.sectionHeader}>
              Appearance
            </List.Subheader>
            <View style={styles.card}>
              <List.Item
                title="Dark Mode"
                titleStyle={styles.listTitle}
                right={() => (
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    thumbColor={darkMode ? theme.colors.primary : "#f4f3f4"}
                    trackColor={{
                      false: "#767577",
                      true: theme.colors.primary,
                    }}
                  />
                )}
              />
            </View>
          </List.Section>

          <List.Section>
            <List.Subheader style={styles.sectionHeader}>
              Security
            </List.Subheader>
            <View style={styles.card}>
              <List.Item
                title="Change PIN"
                description="Set a new 4-digit PIN"
                titleStyle={styles.listTitle}
                descriptionStyle={styles.listDescription}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="lock"
                    color={theme.colors.primary}
                  />
                )}
              />
              <View style={styles.pinContainer}>
                <Text style={styles.label}>New PIN</Text>
                <TextInput
                  secureTextEntry={!showPin}
                  keyboardType="number-pad"
                  maxLength={4}
                  value={pin}
                  onChangeText={setPin}
                  style={styles.pinInput}
                  mode="outlined"
                  placeholder="Enter new PIN"
                  right={
                    <TextInput.Icon
                      icon={showPin ? "eye-off" : "eye"}
                      onPress={() => setShowPin(!showPin)}
                    />
                  }
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                />
                <Text style={styles.label}>Confirm PIN</Text>
                <TextInput
                  secureTextEntry={!showConfirmPin}
                  keyboardType="number-pad"
                  maxLength={4}
                  value={confirmPin}
                  onChangeText={setConfirmPin}
                  style={styles.pinInput}
                  mode="outlined"
                  placeholder="Confirm new PIN"
                  right={
                    <TextInput.Icon
                      icon={showConfirmPin ? "eye-off" : "eye"}
                      onPress={() => setShowConfirmPin(!showConfirmPin)}
                    />
                  }
                  outlineColor={theme.colors.outline}
                  activeOutlineColor={theme.colors.primary}
                />
                {error ? (
                  <View style={styles.errorContainer}>
                    <IconButton
                      icon="alert-circle"
                      size={16}
                      iconColor="#ff5252"
                    />
                    <Text style={styles.error}>{error}</Text>
                  </View>
                ) : null}
                {successMessage ? (
                  <Animated.View
                    style={[styles.successContainer, { opacity: fadeAnim }]}
                  >
                    <IconButton
                      icon="check-circle"
                      size={16}
                      iconColor="#4caf50"
                    />
                    <Text style={styles.success}>{successMessage}</Text>
                  </Animated.View>
                ) : null}
                <Button
                  mode="contained"
                  onPress={handleChangePin}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  labelStyle={styles.buttonLabel}
                  disabled={pin.length !== 4 || confirmPin.length !== 4}
                >
                  Update PIN
                </Button>
              </View>
            </View>
          </List.Section>
        </View>
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor="#ff5252"
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Logout
        </Button>
        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          duration={5000}
          action={{
            label: "Confirm",
            onPress: confirmLogout,
            textColor: "#fff",
          }}
          style={styles.snackbar}
        >
          Are you sure you want to logout?
        </Snackbar>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  outer: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  content: {
    flexGrow: 1,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  listTitle: {
    fontWeight: "500",
  },
  listDescription: {
    color: "#666",
  },
  pinContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "500",
    color: "#333",
  },
  pinInput: {
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#ffebee",
    padding: 10,
    borderRadius: 8,
  },
  error: {
    color: "#ff5252",
    marginLeft: 4,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#e8f5e9",
    padding: 10,
    borderRadius: 8,
  },
  success: {
    color: "#4caf50",
    marginLeft: 4,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    paddingVertical: 4,
  },
  buttonContent: {
    height: 46,
  },
  buttonLabel: {
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
    borderColor: "#ff5252",
    borderRadius: 8,
    marginBottom: 24,
  },
  snackbar: {
    backgroundColor: "#323232",
    marginBottom: 80,
  },
});
