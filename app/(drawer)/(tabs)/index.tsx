import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Chip, FAB, Text, TextInput } from "react-native-paper";
import Animated, { LinearTransition } from "react-native-reanimated";

import { GastoItem } from "@/components/GastoItem";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Gasto } from "@/constants/api";
import { CATEGORIAS } from "@/constants/categories";
import { formatMonto } from "@/constants/format";
import { useTheme } from "@/context/ThemeContext";
import { useGetGastos } from "@/hooks/use-gastos";
import sharedStyles from "@/styles/sharedStyles";

export default function GastosScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { gastos, loading, error, getGastos } = useGetGastos();
  const [categoria, setCategoria] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [puedeIzquierda, setPuedeIzquierda] = useState(false);
  const [puedeDerecha, setPuedeDerecha] = useState(false);

  const anchoContenido = useRef(0);
  const anchoVisible = useRef(0);
  const scrollX = useRef(0);

  const actualizarIndicadores = useCallback(() => {
    const izquierda = scrollX.current > 4;
    const derecha =
      anchoContenido.current - anchoVisible.current - scrollX.current > 4;

    setPuedeIzquierda((actual) => (actual === izquierda ? actual : izquierda));
    setPuedeDerecha((actual) => (actual === derecha ? actual : derecha));
  }, []);

  
  useFocusEffect(
    useCallback(() => {
      getGastos();
    }, [getGastos])
  );

  
  const filtrados = useMemo(() => {
    const porCategoria = categoria
      ? gastos.filter((g) => g.categoria === categoria)
      : gastos;
    const porBusqueda = search.trim()
      ? porCategoria.filter((g) => g.lugar.toLowerCase().includes(search.toLowerCase()))
      : porCategoria;
    return [...porBusqueda].sort((a, b) => {
      const porFecha = b.fecha.localeCompare(a.fecha);
      return porFecha !== 0 ? porFecha : b.id.localeCompare(a.id);
    });
  }, [gastos, categoria, search]);

  const total = useMemo(
    () => filtrados.reduce((acc, g) => acc + g.monto, 0),
    [filtrados]
  );

  
  const handleOpenDetalle = useCallback(
    (gasto: Gasto) => router.push({ pathname: "/detalle", params: { gasto: JSON.stringify(gasto) } }),
    [router]
  );

  const handleCrear = useCallback(() => router.push("/crear"), [router]);

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
      <ScreenWrapper>
        <View style={styles.headerRow}>
          <Text style={[styles.total, { color: colors.textSecondary }]}>
            Total:{" "}
            <Text style={[styles.totalMonto, { color: colors.primary }]}>
              {formatMonto(total)}
            </Text>
          </Text>
        </View>

        <TextInput
          mode="outlined"
          dense
          style={[styles.search, { backgroundColor: colors.inputBackground }]}
          contentStyle={styles.searchContent}
          outlineColor={colors.inputBorder}
          activeOutlineColor={colors.primary}
          placeholder="Buscar por lugar..."
          placeholderTextColor={colors.textDisabled}
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filtrosWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtros}
            contentContainerStyle={styles.filtrosContenido}
            scrollEventThrottle={16}
            onContentSizeChange={(width) => {
              anchoContenido.current = width;
              actualizarIndicadores();
            }}
            onLayout={(event) => {
              anchoVisible.current = event.nativeEvent.layout.width;
              actualizarIndicadores();
            }}
            onScroll={(event) => {
              scrollX.current = event.nativeEvent.contentOffset.x;
              actualizarIndicadores();
            }}
          >
            <Chip
              selected={categoria === null}
              onPress={() => setCategoria(null)}
              style={styles.chip}
            >
              Todas
            </Chip>
            {CATEGORIAS.map((cat) => {
              const seleccionada = categoria === cat.id;
              return (
                <Chip
                  key={cat.id}
                  selected={seleccionada}
                  onPress={() => setCategoria((actual) => (actual === cat.id ? null : cat.id))}
                  style={styles.chip}
                  icon={() => (
                    <Ionicons
                      name={cat.icono}
                      size={16}
                      color={seleccionada ? colors.primary : cat.color}
                    />
                  )}
                >
                  {cat.nombre}
                </Chip>
              );
            })}
          </ScrollView>
          {puedeIzquierda ? (
            <View
              pointerEvents="none"
              accessible={false}
              style={[
                styles.filtrosIndicador,
                styles.filtrosIndicadorIzquierda,
                { backgroundColor: colors.card, borderColor: colors.inputBorder, shadowColor: colors.shadow },
              ]}
            >
              <Ionicons name="chevron-back" size={16} color={colors.primary} />
            </View>
          ) : null}
          {puedeDerecha ? (
            <View
              pointerEvents="none"
              accessible={false}
              style={[
                styles.filtrosIndicador,
                styles.filtrosIndicadorDerecha,
                { backgroundColor: colors.card, borderColor: colors.inputBorder, shadowColor: colors.shadow },
              ]}
            >
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </View>
          ) : null}
        </View>

        <Animated.FlatList
          itemLayoutAnimation={LinearTransition}
          data={filtrados}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <GastoItem gasto={item} index={index} onPress={handleOpenDetalle} />
          )}
          refreshing={loading}
          onRefresh={getGastos}
          contentContainerStyle={styles.lista}
          ListEmptyComponent={
            <Text style={[styles.vacio, { color: colors.textSecondary }]}>
              {gastos.length === 0
                ? "Todavía no cargaste ningún gasto."
                : "No hay gastos con ese filtro."}
            </Text>
          }
        />
      </ScreenWrapper>

      <FAB
        icon="plus"
        style={[sharedStyles.fab, { backgroundColor: colors.primary }]}
        color={colors.onPrimary}
        onPress={handleCrear}
      />
    </View>
  );
}

// Solo estructura
const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  total: { fontSize: 15 },
  totalMonto: { fontWeight: "700" },
  search: {
    borderRadius: 8,
    marginTop: 8,
  },
  searchContent: { fontSize: 15 },
  filtrosWrapper: { position: "relative", marginTop: 12 },
  filtros: { flexGrow: 0, flexShrink: 0 },
  filtrosContenido: { paddingRight: 8, alignItems: "center" },
  filtrosIndicador: {
    position: "absolute",
    top: "50%",
    marginTop: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    zIndex: 1,
  },
  filtrosIndicadorIzquierda: { left: 4 },
  filtrosIndicadorDerecha: { right: 4 },
  chip: { marginRight: 8 },
  lista: { paddingTop: 12, paddingBottom: 80, flexGrow: 1 },
  vacio: { textAlign: "center", marginTop: 40, fontSize: 15 },
  centered: { justifyContent: "center", alignItems: "center", padding: 20, gap: 12 },
  errorText: { textAlign: "center", fontSize: 15 },
});