import { getCategoria } from "@/constants/categories";
import { formatFecha, formatMonto } from "@/constants/format";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-paper";

import ScreenAppBar from "../components/ScreenAppBar";
import ScreenWrapper from "../components/ScreenWrapper";
import sharedStyles from "../styles/sharedStyles";

export default function DetalleGastoScreen({ route, navigation }: any) {
  const { colors } = useTheme();

  
  const gasto = route.params?.gasto;

  if (!gasto) {
    return (
      <ScreenWrapper>
        <Text style={{ color: colors.textSecondary }}>No se recibió el gasto.</Text>
      </ScreenWrapper>
    );
  }

  const categoria = getCategoria(gasto.categoria);

  return (
    <View style={[sharedStyles.screen, { backgroundColor: colors.background }]}>
      <ScreenAppBar title="Detalle del gasto" navigation={navigation} />
      <ScreenWrapper>
        <View style={styles.hero}>
          <View style={[styles.iconoGrande, { backgroundColor: categoria.color }]}>
            <Ionicons name={categoria.icono} size={32} color={colors.onPrimary} />
          </View>
          <Text style={[styles.lugar, { color: colors.text }]}>{gasto.lugar}</Text>
          <Text style={[styles.monto, { color: colors.primary }]}>
            {formatMonto(gasto.monto)}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.fila}>
            <Text style={[styles.etiqueta, { color: colors.textSecondary }]}>Categoría</Text>
            <Text style={[styles.valor, { color: colors.text }]}>{categoria.nombre}</Text>
          </View>
          <Divider style={{ backgroundColor: colors.border }} />
          <View style={styles.fila}>
            <Text style={[styles.etiqueta, { color: colors.textSecondary }]}>Fecha</Text>
            <Text style={[styles.valor, { color: colors.text }]}>{formatFecha(gasto.fecha)}</Text>
          </View>
          <Divider style={{ backgroundColor: colors.border }} />
          <View style={styles.fila}>
            <Text style={[styles.etiqueta, { color: colors.textSecondary }]}>ID</Text>
            <Text style={[styles.valor, { color: colors.text }]}>{gasto.id}</Text>
          </View>
        </View>
      </ScreenWrapper>
    </View>
  );
}


const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    paddingVertical: 24,
  },
  iconoGrande: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  lugar: { fontSize: 22, fontWeight: "bold" },
  monto: { fontSize: 32, fontWeight: "bold", marginTop: 8 },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  etiqueta: { fontSize: 15 },
  valor: { fontSize: 15, fontWeight: "600" },
});