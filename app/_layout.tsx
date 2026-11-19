import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useMemo } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { getPaperTheme } from "@/constants/theme";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";

function RootLayoutNav() {
  const { theme, colors } = useTheme();
  const paperTheme = useMemo(() => getPaperTheme(colors, theme), [colors, theme]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={paperTheme}>
        <StatusBar style={theme === "dark" ? "light" : "dark"} />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.card },
            headerTintColor: colors.text,
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen
            name="detalle"
            options={{ title: "Detalle del gasto", headerShown: false }}
          />
          <Stack.Screen
            name="crear"
            options={{
              title: "Nuevo gasto",
              headerShown: false,
              presentation: Platform.OS === "ios" ? "modal" : "card",
              animation: "slide_from_bottom",
            }}
          />
        </Stack>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
