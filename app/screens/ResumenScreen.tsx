import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconButton, ProgressBar } from "react-native-paper";

import { getCategoria } from "@/constants/categories";
import { formatMonto } from "@/constants/format";
import { useTheme } from "@/context/ThemeContext";
import { useGetGastos } from "@/hooks/use-gastos";

import ScreenAppBar from "../components/ScreenAppBar";
import ScreenWrapper from "../components/ScreenWrapper";
import sharedStyles from "../styles/sharedStyles";

interface TotalPorCategoria {
  id: string;
  total: number;
}

function mesActual(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export default function ResumenScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { gastos, loading, error, getGastos } = useGetGastos();
  const [mes, setMes] = useState(mesActual());

  
  useFocusEffect(
    useCallback(() => {
      getGastos();
    }, [getGastos])
  );

  const prefijo = `${mes.year}-${String(mes.month).padStart(2, "0")}`;

  const mesLimite = useMemo(() => {
    if (gastos.length === 0) return mes;
    const primer = gastos.reduce(
      (min, g) => (g.fecha < min ? g.fecha : min),
      gastos[0].fecha
    );
    return { year: Number(primer.slice(0, 4)), month: Number(primer.slice(5, 7)) };
  }, [gastos, mes]);

  const delMes = useMemo(
    () => gastos.filter((g) => g.fecha.startsWith(prefijo)),
    [gastos, prefijo]
  );

  const totalMes = useMemo(
    () => delMes.reduce((acc, g) => acc + g.monto, 0),
    [delMes]
  );

 
  const porCategoria = useMemo(() => {
    const mapa = new Map<string, number>();
    for (const g of delMes) {
      mapa.set(g.categoria, (mapa.get(g.categoria) ?? 0) + g.monto);
    }
    const lista: TotalPorCategoria[] = Array.from(mapa, ([id, total]) => ({ id, total }));
    return lista.sort((a, b) => b.total - a.total);
  }, [delMes]);

  const actual = mesActual();
  const puedeAnterior =
    mes.year > mesLimite.year || (mes.year === mesLimite.year && mes.month > mesLimite.month);
  const puedeSiguiente =
    mes.year < actual.year || (mes.year === actual.year && mes.month < actual.month);

 
  const cambiarMes = useCallback((delta: number) => {
    setMes((prev) => {
      const total = prev.month + delta;
      if (total < 1) return { year: prev.year - 1, month: 12 };
      if (total > 12) return { year: prev.year + 1, month: 1 };
      return { ...prev, month: total };
    });
  }, []);

  if (error) {
    return (
      <View style={[sharedStyles.screen, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>
          No se pudo conectar: {error}
        </Text>
        <Button title="Reintentar" onPress={getGastos} color={colors.primary} />
      </View>
    );
  }

  if (loading && gastos.length === 0) {
    return (
      <View style={[sharedStyles.screen, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[sharedStyles.screen, { backgroundColor: colors.background }]}>
      <ScreenAppBar title="Resumen" navigation={navigation} />
      <ScreenWrapper>
        <View style={styles.mesNav}>
          <IconButton
            icon="chevron-left"
            iconColor={puedeAnterior ? colors.primary : colors.textDisabled}
            disabled={!puedeAnterior}
            onPress={() => cambiarMes(-1)}
          />
          <Text style={[styles.mesTexto, { color: colors.text }]}>{nombreMes(mes)}</Text>
          <IconButton
            icon="chevron-right"
            iconColor={puedeSiguiente ? colors.primary : colors.textDisabled}
            disabled={!puedeSiguiente}
            onPress={() => cambiarMes(1)}
          />
        </View>

        <Text style={[styles.totalMes, { color: colors.textSecondary }]}>
          Total:{" "}
          <Text style={[styles.totalMonto, { color: colors.primary }]}>
            {formatMonto(totalMes)}
          </Text>
        </Text>

        <FlatList
          data={porCategoria}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => {
            const categoria = getCategoria(item.id);
            const pct = totalMes > 0 ? (item.total / totalMes) * 100 : 0;
            return (
              <View style={[styles.fila, { borderBottomColor: colors.border }]}>
                <View style={styles.filaEncabezado}>
                  <View style={styles.filaTitulo}>
                    <View style={[styles.icono, { backgroundColor: categoria.color }]}>
                      <Ionicons name={categoria.icono} size={18} color={colors.onPrimary} />
                    </View>
                    <View style={styles.filaTexto}>
                      <Text style={[styles.categoriaNombre, { color: colors.text }]}>
                        {categoria.nombre}
                      </Text>
                      <Text style={[styles.categoriaTotal, { color: colors.textSecondary }]}>
                        {formatMonto(item.total)}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.categoriaPct, { color: colors.text }]}>
                    {pct.toFixed(0)}%
                  </Text>
                </View>
                <ProgressBar
                  progress={pct / 100}
                  color={categoria.color}
                  style={styles.barra}
                />
              </View>
            );
          }}
          refreshing={loading}
          onRefresh={getGastos}
          ListEmptyComponent={
            <Text style={[styles.vacio, { color: colors.textSecondary }]}>
              No hay gastos en este mes.
            </Text>
          }
        />
      </ScreenWrapper>
    </View>
  );
}

function nombreMes({ year, month }: { year: number; month: number }): string {
  const nombre = new Date(year, month - 1, 1).toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
  });
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}


const styles = StyleSheet.create({
  mesNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  mesTexto: { fontSize: 16, fontWeight: "600" },
  totalMes: { fontSize: 16, marginBottom: 8 },
  totalMonto: { fontWeight: "700" },
  lista: { flexGrow: 1 },
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
  categoriaTotal: { fontSize: 13, marginTop: 2 },
  categoriaPct: { fontSize: 15, fontWeight: "700" },
  barra: { height: 8, borderRadius: 4 },
  vacio: { textAlign: "center", marginTop: 40, fontSize: 15 },
  centered: { justifyContent: "center", alignItems: "center", padding: 20, gap: 12 },
  errorText: { textAlign: "center", fontSize: 15 },
});