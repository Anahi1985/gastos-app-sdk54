import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";

import { useTheme } from "@/context/ThemeContext";

import ResumenScreen from "../screens/ResumenScreen";
import GastosStack from "./GastosStack";

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabBarInactive,
        tabBarStyle: { backgroundColor: colors.card },
      }}
    >
      <Tab.Screen
        name="GastosTab"
        component={GastosStack}
        options={{
          title: "Gastos",
          headerShown: false, 
          tabBarLabel: "Gastos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ResumenTab"
        component={ResumenScreen}
        options={{
          title: "Resumen",
          headerShown: false, 
          tabBarLabel: "Resumen",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;