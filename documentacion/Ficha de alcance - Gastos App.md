# Ficha de alcance — Gastos App

**Para qué sirve:** definir qué se construyó y qué NO para el proyecto final. Esta ficha se completó con el estado actual de `gastos-app-sdk54`, siguiendo la plantilla de la clase y lo pedido en Clase 11: alcance, flujos de navegación y animaciones clave. Se completa antes de programar y se ajusta durante las Clases 12 y 13; acá queda la versión definitiva del proyecto ya implementado.

> **Regla de oro:** un alcance chico y terminado vale más que uno enorme a medias. Si dudás si algo entra, **no entra** (queda en “para después”).

**Entrega:** repositorio [gastos-app-sdk54](https://github.com/Anahi1985/gastos-app-sdk54) y build/APK Android con EAS `preview` (`com.nanhy.gastosappsdk54`).

---

## Ficha completada

| # | Pregunta | Respuesta |
| :-: | :--- | :--- |
| 1 | **Nombre de la app** y **una frase** que la explique | **Gastos** — una app para registrar gastos personales con monto, categoría, fecha y comprobante local, y ver cuánto se gastó por mes y por categoría. |
| 2 | **¿Para quién es?** (público objetivo) | Personas que quieren controlar sus gastos diarios desde el celular. En esta entrega: usuario de prueba del curso. |
| 3 | **¿Qué problema resuelve?** | Anotar un gasto rápido y responder “¿cuánto gasté este mes y en qué?” sin planillas ni servidor propio. |
| 4 | **Funciones clave** (máximo 5 — lo que SÍ o SÍ tiene que andar) | 1. Registrar gasto (monto, lugar, categoría, fecha ISO y comprobante opcional) en Firestore.<br>2. Listar gastos ordenados por fecha y eliminar con confirmación real.<br>3. Ver resumen mensual: total del mes, porcentaje por categoría y navegación entre meses.<br>4. Ver estadísticas generales o por mes, con métricas y barras por categoría.<br>5. Cambiar entre tema claro/oscuro y navegar con Drawer + Tabs. |
| 5 | **Lo que NO hace** (por ahora) | Inicio de sesión/Auth · editar gastos · subir comprobantes a la nube · notificaciones · presupuestos · exportar datos · varios perfiles · sincronización offline de datos · API REST/servidor propio (`json-server` fue eliminado). |
| 6 | **Pantallas** (lista) | Inicio → pestañas **Gastos** y **Resumen** · **Estadísticas** · **Ajustes** · **Nuevo gasto** (`crear`) · **Detalle del gasto** (`detalle`). |
| 7 | **Mapa de navegación** (dibujo o esquema, ver abajo) | Ver abajo. |
| 8 | **Datos:** ¿de dónde vienen y dónde se guardan? | **Gastos:** Firestore, base `(default)`, colección `gastos`, con `fecha` en ISO `YYYY-MM-DD` para ordenar. **Tema:** `AsyncStorage` en el celular. **Formularios/filtros:** `useState`. **Comprobante:** imagen local en el dispositivo (`comprobanteUri`), no se sube a la nube. |
| 9 | **¿Hay usuarios / inicio de sesión?** ¿Para qué? | No. La app funciona en **modo prueba**; no identifica quién crea cada gasto. |
| 10 | **¿Funciona sin internet?** ¿Qué se guarda en el celular? | El tema y la interfaz abren sin conexión. El listado, el alta, el borrado y las estadísticas necesitan Firestore/Internet; si falla, se muestra un mensaje real en un `Dialog` y se puede reintentar. En web, la fecha se escribe como `DD-MM-AAAA` y se convierte a ISO antes de guardar. |
| 11 | **3 animaciones clave** (¿en qué momentos y por qué?) | 1. Las listas y barras entran en cascada con `FadeInDown` + delay para mostrar jerarquía.<br>2. Al cambiar de mes o recalcular totales, `LinearTransition` reacomoda suavemente las filas.<br>3. Al abrir detalle/ajustes, `ZoomIn.springify()` da feedback de entrada; el formulario escalona sus campos con `FadeInDown`. |
| 12 | **Riesgos** (¿qué podría salir mal?) y **plan B** | Si falla Firebase o la red → error visible en `Dialog` con reintento. Si falla el celular/emulador → probar en navegador o con APK EAS. En web, `Alert` no existe y `DateTimePicker` no funciona → se usan `Dialog` de Paper y texto `DD-MM-AAAA`. En `app/config/firebase.ts` se usa `useFetchStreams: false` con long polling forzado (`experimentalForceLongPolling: true`, `experimentalAutoDetectLongPolling: false`) para estabilizar React Native en redes o emuladores con restricciones. Los comprobantes son locales: se pierden al desinstalar. |
| 13 | **Hitos:** qué estará listo en la Clase 12 / 13 / 14 | **Clase 12:** Firestore con CRUD real, Drawer + Tabs, tema y estadísticas.<br>**Clase 13:** QA, correcciones web/fecha y build EAS `preview`.<br>**Clase 14:** entrega con APK y esta ficha como documentación del alcance. |

### Mapa de navegación (pregunta 7)

Mismo esquema pedido en la Clase 10:

```text
Stack
├── Drawer ─┬── Inicio ── Tabs ─┬── Gastos
│           │                   └── Resumen
│           ├── Estadísticas
│           └── Ajustes
├── crear (Nuevo gasto)
└── detalle (Detalle del gasto)
```

### ¿Dónde guardo cada dato? (pregunta 8) — guía aplicada

| Tipo de dato | Dónde | Ejemplo en esta app |
| :--- | :--- | :--- |
| Preferencias de **ese** celular | `AsyncStorage` | Modo claro/oscuro. |
| Datos que **ven varias personas** en tiempo real | `Firestore` (Firebase) | Colección `gastos`; `fecha` ISO permite ordenar por `orderBy("fecha", "desc")`. |
| Datos solo mientras la pantalla está abierta | `useState` | Texto del formulario, mes seleccionado, filtro “todo/mes”, estado de los `Dialog`. |
| Comprobante del gasto | Archivo local en el celular | `comprobanteUri` se muestra en el detalle; no se sube a la nube. |
| Datos de **un servidor propio** o API pública | No se usa | El antiguo `json-server` quedó fuera del alcance y fue eliminado. |

### ¿Dónde van las animaciones? (pregunta 11) — guía aplicada

| Momento | Idea | Implementación |
| :--- | :--- | :--- |
| Entra una lista | Cascada (`FadeInDown` con `delay`) | `GastoItem`, `CategoriaBarChart` y `app/crear.tsx`. |
| Cambia el mes o se recalculan totales | Los elementos se reacomodan sin salto | `itemLayoutAnimation={LinearTransition}` en `index.tsx` y `resumen.tsx`. |
| Se abre detalle o ajustes | Escala con rebote | `ZoomIn.springify()` en `detalle.tsx` y `ajustes.tsx`. |

## Correcciones contempladas

- Persistencia en Firestore: quedaron fuera `db.json`, `json-server`, `10.0.2.2`, `EXPO_PUBLIC_API_URL`, puerto `3000` y `/users`.
- Alta y borrado con `{ ok, error }`, `loading`/`error`, `Dialog` en web y fecha `DD-MM-AAAA` convertida a ISO.
- Validación de monto y fecha antes de guardar; ningún `err: any` (se usa `e instanceof Error`).
- Paletas claras/oscuras traducidas a MD3 con `getPaperTheme()`, `useMemo`/`useCallback` y regla del color aplicada a `.ts`/`.tsx`. Única excepción nativa: los 3 colores de `app.json` para icono y splash.
- FAB con `primary`/`onPrimary`, `Text`/`TextInput` de Paper y copia del array antes de ordenar en `GastosScreen`.
- Permisos con `AppState` y `!canAskAgain` → “Abrir configuración”; comprobante copiado a `documentDirectory` antes de guardar.
- README con instrucciones de ejecución, Firebase, EAS, esta ficha y capturas.

## Escalabilidad y mejoras futuras

Estas funcionalidades quedan fuera del alcance actual del TIF y son líneas naturales de evolución para próximas versiones de Gastos App:

- **Ingresos mensuales y balance:** registrar un ingreso base o múltiples ingresos por mes para calcular el saldo disponible frente al total de gastos del período.
- **Presupuestos por categoría y alertas:** configurar topes mensuales por categoría (Comida, Transporte, Salud, etc.) y mostrar avisos preventivos al alcanzar o superar el umbral.
- **Autenticación y aislamiento por usuario:** integrar Firebase Authentication y asociar los documentos de Firestore a un `userId`, con reglas de seguridad por usuario.
- **Comprobantes en la nube:** actualmente la app almacena únicamente la referencia local del archivo en el dispositivo (comprobanteUri), por lo que la imagen no se sube ni se visualiza desde otros equipos. Como mejora futura, se plantea integrar Firebase Storage para subir el archivo binario y guardar su URL pública/descargable en Firestore, permitiendo consultar los comprobantes desde cualquier dispositivo.
- **Consultas y modo offline:** agregar paginación y caché local sincronizada para sostener el rendimiento con historiales grandes.

---

## Chequeo final de un buen alcance

- [x] Cabe en **5 funciones clave** como máximo.
- [x] Cada pantalla tiene **un propósito claro**.
- [x] Sé **de dónde viene cada dato** y **dónde se guarda**.
- [x] Tengo escrito **lo que NO hace**.
- [x] Es algo que puedo **terminar y probar** antes de la Clase 14.
- [x] Tengo un **plan B** si falla una parte (Internet, Firebase, web).
- [x] Validación en vivo realizada en celular.
