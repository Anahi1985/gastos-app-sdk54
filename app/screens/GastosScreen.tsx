import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Chip, FAB, IconButton } from "react-native-paper";

import { Gasto } from "@/constants/api";
import { CATEGORIAS } from "@/constants/categories";
import { formatMonto } from "@/constants/format";
import { useTheme } from "@/context/ThemeContext";
import { useGetGastos } from "@/hooks/use-gastos";

import { GastoItem } from "../components/GastoItem";
import ScreenAppBar from "../components/ScreenAppBar";
import ScreenWrapper from "../components/ScreenWrapper";
import sharedStyles from "../styles/sharedStyles";

export default function GastosScreen({ navigation }: any) {
  const { colors, theme, toggleTheme } = useTheme();
  const { gastos, loading, error, getGastos } = useGetGastos();
  const [categoria, setCategoria] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  
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
    return porBusqueda.sort((a, b) => {
      const porFecha = b.fecha.localeCompare(a.fecha);
      return porFecha !== 0 ? porFecha : b.id - a.id;
    });
  }, [gastos, categoria, search]);

  const total = useMemo(
    () => filtrados.reduce((acc, g) => acc + g.monto, 0),
    [filtrados]
  );

  
  const handleOpenDetalle = useCallback(
    (gasto: Gasto) => navigation.navigate("Detalle", { gasto }),
    [navigation]
  );

  const handleCrear = useCallback(() => navigation.navigate("Crear"), [navigation]);

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
      <ScreenAppBar title="Gastos" navigation={navigation} />
      <ScreenWrapper>
        <View style={styles.headerRow}>
          <Text style={[styles.total, { color: colors.textSecondary }]}>
            Total:{" "}
            <Text style={[styles.totalMonto, { color: colors.primary }]}>
              {formatMonto(total)}
            </Text>
          </Text>
          <IconButton
            icon={theme === "dark" ? "weather-sunny" : "weather-night"}
            iconColor={colors.primary}
            onPress={toggleTheme}
          />
        </View>

        <TextInput
          style={[styles.search, {
            backgroundColor: colors.inputBackground,
            color: colors.inputText,
            borderColor: colors.border,
          }]}
          placeholder="Buscar por lugar..."
          placeholderTextColor={colors.textDisabled}
          value={search}
          onChangeText={setSearch}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtros}
          contentContainerStyle={styles.filtrosContenido}
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

        <FlatList
          data={filtrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <GastoItem gasto={item} onPress={handleOpenDetalle} />}
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
        style={sharedStyles.fab}
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
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginTop: 8,
    fontSize: 15,
  },
  filtros: { marginTop: 12, flexGrow: 0 },
  filtrosContenido: { paddingRight: 8 },
  chip: { marginRight: 8 },
  lista: { paddingTop: 12, paddingBottom: 80, flexGrow: 1 },
  vacio: { textAlign: "center", marginTop: 40, fontSize: 15 },
  centered: { justifyContent: "center", alignItems: "center", padding: 20, gap: 12 },
  errorText: { textAlign: "center", fontSize: 15 },
});