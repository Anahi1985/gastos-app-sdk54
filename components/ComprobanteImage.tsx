import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import { useTheme } from "@/context/ThemeContext";

interface ComprobanteImageProps {
  uri: string;
  height?: number;
}

export default function ComprobanteImage({ uri, height = 240 }: ComprobanteImageProps) {
  const { colors } = useTheme();
  const [error, setError] = useState(false);

  useEffect(() => setError(false), [uri]);

  if (error) {
    return (
      <View
        style={[
          styles.fallback,
          { height, backgroundColor: colors.background, borderColor: colors.border },
        ]}
      >
        <Ionicons name="image-outline" size={40} color={colors.textSecondary} />
        <Text style={[styles.fallbackText, { color: colors.textSecondary }]}>
          Comprobante no disponible en este dispositivo
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={[styles.image, { height }]}
      contentFit="contain"
      transition={200}
      onError={() => setError(true)}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    borderRadius: 8,
  },
  fallback: {
    width: "100%",
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 8,
  },
  fallbackText: {
    textAlign: "center",
    fontSize: 14,
  },
});
