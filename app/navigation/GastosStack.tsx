import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";

import { useTheme } from "@/context/ThemeContext";

import CrearGastoScreen from "../screens/CrearGastoScreen";
import DetalleGastoScreen from "../screens/DetalleGastoScreen";
import GastosScreen from "../screens/GastosScreen";

const Stack = createNativeStackNavigator();

function GastosStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Lista" component={GastosScreen} options={{ title: "Gastos" }} />

      <Stack.Screen
        name="Detalle"
        component={DetalleGastoScreen}
        options={{ title: "Detalle del gasto" }}
      />

      <Stack.Screen
        name="Crear"
        component={CrearGastoScreen}
        options={{ title: "Nuevo gasto" }}
      />
    </Stack.Navigator>
  );
}

export default GastosStack;