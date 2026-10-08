import { StatusBar } from "expo-status-bar";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { getPaperTheme } from "@/constants/theme";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

import TabNavigator from "./navigation/TabNavigator";


function RootLayoutNav() {
  const { theme, colors } = useTheme();

  return (
    /* SafeAreaProvider: Necesario para que SafeAreaView funcione correctamente. */
    <SafeAreaProvider>
      {/* PaperProvider: aplica la paleta de marca a react-native-paper . */}
      <PaperProvider theme={getPaperTheme(colors, theme)}>
        {/* StatusBar: fondo oscuro -> íconos claros, y viceversa */}
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        {/* TabNavigator: el componente que maneja la navegación principal. */}
        <TabNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}