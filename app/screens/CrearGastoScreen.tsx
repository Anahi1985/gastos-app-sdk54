import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useCallback, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Chip } from "react-native-paper";

import { CATEGORIAS } from "@/constants/categories";
import { hoyISO } from "@/constants/format";
import { useTheme } from "@/context/ThemeContext";
import { usePostGasto } from "@/hooks/use-post-gasto";

import ScreenAppBar from "../components/ScreenAppBar";
import ScreenWrapper from "../components/ScreenWrapper";

export default function CrearGastoScreen({ navigation }: any) {
  const { saveGasto, loading } = usePostGasto();
  const { colors } = useTheme();

  const [lugar, setLugar] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [fecha, setFecha] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const onDateChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && selectedDate) setFecha(selectedDate);
    } else if (selectedDate) {
      setFecha(selectedDate);
    }
  }, []);

  const parseMonto = (texto: string): number => {
    const normalizado = texto.replace(/\./g, "").replace(",", ".");
    return parseFloat(normalizado);
  };

  
  const handleSubmit = useCallback(async () => {
    const nombreLugar = lugar.trim();
    const montoNum = parseMonto(monto);

    if (!nombreLugar) {
      Alert.alert("Falta el lugar", "Indicá el lugar o descripción del gasto.");
      return;
    }
    if (!categoria) {
      Alert.alert("Falta la categoría", "Seleccioná una categoría para el gasto.");
      return;
    }
    if (Number.isNaN(montoNum) || montoNum <= 0) {
      Alert.alert("Monto inválido", "Ingresá un monto mayor a cero.");
      return;
    }

    const success = await saveGasto({
      lugar: nombreLugar,
      categoria,
      monto: montoNum,
      fecha: fechaISO(fecha),
    });

    if (success) {
      Alert.alert("¡Éxito!", "Gasto guardado correctamente");
      setLugar("");
      setMonto("");
      setCategoria(null);
      setFecha(new Date());
      navigation.goBack();
    } else {
      Alert.alert("Error", "No se pudo guardar el gasto.");
    }
  }, [lugar, monto, categoria, fecha, saveGasto, navigation]);

  // Los inputs comparten los mismos colores: los armamos una sola vez.
  const inputThemeStyle = {
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBorder,
    color: colors.inputText,
  };

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <ScreenAppBar title="Nuevo gasto" navigation={navigation} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenWrapper withScroll>
        <Text style={[styles.label, { color: colors.text }]}>Lugar o descripción</Text>
          <TextInput
            style={[styles.input, inputThemeStyle]}
            value={lugar}
            onChangeText={setLugar}
            placeholder="Ej: Supermercado"
            placeholderTextColor={colors.textDisabled}
          />

          <Text style={[styles.label, { color: colors.text }]}>Monto</Text>
          <TextInput
            style={[styles.input, inputThemeStyle]}
            value={monto}
            onChangeText={setMonto}
            placeholder="0"
            placeholderTextColor={colors.textDisabled}
            keyboardType="decimal-pad"
          />

          <Text style={[styles.label, { color: colors.text }]}>Categoría</Text>
          <View style={styles.categorias}>
            {CATEGORIAS.map((cat) => {
              const seleccionada = categoria === cat.id;
              return (
                <Chip
                  key={cat.id}
                  selected={seleccionada}
                  onPress={() => setCategoria(cat.id)}
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
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Fecha</Text>
          <TouchableOpacity
            style={[styles.fechaBoton, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
            onPress={() => setShowPicker(true)}
          >
            <Text style={[styles.fechaTexto, { color: colors.inputText }]}>
              {fechaLegible(fecha)}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <>
              <DateTimePicker
                value={fecha}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onDateChange}
              />
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  style={[styles.listoIos, { backgroundColor: colors.primary }]}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={[styles.listoIosTexto, { color: colors.onPrimary }]}>Listo</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={loading}
            style={styles.boton}
            contentStyle={styles.botonContenido}
          >
            {loading ? "Guardando..." : "Guardar gasto"}
          </Button>
        </ScreenWrapper>
      </KeyboardAvoidingView>
    </View>
  );
}

function fechaISO(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function fechaLegible(date: Date): string {
  const hoy = hoyISO();
  return fechaISO(date) === hoy ? "Hoy" : date.toLocaleDateString("es-CL");
}

// Solo estructura: los colores se aplican arriba con useTheme().
const styles = StyleSheet.create({
  flex: { flex: 1 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 16 },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  categorias: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: { marginRight: 0 },
  fechaBoton: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: "center",
  },
  fechaTexto: { fontSize: 16 },
  listoIos: {
    marginTop: 8,
    alignSelf: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  listoIosTexto: { fontWeight: "600" },
  boton: { marginTop: 24 },
  botonContenido: { height: 50 },
});