import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Card, IconButton, List, Text, useTheme } from 'react-native-paper';

interface ClipItemProps {
  item: {
    id: string;
    text: string;
    timestamp: string;
  };
  onCopy: (text: string) => void;
  onDelete: (id: string) => void;
}

const ClipItem: React.FC<ClipItemProps> = ({ item, onCopy, onDelete }) => {
  const theme = useTheme();
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    let isActive = true;

    const checkIfImage = async () => {
      try {
        const urlRegex = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
        if (urlRegex.test(item.text)) {
          if (isActive) setIsImage(true);
          return;
        }

        const response = await fetch(item.text, { method: 'HEAD' });
        if (isActive && response.ok) {
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.startsWith('image/')) {
            setIsImage(true);
          } else {
            setIsImage(false);
          }
        } else if (isActive) {
          setIsImage(false);
        }
      } catch (e) {
        if (isActive) setIsImage(false);
      }
    };

    setIsImage(false); 
    checkIfImage();

    return () => {
      isActive = false; 
    };
  }, [item.text]);

  if (isImage) {
    return (
      <Card style={[styles.card, { backgroundColor: theme.colors.elevation.level1 }]}>
        <Card.Content>
             <Text variant="bodySmall" style={{color: theme.colors.onSurfaceVariant}}>
                {new Date(item.timestamp).toLocaleString()}
             </Text>
        </Card.Content>
        <Card.Cover source={{ uri: item.text }} style={styles.image} resizeMode="contain" />
        <Card.Content>
            <Text 
              variant="bodyMedium"
              style={{ color: theme.colors.onBackground, marginTop: 8 }} 
            >
              {item.text}
            </Text>
        </Card.Content>
        <Card.Actions>
          <IconButton icon="content-copy" mode="contained" style={{ backgroundColor: "transparent" }} iconColor={theme.colors.primary} onPress={() => onCopy(item.text)} />
          <IconButton icon="delete" style={{backgroundColor: "transparent"}} iconColor={theme.colors.error} onPress={() => onDelete(item.id)} />
        </Card.Actions>
      </Card>
    );
  }

  return (
    <List.Item
      title={item.text}
      titleNumberOfLines={5}
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
          onPress={() => onDelete(item.id)}
        />
      )}
      style={{ backgroundColor: theme.colors.elevation?.level1, marginVertical: 2, marginHorizontal: 8 }}
      onPress={() => onCopy(item.text)}
    />
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  image: {
    marginTop: 8,
  },
});

export default ClipItem; 