import { Gasto } from "@/constants/api";
import { getCategoria } from "@/constants/categories";
import { formatFecha, formatMonto } from "@/constants/format";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React, { memo, useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { RADIUS } from "../styles/sharedStyles";

interface GastoItemProps {
  gasto: Gasto;
  onPress: (gasto: Gasto) => void;
}


export default function GastoItemImpl({ gasto, onPress }: GastoItemProps) {
  const { colors } = useTheme();
  const categoria = getCategoria(gasto.categoria);

  const handlePress = useCallback(() => onPress(gasto), [onPress, gasto]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <View style={[styles.icono, { backgroundColor: categoria.color }]}>
        <Ionicons name={categoria.icono} size={20} color={colors.onPrimary} />
      </View>

      <View style={styles.detalle}>
        <Text style={[styles.lugar, { color: colors.text }]} numberOfLines={1}>
          {gasto.lugar}
        </Text>
        <Text style={[styles.meta, { color: colors.textSecondary }]}>
          {categoria.nombre} · {formatFecha(gasto.fecha)}
        </Text>
      </View>

      <Text style={[styles.monto, { color: colors.text }]}>{formatMonto(gasto.monto)}</Text>
    </Pressable>
  );
}

export const GastoItem = memo(GastoItemImpl);

// Solo estructura: los colores vienen del theme con useTheme().
const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: RADIUS,
    marginBottom: 8,
    borderWidth: 1,
  },
  icono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  detalle: { flex: 1 },
  lugar: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 13, marginTop: 2 },
  monto: { fontSize: 16, fontWeight: "700" },
});