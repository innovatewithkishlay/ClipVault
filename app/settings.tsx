import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from "react-native";
import {
  Button,
  IconButton,
  List,
  Snackbar,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useThemeContext } from "../utils/ThemeContext";

const PIN_KEY = "CLIPVAULT_PIN";

export default function SettingsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark, toggleTheme } = useThemeContext();
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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 32 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <List.Section>
          <List.Subheader
            style={[
              styles.sectionHeader,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Appearance
          </List.Subheader>
          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  theme.colors.elevation?.level2 || theme.colors.surface,
              },
            ]}
          >
            <List.Item
              title="Dark Mode"
              titleStyle={[
                styles.listTitle,
                { color: theme.colors.onBackground },
              ]}
              right={() => (
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  thumbColor={isDark ? theme.colors.primary : "#f4f3f4"}
                  trackColor={{ false: "#767577", true: theme.colors.primary }}
                />
              )}
            />
          </View>
        </List.Section>

        <List.Section>
          <List.Subheader
            style={[
              styles.sectionHeader,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Security
          </List.Subheader>
          <View
            style={[
              styles.card,
              {
                backgroundColor:
                  theme.colors.elevation?.level2 || theme.colors.surface,
              },
            ]}
          >
            <List.Item
              title="Change PIN"
              description="Set a new 4-digit PIN"
              titleStyle={[
                styles.listTitle,
                { color: theme.colors.onBackground },
              ]}
              descriptionStyle={[
                styles.listDescription,
                { color: theme.colors.onSurfaceVariant },
              ]}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon="lock"
                  color={theme.colors.primary}
                />
              )}
            />
            <View style={styles.pinContainer}>
              <Text
                style={[styles.label, { color: theme.colors.onBackground }]}
              >
                New PIN
              </Text>
              <TextInput
                secureTextEntry={!showPin}
                keyboardType="number-pad"
                maxLength={4}
                value={pin}
                onChangeText={setPin}
                style={[
                  styles.pinInput,
                  { backgroundColor: theme.colors.surface },
                ]}
                mode="outlined"
                placeholder="Enter new PIN"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
                right={
                  <TextInput.Icon
                    icon={showPin ? "eye-off" : "eye"}
                    color={theme.colors.onSurfaceVariant}
                    onPress={() => setShowPin(!showPin)}
                  />
                }
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
              />
              <Text
                style={[styles.label, { color: theme.colors.onBackground }]}
              >
                Confirm PIN
              </Text>
              <TextInput
                secureTextEntry={!showConfirmPin}
                keyboardType="number-pad"
                maxLength={4}
                value={confirmPin}
                onChangeText={setConfirmPin}
                style={[
                  styles.pinInput,
                  { backgroundColor: theme.colors.surface },
                ]}
                mode="outlined"
                placeholder="Confirm new PIN"
                placeholderTextColor={theme.colors.onSurfaceVariant}
                textColor={theme.colors.onSurface}
                right={
                  <TextInput.Icon
                    icon={showConfirmPin ? "eye-off" : "eye"}
                    color={theme.colors.onSurfaceVariant}
                    onPress={() => setShowConfirmPin(!showConfirmPin)}
                  />
                }
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
              />
              {error ? (
                <View
                  style={[
                    styles.errorContainer,
                    { backgroundColor: theme.colors.errorContainer },
                  ]}
                >
                  <IconButton
                    icon="alert-circle"
                    size={16}
                    iconColor={theme.colors.error}
                  />
                  <Text
                    style={[
                      styles.error,
                      { color: theme.colors.onErrorContainer },
                    ]}
                  >
                    {error}
                  </Text>
                </View>
              ) : null}
              {successMessage ? (
                <Animated.View
                  style={[
                    styles.successContainer,
                    {
                      backgroundColor: theme.colors.primaryContainer,
                      opacity: fadeAnim,
                    },
                  ]}
                >
                  <IconButton
                    icon="check-circle"
                    size={16}
                    iconColor={theme.colors.onPrimaryContainer}
                  />
                  <Text
                    style={[
                      styles.success,
                      { color: theme.colors.onPrimaryContainer },
                    ]}
                  >
                    {successMessage}
                  </Text>
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

        {/* About Me Section */}
        <View
          style={[
            styles.aboutCard,
            {
              backgroundColor:
                theme.colors.elevation?.level2 || theme.colors.surface,
            },
          ]}
        >
          <Text style={[styles.aboutHeader, { color: theme.colors.primary }]}>
            Meet the Developer
          </Text>
          <View style={styles.aboutRow}>
            <View style={styles.avatarWrap}>
              <Image
                source={require("../assets/images/kishlay.png")}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            <View style={styles.aboutTextWrap}>
              <Text
                style={[styles.aboutName, { color: theme.colors.onBackground }]}
              >
                Kishlay Kumar
              </Text>
              <Text
                style={[
                  styles.aboutTitle,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                CS Undergrad · Full Stack Developer
              </Text>
              <Text
                style={[
                  styles.aboutDesc,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Passionate about web & mobile apps, MERN stack, and scalable
                systems.
              </Text>
            </View>
          </View>
        </View>

        <Button
          mode="outlined"
          onPress={handleLogout}
          style={[styles.logoutButton, { borderColor: theme.colors.error }]}
          textColor={theme.colors.error}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Logout
        </Button>
      </ScrollView>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  card: {
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
    fontSize: 13,
  },
  pinContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "500",
  },
  pinInput: {
    marginBottom: 12,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  error: {
    marginLeft: 4,
  },
  successContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
  },
  success: {
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
    borderRadius: 8,
  },
  snackbar: {
    backgroundColor: "#323232",
    marginBottom: 20,
  },

  // About Me Styles
  aboutCard: {
    borderRadius: 14,
    marginBottom: 24,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
  },
  aboutHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    marginRight: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  aboutTextWrap: {
    flex: 1,
  },
  aboutName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  aboutTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 4,
  },
  aboutDesc: {
    fontSize: 13,
    marginTop: 4,
  },
});
