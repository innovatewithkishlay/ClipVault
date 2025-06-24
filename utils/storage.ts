import AsyncStorage from "@react-native-async-storage/async-storage";

const CLIPBOARD_KEY = "CLIPBOARD_ITEMS";

export const saveClip = async (clip: any) => {
  try {
    const existingClips = await getClips();
    const updatedClips = [clip, ...existingClips];
    await AsyncStorage.setItem(CLIPBOARD_KEY, JSON.stringify(updatedClips));
    return updatedClips;
  } catch (e) {
    console.error("Failed to save clip", e);
    return [];
  }
};

export const getClips = async () => {
  try {
    const clips = await AsyncStorage.getItem(CLIPBOARD_KEY);
    return clips ? JSON.parse(clips) : [];
  } catch (e) {
    console.error("Failed to get clips", e);
    return [];
  }
};

export const deleteClip = async (id: string) => {
  try {
    const clips = await getClips();
    const updatedClips = clips.filter((clip: any) => clip.id !== id);
    await AsyncStorage.setItem(CLIPBOARD_KEY, JSON.stringify(updatedClips));
    return updatedClips;
  } catch (e) {
    console.error("Failed to delete clip", e);
    return [];
  }
};

export const clearClips = async () => {
  try {
    await AsyncStorage.removeItem(CLIPBOARD_KEY);
    return [];
  } catch (e) {
    console.error("Failed to clear clips", e);
    return [];
  }
};
