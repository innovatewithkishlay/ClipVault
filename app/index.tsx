import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect } from "expo-router";
import React, { useRef, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { IconButton, List, Searchbar } from "react-native-paper";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const CLIPBOARD_KEY = "CLIPBOARD_ITEMS";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [clips, setClips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const insets = useSafeAreaInsets();

  useFocusEffect(
    React.useCallback(() => {
      loadClips();
      setupClipboardListener();
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [clips])
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
        !clips.some((clip) => clip.text === content)
      ) {
        const newClip = {
          id: Date.now().toString(),
          text: content,
          timestamp: new Date().toISOString(),
        };
        const updatedClips = [newClip, ...clips];
        setClips(updatedClips);
        await AsyncStorage.setItem(CLIPBOARD_KEY, JSON.stringify(updatedClips));
      }
    }, 2000);
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
    <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search clips..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <FlatList
            data={filteredClips}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={item.text}
                description={new Date(item.timestamp).toLocaleString()}
                left={(props) => <List.Icon {...props} icon="content-copy" />}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete"
                    onPress={() => handleDelete(item.id)}
                  />
                )}
                onPress={() => handleCopy(item.text)}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <List.Icon icon="clipboard-alert" style={styles.emptyIcon} />
                <List.Subheader>No clipboard items found</List.Subheader>
              </View>
            }
          />
        )}

        {clips.length > 0 && (
          <IconButton
            icon="delete"
            style={[styles.fab, { bottom: 24 + insets.bottom }]}
            size={32}
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
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
    right: 24,
    backgroundColor: "#fff",
    elevation: 4,
    borderRadius: 28,
  },
});
