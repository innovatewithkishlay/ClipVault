import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { IconButton, List, Searchbar, useTheme } from "react-native-paper";
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

        <IconButton
          icon="clipboard-arrow-down"
          style={[
            styles.importFab,
            {
              bottom: 24 + insets.bottom,
              left: 24,
              backgroundColor: theme.colors.surface, // Improved background
              borderWidth: 1, // Added border
              borderColor: theme.colors.outline, // Border color
            },
          ]}
          size={32}
          iconColor={theme.colors.primary} // Improved color
          onPress={handleImportClipboard}
          mode="contained"
        />

        {clips.length > 0 && (
          <IconButton
            icon="delete"
            style={[
              styles.fab,
              {
                bottom: 24 + insets.bottom,
                right: 24,
                backgroundColor: theme.colors.surface, // Improved background
                borderWidth: 1, // Added border
                borderColor: theme.colors.outline, // Border color
              },
            ]}
            size={32}
            iconColor={theme.colors.error} // Keep error color
            onPress={handleClearAll}
            mode="contained"
          />
        )}
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
