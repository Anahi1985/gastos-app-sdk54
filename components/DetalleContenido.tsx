import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { Button, Card, Divider, Text } from "react-native-paper";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

import ScreenWrapper from "@/components/ScreenWrapper";
import StackHeader from "@/components/StackHeader";
import { Gasto } from "@/constants/api";
import { getCategoria } from "@/constants/categories";
import { formatFecha, formatMonto } from "@/constants/format";
import type { DetalleNavigationProp, DetalleRouteProp } from "@/constants/navigation";
import { useTheme } from "@/context/ThemeContext";
import sharedStyles from "@/styles/sharedStyles";

export default function DetalleContenido() {
  const { colors } = useTheme();
  const route = useRoute<DetalleRouteProp>();
  const navigation = useNavigation<DetalleNavigationProp>();
  const gastoParam = route.params?.gasto;

  let gasto: Gasto | null = null;
  try {
    gasto = typeof gastoParam === "string" ? (JSON.parse(gastoParam) as Gasto) : null;
  } catch {
    gasto = null;
  }

  if (!gasto) {
    return (
      <View style={[sharedStyles.screen, { backgroundColor: colors.background }]}>
        <StackHeader title="Detalle del gasto" />
        <ScreenWrapper>
          <Text style={{ color: colors.textSecondary }}>No se recibió el gasto.</Text>
        </ScreenWrapper>
      </View>
    );
  }

  const categoria = getCategoria(gasto.categoria);

  return (
    <View style={[sharedStyles.screen, { backgroundColor: colors.background }]}>
      <StackHeader title="Detalle del gasto" />
      <ScreenWrapper withScroll>
        <View style={styles.hero}>
          <Animated.View
            entering={ZoomIn.springify()}
            style={[styles.iconoGrande, { backgroundColor: categoria.color }]}
          >
            <Ionicons name={categoria.icono} size={32} color={colors.onPrimary} />
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150)}>
            <Text style={styles.lugar}>{gasto.lugar}</Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(225)}>
            <Text style={[styles.monto, { color: colors.primary }]}>
              {formatMonto(gasto.monto)}
            </Text>
          </Animated.View>
        </View>

        <Animated.View
          entering={FadeInDown.delay(300)}
          style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.fila}>
            <Text style={[styles.etiqueta, { color: colors.textSecondary }]}>Categoría</Text>
            <Text style={styles.valor}>{categoria.nombre}</Text>
          </View>
          <Divider style={{ backgroundColor: colors.border }} />
          <View style={styles.fila}>
            <Text style={[styles.etiqueta, { color: colors.textSecondary }]}>Fecha</Text>
            <Text style={styles.valor}>{formatFecha(gasto.fecha)}</Text>
          </View>
          <Divider style={{ backgroundColor: colors.border }} />
          <View style={styles.fila}>
            <Text style={[styles.etiqueta, { color: colors.textSecondary }]}>ID</Text>
            <Text style={styles.valor}>{gasto.id}</Text>
          </View>
        </Animated.View>

        {gasto.comprobanteUri && (
          <Animated.View entering={FadeInDown.delay(375)}>
            <Card style={[styles.comprobanteCard, { backgroundColor: colors.card }]}>
              <Card.Title title="Comprobante" />
              <Card.Content>
                <Image
                  source={{ uri: gasto.comprobanteUri }}
                  style={styles.comprobanteImagen}
                  contentFit="contain"
                  transition={200}
                />
              </Card.Content>
            </Card>
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(450)} style={styles.acciones}>
          <Button
            mode="contained-tonal"
            icon="plus"
            onPress={() => navigation.push("crear")}
            style={styles.boton}
          >
            Agregar otro gasto
          </Button>
        </Animated.View>
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
  comprobanteCard: { marginTop: 16 },
  comprobanteImagen: { width: "100%", height: 320, borderRadius: 8 },
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
  acciones: { marginTop: 24, marginBottom: 8 },
  boton: { borderRadius: 8 },
});
