import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Switch, View } from "react-native";
import { Text } from "react-native-paper";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

import ScreenWrapper from "@/components/ScreenWrapper";
import { useTheme } from "@/context/ThemeContext";

export default function AjustesScreen() {
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <ScreenWrapper>
      <View style={styles.hero}>
        <Animated.View
          entering={ZoomIn.springify()}
          style={[styles.icono, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="settings-outline" size={40} color={colors.onPrimary} />
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(150)}>
          <Text style={styles.titulo}>Ajustes</Text>
        </Animated.View>
        <Animated.View entering={FadeInDown.delay(225)}>
          <Text style={[styles.subtitulo, { color: colors.textSecondary }]}>
            Personalizá la apariencia de la app.
          </Text>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInDown.delay(300)}
        style={[styles.fila, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.filaTexto}>
          <Text style={styles.filaTitulo}>Modo oscuro</Text>
          <Text style={[styles.filaSubtitulo, { color: colors.textSecondary }]}>
            {theme === "dark" ? "Activado" : "Desactivado"}
          </Text>
        </View>
        <Switch value={theme === "dark"} onValueChange={toggleTheme} />
      </Animated.View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", paddingVertical: 24 },
  icono: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  titulo: { fontSize: 24, fontWeight: "bold" },
  subtitulo: { fontSize: 15, marginTop: 6, textAlign: "center" },
  fila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 8,
  },
  filaTexto: { flex: 1, marginRight: 12 },
  filaTitulo: { fontSize: 16, fontWeight: "600" },
  filaSubtitulo: { fontSize: 13, marginTop: 2 },
});
