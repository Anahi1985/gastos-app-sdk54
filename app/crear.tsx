import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Animated as RNAnimated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Chip, Dialog, Portal, Text, TextInput } from "react-native-paper";
import Animated, { FadeInDown } from "react-native-reanimated";
import ComprobanteAdjunto from "@/components/ComprobanteAdjunto";
import ScreenWrapper from "@/components/ScreenWrapper";
import StackHeader from "@/components/StackHeader";
import { CATEGORIAS, type Categoria } from "@/constants/categories";
import { eliminarComprobante, persistirComprobante } from "@/constants/files";
import { esFechaISOValida, hoyISO } from "@/constants/format";
import type { Colors } from "@/constants/theme";
import { useTheme } from "@/context/ThemeContext";
import { usePostGasto } from "@/hooks/use-post-gasto";

type CategoriaChipProps = {
  categoria: Categoria;
  seleccionada: boolean;
  onSelect: (id: string) => void;
  colors: Colors;
};

type DialogInfo = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

function CategoriaChip({ categoria, seleccionada, onSelect, colors }: CategoriaChipProps) {
  const scale = useRef(new RNAnimated.Value(1)).current;

  const handlePress = useCallback(() => {
    void Haptics.selectionAsync().catch(() => null);
    RNAnimated.sequence([
      RNAnimated.spring(scale, {
        toValue: 1.08,
        speed: 30,
        bounciness: 8,
        useNativeDriver: true,
      }),
      RNAnimated.spring(scale, {
        toValue: 1,
        speed: 30,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start();
    onSelect(categoria.id);
  }, [categoria.id, onSelect, scale]);

  return (
    <RNAnimated.View style={[styles.chipWrap, { transform: [{ scale }] }]}>
      <Chip
        mode="outlined"
        selected={seleccionada}
        onPress={handlePress}
        style={[
          styles.chip,
          {
            backgroundColor: seleccionada ? colors.primaryContainer : colors.card,
            borderColor: seleccionada ? colors.primary : colors.inputBorder,
          },
        ]}
        textStyle={[
          styles.chipTexto,
          { color: seleccionada ? colors.onPrimaryContainer : colors.textSecondary },
          seleccionada && styles.chipTextoSeleccionado,
        ]}
        icon={() => (
          <Ionicons
            name={categoria.icono}
            size={18}
            color={seleccionada ? colors.onPrimaryContainer : categoria.color}
          />
        )}
      >
        {categoria.nombre}
      </Chip>
      {seleccionada ? (
        <View
          pointerEvents="none"
          style={[
            styles.checkBadge,
            { backgroundColor: colors.primary, borderColor: colors.background },
          ]}
        >
          <Ionicons name="checkmark" size={12} color={colors.onPrimary} />
        </View>
      ) : null}
    </RNAnimated.View>
  );
}

export default function CrearGasto() {
  const router = useRouter();
  const { saveGasto, loading } = usePostGasto();
  const { colors } = useTheme();

  const [lugar, setLugar] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState<string | null>(null);
  const [fecha, setFecha] = useState<Date>(new Date());
  const [fechaTexto, setFechaTexto] = useState(() => fechaParaInput(new Date()));
  const [showPicker, setShowPicker] = useState(false);
  const [comprobanteUri, setComprobanteUri] = useState<string | null>(null);
  const [dialog, setDialog] = useState<DialogInfo | null>(null);

  const onDateChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false);
      if (event.type === "set" && selectedDate) setFecha(selectedDate);
    } else if (selectedDate) {
      setFecha(selectedDate);
    }
  }, []);

  const handleFechaTexto = useCallback((texto: string) => {
    setFechaTexto(texto);
    const fechaConvertida = fechaDesdeTexto(texto);
    if (fechaConvertida) setFecha(fechaConvertida);
  }, []);

  const handleCategoria = useCallback((id: string) => setCategoria(id), []);

  const parseMonto = (texto: string): number => {
    const normalizado = texto.replace(/\./g, "").replace(",", ".");
    return parseFloat(normalizado);
  };

  
  const handleSubmit = useCallback(async () => {
    const nombreLugar = lugar.trim();
    const montoNum = parseMonto(monto);
    const fechaStr =
      Platform.OS === "web"
        ? (fechaISODesdeTexto(fechaTexto) ?? fechaTexto.trim())
        : fechaISO(fecha);

    if (!nombreLugar) {
      setDialog({ title: "Falta el lugar", message: "Indicá el lugar o descripción del gasto." });
      return;
    }
    if (!categoria) {
      setDialog({ title: "Falta la categoría", message: "Seleccioná una categoría para el gasto." });
      return;
    }
    if (Number.isNaN(montoNum) || montoNum <= 0) {
      setDialog({ title: "Monto inválido", message: "Ingresá un monto mayor a cero." });
      return;
    }
    if (!esFechaISOValida(fechaStr)) {
      setDialog({
        title: "Fecha inválida",
        message:
          Platform.OS === "web"
            ? "Ingresá una fecha válida con formato DD-MM-AAAA."
            : "Seleccioná una fecha válida.",
      });
      return;
    }

    let comprobantePersistente: string | null = null;
    if (comprobanteUri) {
      try {
        comprobantePersistente = persistirComprobante(comprobanteUri);
      } catch {
        setDialog({ title: "Error", message: "No se pudo guardar el comprobante." });
        return;
      }
    }

    const resultado = await saveGasto({
      lugar: nombreLugar,
      categoria,
      monto: montoNum,
      fecha: fechaStr,
      ...(comprobantePersistente ? { comprobanteUri: comprobantePersistente } : {}),
    });

    if (resultado.ok) {
      setLugar("");
      setMonto("");
      setCategoria(null);
      const hoy = new Date();
      setFecha(hoy);
      setFechaTexto(fechaParaInput(hoy));
      setComprobanteUri(null);
      setDialog({
        title: "¡Éxito!",
        message: "Gasto guardado correctamente",
        actionLabel: "Volver",
        onAction: () => router.back(),
      });
    } else {
      if (comprobantePersistente) eliminarComprobante(comprobantePersistente);
      setDialog({ title: "Error", message: resultado.error ?? "No se pudo guardar el gasto." });
    }
  }, [lugar, monto, categoria, fecha, fechaTexto, comprobanteUri, saveGasto, router]);

  return (
    <View style={[styles.flex, { backgroundColor: colors.background }]}>
      <StackHeader title="Nuevo gasto" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScreenWrapper withScroll>
          <Animated.View entering={FadeInDown.delay(0)}>
            <Text style={styles.label}>Lugar o descripción</Text>
            <TextInput
              mode="outlined"
              style={{ backgroundColor: colors.inputBackground }}
              contentStyle={styles.inputContent}
              outlineColor={colors.inputBorder}
              activeOutlineColor={colors.primary}
              value={lugar}
              onChangeText={setLugar}
              placeholder="Ej: Supermercado"
              placeholderTextColor={colors.textDisabled}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(75)}>
            <Text style={styles.label}>Monto</Text>
            <TextInput
              mode="outlined"
              style={{ backgroundColor: colors.inputBackground }}
              contentStyle={styles.inputContent}
              outlineColor={colors.inputBorder}
              activeOutlineColor={colors.primary}
              value={monto}
              onChangeText={setMonto}
              placeholder="0"
              placeholderTextColor={colors.textDisabled}
              keyboardType="decimal-pad"
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150)}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.categorias}>
              {CATEGORIAS.map((cat) => (
                <CategoriaChip
                  key={cat.id}
                  categoria={cat}
                  seleccionada={categoria === cat.id}
                  onSelect={handleCategoria}
                  colors={colors}
                />
              ))}
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(225)}>
            <Text style={styles.label}>Fecha</Text>
            {Platform.OS === "web" ? (
              <TextInput
                mode="outlined"
                label="DD-MM-AAAA"
                value={fechaTexto}
                onChangeText={handleFechaTexto}
                style={{ backgroundColor: colors.inputBackground }}
                contentStyle={styles.inputContent}
                outlineColor={colors.inputBorder}
                activeOutlineColor={colors.primary}
                placeholder="20-11-2026"
                placeholderTextColor={colors.textDisabled}
                autoCapitalize="none"
                autoCorrect={false}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.fechaBoton, { backgroundColor: colors.inputBackground, borderColor: colors.inputBorder }]}
                  onPress={() => setShowPicker(true)}
                >
                  <Text style={styles.fechaTexto}>{fechaLegible(fecha)}</Text>
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
              </>
            )}
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300)}>
            <ComprobanteAdjunto uri={comprobanteUri} onChange={setComprobanteUri} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(375)}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={loading}
              style={styles.boton}
              contentStyle={styles.botonContenido}
            >
              {loading ? "Guardando..." : "Guardar gasto"}
            </Button>
          </Animated.View>
        </ScreenWrapper>
      </KeyboardAvoidingView>

      <Portal>
        <Dialog visible={dialog !== null} onDismiss={() => setDialog(null)}>
          <Dialog.Title>{dialog?.title}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{dialog?.message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                const accion = dialog?.onAction;
                setDialog(null);
                accion?.();
              }}
            >
              {dialog?.actionLabel ?? "Aceptar"}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

function fechaISO(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function fechaParaInput(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

function fechaISODesdeTexto(valor: string): string | null {
  const coincidencia = /^(\d{2})-(\d{2})-(\d{4})$/.exec(valor.trim().replace(/\//g, "-"));
  if (!coincidencia) return null;
  const iso = `${coincidencia[3]}-${coincidencia[2]}-${coincidencia[1]}`;
  return esFechaISOValida(iso) ? iso : null;
}

function fechaDesdeTexto(valor: string): Date | null {
  const iso = fechaISODesdeTexto(valor);
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function fechaLegible(date: Date): string {
  const hoy = hoyISO();
  return fechaISO(date) === hoy ? "Hoy" : date.toLocaleDateString("es-CL");
}

// Solo estructura: los colores se aplican arriba con useTheme().
const styles = StyleSheet.create({
  flex: { flex: 1 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 16 },
  inputContent: { fontSize: 16 },
  categorias: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chipWrap: { position: "relative" },
  chip: { marginRight: 0, borderWidth: 1.5 },
  chipTexto: { fontSize: 14 },
  chipTextoSeleccionado: { fontWeight: "700" },
  checkBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
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