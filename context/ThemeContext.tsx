import { Colors, darkColors, lightColors } from "@/constants/theme";
import { useStoredState } from "@/hooks/useStoredState";
import { createContext, ReactNode, useCallback, useContext, useMemo } from "react";

export type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  colors: Colors;
  toggleTheme: () => void;
}

// undefined = "nadie me proveyó": lo usamos para detectar el error en useTheme.
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [storedTheme, setStoredTheme] = useStoredState<Theme>("@gastos:theme", "light");
  const theme: Theme = storedTheme === "dark" ? "dark" : "light";

  // useCallback : toggleTheme mantiene la misma identidad entre renders.
  const toggleTheme = useCallback(() => {
    setStoredTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, [setStoredTheme]);

  // useMemo : sin esto, "value" es un objeto nuevo en cada render del Provider
  // y TODOS los consumidores se re-renderizan aunque el tema no haya cambiado.
  const value = useMemo(
    () => ({ theme, colors: theme === "light" ? lightColors : darkColors, toggleTheme }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Hook propio : los componentes no conocen useContext ni ThemeContext.
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme debe usarse dentro de un <ThemeProvider>");
  }
  return context;
}