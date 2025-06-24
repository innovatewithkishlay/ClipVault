import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  List,
  Paragraph,
  Portal,
  Searchbar,
  Snackbar,
  Tooltip,
  useTheme,
} from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const CLIPBOARD_KEY = "CLIPBOARD_ITEMS";

export default function HomeScreen() {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [clips, setClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const insets = useSafeAreaInsets();
  const clipsRef = useRef(clips);
  const [deleteAllDialogVisible, setDeleteAllDialogVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  useEffect(() => {
    clipsRef.current = clips;
  }, [clips]);

  useFocusEffect(
    React.useCallback(() => {
      loadClips();
      setupClipboardListener();
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [])
  );

  const loadClips = async () => {
    try {
      const savedClips = await AsyncStorage.getItem(CLIPBOARD_KEY);
      setClips(savedClips ? JSON.parse(savedClips) : []);
    } catch (e) {
      console.error("Failed to load clips", e);
    } finally {
      setLoading(false);
    }
  };

  const setupClipboardListener = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      const content = await Clipboard.getStringAsync();
      if (
        content &&
        content.trim() !== "" &&
        !clipsRef.current.some((clip) => clip.text === content)
      ) {
        const newClip = {
          id: Date.now().toString(),
          text: content,
          timestamp: new Date().toISOString(),
        };
        const updatedClips = [newClip, ...clipsRef.current];
        setClips(updatedClips);
        await AsyncStorage.setItem(CLIPBOARD_KEY, JSON.stringify(updatedClips));
      }
    }, 2000);
  };

  const handleImportClipboard = async () => {
    const content = await Clipboard.getStringAsync();
    if (content && content.trim() !== "") {
      if (!clipsRef.current.some((clip) => clip.text === content)) {
        const newClip = {
          id: Date.now().toString(),
          text: content,
          timestamp: new Date().toISOString(),
        };
        const updatedClips = [newClip, ...clipsRef.current];
        setClips(updatedClips);
        await AsyncStorage.setItem(CLIPBOARD_KEY, JSON.stringify(updatedClips));
      }
    }
  };

  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setSnackbarVisible(true);
  };

  const handleDelete = async (id: string) => {
    const updatedClips = clips.filter((clip) => clip.id !== id);
    setClips(updatedClips);
    await AsyncStorage.setItem(CLIPBOARD_KEY, JSON.stringify(updatedClips));
  };

  const handleClearAll = async () => {
    setClips([]);
    await AsyncStorage.removeItem(CLIPBOARD_KEY);
  };

  const filteredClips = clips.filter((clip) =>
    clip.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={["bottom", "left", "right"]}
    >
      <View style={styles.container}>
        <Searchbar
          placeholder="Search clips..."
          placeholderTextColor={theme.colors.onSurfaceVariant}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={[
            styles.searchbar,
            {
              backgroundColor: theme.colors.elevation.level2,
              color: theme.colors.onSurface,
            },
          ]}
          iconColor={theme.colors.onSurface}
          inputStyle={{ color: theme.colors.onSurface }}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            data={filteredClips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={item.text}
                titleStyle={{ color: theme.colors.onBackground }}
                description={new Date(item.timestamp).toLocaleString()}
                descriptionStyle={{ color: theme.colors.onSurfaceVariant }}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="content-copy"
                    color={theme.colors.primary}
                  />
                )}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete"
                    iconColor={theme.colors.error}
                    onPress={() => handleDelete(item.id)}
                  />
                )}
                style={{ backgroundColor: theme.colors.elevation?.level1 }}
                onPress={() => handleCopy(item.text)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <List.Icon
                  icon="clipboard-alert"
                  color={theme.colors.onSurfaceVariant}
                  style={styles.emptyIcon}
                />
                <List.Subheader
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  No clipboard items found
                </List.Subheader>
              </View>
            }
          />
        )}

        <Tooltip title="Import current clipboard">
          <IconButton
            icon="clipboard-arrow-down"
            style={[
              styles.importFab,
              {
                bottom: 24 + insets.bottom,
                left: 24,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.outline,
              },
            ]}
            size={32}
            iconColor={theme.colors.primary}
            onPress={handleImportClipboard}
            mode="contained"
            accessibilityLabel="Import clipboard"
          />
        </Tooltip>

        {clips.length > 0 && (
          <Tooltip title="Delete all clipboard items">
            <IconButton
              icon="delete"
              style={[
                styles.fab,
                {
                  bottom: 24 + insets.bottom,
                  right: 24,
                  backgroundColor: theme.colors.surface,
                  borderWidth: 1,
                  borderColor: theme.colors.outline,
                },
              ]}
              size={32}
              iconColor={theme.colors.error}
              onPress={() => setDeleteAllDialogVisible(true)}
              mode="contained"
              accessibilityLabel="Delete all clips"
            />
          </Tooltip>
        )}

        {/* Delete All Confirmation Dialog */}
        <Portal>
          <Dialog
            visible={deleteAllDialogVisible}
            onDismiss={() => setDeleteAllDialogVisible(false)}
          >
            <Dialog.Title>Delete All?</Dialog.Title>
            <Dialog.Content>
              <Paragraph>
                Are you sure you want to delete all clipboard items?
              </Paragraph>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDeleteAllDialogVisible(false)}>
                Cancel
              </Button>
              <Button
                onPress={() => {
                  handleClearAll();
                  setDeleteAllDialogVisible(false);
                }}
                textColor={theme.colors.error}
              >
                Delete
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Snackbar for copy feedback */}
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
          style={{ marginBottom: 24 + insets.bottom }}
        >
          Text copied successfully!
        </Snackbar>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  searchbar: {
    margin: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIcon: {
    width: 40,
    height: 40,
    alignSelf: "center",
    marginBottom: 10,
  },
  fab: {
    position: "absolute",
    elevation: 4,
    borderRadius: 28,
  },
  importFab: {
    position: "absolute",
    elevation: 4,
    borderRadius: 28,
  },
});
