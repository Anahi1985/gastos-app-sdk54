import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Button, IconButton, SegmentedButtons, Text } from "react-native-paper";

import {
  CategoriaBarChart,
  type CategoriaTotal,
} from "@/components/CategoriaBarChart";
import ScreenWrapper from "@/components/ScreenWrapper";
import { getCategoria, type IoniconName } from "@/constants/categories";
import { formatMonto } from "@/constants/format";
import { useTheme } from "@/context/ThemeContext";
import { useGetGastos } from "@/hooks/use-gastos";
import sharedStyles from "@/styles/sharedStyles";

type Periodo = "todo" | "mes";

interface Mes {
  year: number;
  month: number;
}

function mesActual(): Mes {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function prefijoMes({ year, month }: Mes): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function nombreMes({ year, month }: Mes): string {
  const nombre = new Date(year, month - 1, 1).toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
  });
  return nombre.charAt(0).toUpperCase() + nombre.slice(1);
}

interface MetricaProps {
  icon: IoniconName;
  label: string;
  value: string;
}

function Metrica({ icon, label, value }: MetricaProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.metrica,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={styles.metricaValor}>{value}</Text>
      <Text style={[styles.metricaLabel, { color: colors.textSecondary }]}>
        {label}
      </Text>
    </View>
  );
}

export default function EstadisticasScreen() {
  const { colors } = useTheme();
  const { gastos, loading, error, getGastos } = useGetGastos();
  const [periodo, setPeriodo] = useState<Periodo>("todo");
  const [mes, setMes] = useState<Mes>(mesActual());

  useFocusEffect(
    useCallback(() => {
      getGastos();
    }, [getGastos])
  );

  const mesLimite = useMemo(() => {
    if (gastos.length === 0) return mesActual();
    const primer = gastos.reduce(
      (min, g) => (g.fecha < min ? g.fecha : min),
      gastos[0].fecha
    );
    return { year: Number(primer.slice(0, 4)), month: Number(primer.slice(5, 7)) };
  }, [gastos]);

  const gastosPeriodo = useMemo(() => {
    if (periodo === "todo") return gastos;
    const prefijo = prefijoMes(mes);
    return gastos.filter((g) => g.fecha.startsWith(prefijo));
  }, [gastos, periodo, mes]);

  const total = useMemo(
    () => gastosPeriodo.reduce((acc, g) => acc + g.monto, 0),
    [gastosPeriodo]
  );

  const porCategoria = useMemo(() => {
    const mapa = new Map<string, { total: number; cantidad: number }>();

    for (const g of gastosPeriodo) {
      const actual = mapa.get(g.categoria) ?? { total: 0, cantidad: 0 };
      mapa.set(g.categoria, {
        total: actual.total + g.monto,
        cantidad: actual.cantidad + 1,
      });
    }

    const lista: CategoriaTotal[] = Array.from(mapa, ([id, datos]) => ({
      id,
      ...datos,
    }));

    return lista.sort((a, b) => b.total - a.total);
  }, [gastosPeriodo]);

  const promedio = gastosPeriodo.length > 0 ? total / gastosPeriodo.length : 0;
  const top = porCategoria[0] ? getCategoria(porCategoria[0].id) : null;

  const actual = mesActual();
  const puedeAnterior =
    mes.year > mesLimite.year ||
    (mes.year === mesLimite.year && mes.month > mesLimite.month);
  const puedeSiguiente =
    mes.year < actual.year ||
    (mes.year === actual.year && mes.month < actual.month);

  const cambiarMes = useCallback((delta: number) => {
    setMes((prev) => {
      const totalMes = prev.month + delta;
      if (totalMes < 1) return { year: prev.year - 1, month: 12 };
      if (totalMes > 12) return { year: prev.year + 1, month: 1 };
      return { ...prev, month: totalMes };
    });
  }, []);

  if (error) {
    return (
      <View
        style={[
          sharedStyles.screen,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <Text style={[styles.errorText, { color: colors.error }]}>
          No se pudo conectar: {error}
        </Text>
        <Button mode="contained" onPress={getGastos}>
          Reintentar
        </Button>
      </View>
    );
  }

  if (loading && gastos.length === 0) {
    return (
      <View
        style={[
          sharedStyles.screen,
          styles.centered,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[sharedStyles.screen, { backgroundColor: colors.background }]}>
      <ScreenWrapper withScroll>
        <View style={styles.hero}>
          <View
            style={[styles.heroIcono, { backgroundColor: colors.primaryContainer }]}
          >
            <Ionicons
              name="bar-chart-outline"
              size={28}
              color={colors.onPrimaryContainer}
            />
          </View>
          <View style={styles.heroTexto}>
            <Text style={styles.heroTitulo}>Gastos por categoría</Text>
            <Text style={[styles.heroSubtitulo, { color: colors.textSecondary }]}>
              Compará en qué se te va la plata.
            </Text>
          </View>
        </View>

        <SegmentedButtons
          value={periodo}
          onValueChange={(value) => {
            if (value === "todo" || value === "mes") setPeriodo(value);
          }}
          buttons={[
            { value: "todo", label: "Todo", icon: "calendar-month-outline" },
            { value: "mes", label: "Mes", icon: "calendar-range" },
          ]}
          style={styles.segmentado}
        />

        {periodo === "mes" ? (
          <View style={[styles.mesNav, { borderColor: colors.border }]}>
            <IconButton
              icon="chevron-left"
              iconColor={puedeAnterior ? colors.primary : colors.textDisabled}
              disabled={!puedeAnterior}
              onPress={() => cambiarMes(-1)}
            />
            <Text style={styles.mesTexto}>{nombreMes(mes)}</Text>
            <IconButton
              icon="chevron-right"
              iconColor={puedeSiguiente ? colors.primary : colors.textDisabled}
              disabled={!puedeSiguiente}
              onPress={() => cambiarMes(1)}
            />
          </View>
        ) : null}

        <View style={styles.metricas}>
          <Metrica icon="wallet-outline" label="Total" value={formatMonto(total)} />
          <Metrica
            icon="receipt-outline"
            label="Gastos"
            value={String(gastosPeriodo.length)}
          />
          <Metrica
            icon="grid-outline"
            label="Categorías"
            value={String(porCategoria.length)}
          />
          <Metrica
            icon="calculator-outline"
            label="Promedio por gasto"
            value={formatMonto(promedio)}
          />
        </View>

        <View style={styles.seccionTituloRow}>
          <Text style={styles.seccionTitulo}>Distribución</Text>
          {top ? (
            <Text style={[styles.seccionDetalle, { color: colors.textSecondary }]}>
              Mayor: {top.nombre}
            </Text>
          ) : null}
        </View>

        <CategoriaBarChart data={porCategoria} total={total} />
      </ScreenWrapper>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  heroIcono: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTexto: { flex: 1 },
  heroTitulo: { fontSize: 20, fontWeight: "700" },
  heroSubtitulo: { fontSize: 14, marginTop: 2 },
  segmentado: { marginBottom: 8 },
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
  metricas: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  metrica: {
    flexBasis: "47%",
    flexGrow: 1,
    padding: 14,
    borderWidth: 1,
    borderRadius: 12,
    gap: 4,
  },
  metricaValor: { fontSize: 18, fontWeight: "700", marginTop: 4 },
  metricaLabel: { fontSize: 12 },
  seccionTituloRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  seccionTitulo: { fontSize: 18, fontWeight: "700" },
  seccionDetalle: { fontSize: 13 },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  errorText: { textAlign: "center", fontSize: 15 },
});
