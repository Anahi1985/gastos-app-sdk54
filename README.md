# Gastos App — SDK 54 · Tema (Clase 5)

Aplicación de registro de gastos en **Expo SDK 54 / React Native** que trabaja con un **tema global claro/oscuro** y una **paleta de marca centralizada** con colores por categoría.

## Qué se aplicó en esta clase

- Tema claro/oscuro global controlado por un `ThemeProvider` propio.
- **Paleta centralizada**: todos los `#` de color viven en `constants/theme.ts`.
- Traducción automática de la paleta al tema Material 3 de `react-native-paper`.
- `StatusBar` que invierte el color de los íconos según el tema.
- Colores de las categorías del catálogo (comida, hogar, transporte…).

### Regla de oro

> Ningún color con `#` fuera de `constants/theme.ts`.

Si un componente necesita un color, siempre sale de `useTheme()` (colores de marca) o de `categoryColors` (categoría). Así el tema se mantiene consistente y es fácil de cambiar.

## Archivos clave

```
constants/theme.ts        # Paleta de marca (light/dark), colores de categorías, getPaperTheme()
context/ThemeContext.tsx  # ThemeProvider + hook useTheme()
app/_layout.tsx           # Aplicación del tema (Provider de Paper + StatusBar)
```

### `constants/theme.ts`

- **`lightColors`** — paleta clara: fondo violeta/grisáceo suave, tarjetas blancas, texto azul/violeta muy oscuro, acento púrpura `#6D28D9`.
- **`darkColors`** — paleta oscura del mismo tipo (`Colors`): fondo violeta nocturno profundo, superficies elevadas, acento violeta pastel `#A78BFA`.
- **`categoryColors`** — un color por categoría (comida, hogar, transporte, salud, educación, vestimenta, servicios, entretenimiento, impuestos, mascotas, otro).
- **`getPaperTheme(colors, scheme)`** — construye un `MD3Theme` para `react-native-paper` usando como base el tema claro u oscuro de Paper y sobreescribiendo sus `colors` con la paleta de marca (`primary`, `surface`, `background`, `elevation`, etc.).

```ts
import { getPaperTheme } from "@/constants/theme";

const paperTheme = getPaperTheme(colors, theme); // colors: lightColors | darkColors
```

### `context/ThemeContext.tsx`

- **`ThemeProvider`** — guarda el estado del tema (`"light" | "dark"`) y lo comparte por Context.
- **`useTheme()`** — hook propio que devuelve `{ theme, colors, toggleTheme }`. Lanza un error si se usa fuera de un `<ThemeProvider>`.
- **¿Por qué `useMemo` y `useCallback`?** — sin `useMemo`, `value` sería un objeto nuevo en cada render del Provider y **todos** los consumidores se re-renderizarían aunque el tema no cambiara. `useCallback` mantiene estable la identidad de `toggleTheme`.

```tsx
const { theme, colors, toggleTheme } = useTheme();
```

### `app/_layout.tsx`

Orden de providers:

```tsx
<ThemeProvider>
  <SafeAreaProvider>
    <PaperProvider theme={getPaperTheme(colors, theme)}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <TabNavigator />
    </PaperProvider>
  </SafeAreaProvider>
</ThemeProvider>
```

- `SafeAreaProvider` → necesario para `SafeAreaView`.
- `PaperProvider` → aplica la paleta de marca a `react-native-paper`.
- `StatusBar` → fondo oscuro → íconos claros, y viceversa.


# gastos-app-sdk54
# gastos-app-sdk54
