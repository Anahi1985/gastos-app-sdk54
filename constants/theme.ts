import { MD3DarkTheme, MD3LightTheme, MD3Theme } from "react-native-paper";


export const lightColors = {
 
  background: "#F0EFFB",        // Fondo violeta/grisáceo suave (resalta las tarjetas blancas)
  surface: "#FFFFFF",           // Tarjetas blancas puras
  card: "#FFFFFF",

  // Textos
  text: "#1E1B4B",              // Azul/violeta muy oscuro (más elegante que el negro plano)
  textSecondary: "#625E8A",
  textDisabled: "#9CA3AF",

  // Acciones y estados
  primary: "#6D28D9",           // Violeta/Púrpura vibrante (en lugar de azul/gris estándar)
  primaryContainer: "#DDD6FE",  // Contenedor claro bien visible para chips/badges
  onPrimary: "#FFFFFF",
  onPrimaryContainer: "#3B0764",
  secondary: "#FF6B6B",      
  success: "#10B981",
  error: "#EF4444",
  onError: "#FFFFFF",

  // Bordes e inputs
  border: "#D1D5DB",
  inputBackground: "#FFFFFF",
  inputBorder: "#C7D2FE",       // Borde con toque púrpura en inputs
  inputText: "#1E1B4B",

  // Barra de pestañas
  tabBarInactive: "#8B5CF6",
};


export type Colors = typeof lightColors;

export const darkColors: Colors = {
  // Fondos: En lugar de negro puro, un tono noche abisal profundo
  background: "#0F0C1B",        // Violeta oscuro profundo
  surface: "#1D1933",           // Superficie elevada violeta noche
  card: "#1D1933",

  // Textos
  text: "#F9FAFB",
  textSecondary: "#C7D2FE",
  textDisabled: "#6B7280",

  // Acciones y estados para modo oscuro
  primary: "#A78BFA",           // Violeta pastel fluorescente (destaca mucho de noche)
  primaryContainer: "#6D28D9",
  onPrimary: "#0F0C1B",
  onPrimaryContainer: "#FFFFFF",
  secondary: "#FF8E8E",
  success: "#34D399",
  error: "#F87171",
  onError: "#0F0C1B",

  // Bordes e inputs
  border: "#3730A3",
  inputBackground: "#1D1933",
  inputBorder: "#4C1D95",
  inputText: "#F9FAFB",

  // Barra de pestañas
  tabBarInactive: "#6B7280",
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

// Colores de las categorías del catálogo 
export const categoryColors = {
  comida: "#FF7043",
  hogar: "#42A5F5",
  transporte: "#26C6DA",
  salud: "#EF5350",
  educacion: "#7E57C2",
  vestimenta: "#EC407A",
  servicios: "#FFCA28",
  entretenimiento: "#AB47BC",
  impuestos: "#5C6BC0",
  mascotas: "#8D6E63",
  otro: "#78909C",
} satisfies Record<string, string>;


export function getPaperTheme(colors: Colors, scheme: "light" | "dark"): MD3Theme {
  const base = scheme === "dark" ? MD3DarkTheme : MD3LightTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      primaryContainer: colors.primaryContainer,
      onPrimary: colors.onPrimary,
      onPrimaryContainer: colors.onPrimaryContainer,
      secondary: colors.secondary,
      background: colors.background,
      surface: colors.surface,
    
      surfaceVariant: colors.primaryContainer,
      onSurfaceVariant: colors.onPrimaryContainer,

      onSurface: colors.text,
      onBackground: colors.text,
      error: colors.error,
      onError: colors.onError,
      outline: colors.border,
      elevation: {
        ...base.colors.elevation,
        level0: colors.background,
        level1: colors.card,
        level2: colors.surface,
      },
    },
  };
}