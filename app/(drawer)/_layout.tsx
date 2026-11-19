import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { IconButton } from "react-native-paper";

import { useTheme } from "@/context/ThemeContext";

export default function DrawerLayout() {
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        drawerStyle: { backgroundColor: colors.background },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerType: "slide",
        overlayColor: colors.drawerOverlay,
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Inicio",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
          headerRight: () => (
            <IconButton
              icon={theme === "dark" ? "weather-sunny" : "weather-night"}
              iconColor={colors.primary}
              onPress={toggleTheme}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="estadisticas"
        options={{
          title: "Estadísticas",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="ajustes"
        options={{
          title: "Ajustes",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}
