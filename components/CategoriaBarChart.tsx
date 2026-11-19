import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";

import { getCategoria } from "@/constants/categories";
import { formatMonto } from "@/constants/format";
import { useTheme } from "@/context/ThemeContext";

export interface CategoriaTotal {
  id: string;
  total: number;
  cantidad: number;
}

interface CategoriaBarChartProps {
  data: CategoriaTotal[];
  total: number;
}

export function CategoriaBarChart({ data, total }: CategoriaBarChartProps) {
  const { colors } = useTheme();
  const maximo = data.reduce((max, item) => Math.max(max, item.total), 0);

  if (data.length === 0) {
    return (
      <View
        style={[
          styles.vacio,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Ionicons name="bar-chart-outline" size={32} color={colors.textDisabled} />
        <Text style={[styles.vacioTexto, { color: colors.textSecondary }]}>
          No hay gastos en este período.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {data.map((item, index) => {
        const categoria = getCategoria(item.id);
        const pct = total > 0 ? (item.total / total) * 100 : 0;
        const ancho = maximo > 0 ? (item.total / maximo) * 100 : 0;

        return (
          <Animated.View
            key={item.id}
            entering={FadeInDown.delay(Math.min(index, 8) * 60).springify()}
            style={[styles.fila, { borderBottomColor: colors.border }]}
          >
            <View style={styles.filaEncabezado}>
              <View style={styles.filaTitulo}>
                <View style={[styles.icono, { backgroundColor: categoria.color }]}>
                  <Ionicons
                    name={categoria.icono}
                    size={18}
                    color={colors.onPrimary}
                  />
                </View>
                <View style={styles.filaTexto}>
                  <Text style={styles.categoriaNombre}>{categoria.nombre}</Text>
                  <Text style={[styles.categoriaDetalle, { color: colors.textSecondary }]}>
                    {item.cantidad} {item.cantidad === 1 ? "gasto" : "gastos"} ·{" "}
                    {formatMonto(item.total)}
                  </Text>
                </View>
              </View>
              <Text style={styles.categoriaPct}>{pct.toFixed(0)}%</Text>
            </View>
            <View style={[styles.barraFondo, { backgroundColor: colors.border }]}>
              <View
                style={[
                  styles.barraRelleno,
                  { flex: ancho, backgroundColor: categoria.color },
                ]}
              />
              <View style={{ flex: Math.max(0, 100 - ancho) }} />
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  vacio: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 24,
    borderWidth: 1,
    borderRadius: 12,
  },
  vacioTexto: { fontSize: 15, textAlign: "center" },
  fila: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filaEncabezado: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  filaTitulo: { flexDirection: "row", alignItems: "center", flex: 1 },
  filaTexto: { flex: 1, marginLeft: 10 },
  icono: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  categoriaNombre: { fontSize: 15, fontWeight: "500" },
  categoriaDetalle: { fontSize: 13, marginTop: 2 },
  categoriaPct: { fontSize: 15, fontWeight: "700", marginLeft: 8 },
  barraFondo: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    flexDirection: "row",
  },
  barraRelleno: {
    height: "100%",
    borderRadius: 4,
  },
});
