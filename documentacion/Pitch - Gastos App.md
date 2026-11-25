# Pitch y presentación — Gastos App

Guion para una presentación técnica de aproximadamente 5 minutos. La demo debe hacerse desde el build `preview` o desde el dispositivo donde ya se validó la app.

## 1. Introducción (20–30 s)

Hola, hoy presentamos **Gastos App**, una aplicación móvil hecha con **Expo SDK 54 y React Native** para registrar gastos personales y responder rápido: “¿cuánto gasté este mes y en qué?”.

## 2. Problema (1 min)

Anotar gastos en papel, notas sueltas o planillas es lento y termina generando olvidos. Cuando queremos saber cuánto gastamos en comida, transporte o salud, los datos están dispersos y no hay una vista clara por mes ni por categoría.

Necesitábamos una app simple, que funcione en el celular, con datos persistidos y sin depender de un servidor propio.

## 3. Solución (1 min)

Gastos App permite crear, listar y borrar gastos con monto, lugar, categoría, fecha y comprobante opcional. Incluye:

- **Drawer + Tabs** para Inicio, Gastos, Resumen, Estadísticas y Ajustes.
- **Resumen mensual** con navegación entre meses y porcentajes por categoría.
- **Estadísticas** con métricas generales o por mes y barras por categoría.
- **Tema claro/oscuro** persistido y paleta centralizada.
- **Cloud Firestore** como persistencia remota y comprobantes guardados en el dispositivo.

## 4. Demo funcional (30–45 s)

Flujo sugerido: abrir la app → crear un gasto → verlo en el listado → abrir Resumen → revisar Estadísticas → abrir el detalle → borrar con confirmación.

### Datos de prueba sugeridos

| Lugar | Categoría | Monto | Fecha |
| :--- | :--- | ---: | :--- |
| Supermercado | Comida | 12500 | 2026-11-20 |
| Taxi al trabajo | Transporte | 4500 | 2026-11-21 |
| Farmacia | Salud | 8000 | 2026-11-22 |

### Flujo de la demo

1. Abrir **Gastos** y mostrar los gastos precargados ordenados por fecha.
2. Tocar el **FAB** y completar “Nuevo gasto” con los datos de prueba.
3. Confirmar el cartel de éxito y volver al listado.
4. Abrir **Resumen** para mostrar el total del mes y los porcentajes por categoría.
5. Abrir **Estadísticas** y cambiar entre “Todo” y “Mes”.
6. Abrir el detalle de un gasto y borrarlo con confirmación real.

## 5. Detalles técnicos (45–60 s)

- **Expo SDK 54 / React Native 0.81.5** con `newArchEnabled`.
- **Expo Router**: `Stack` raíz, `Drawer` y `Tabs` anidados.
- **Firebase / Cloud Firestore**: `app/config/firebase.ts`, `constants/api.ts` y hooks con `loading`/`error`.
- **AsyncStorage**: tema persistido con `@gastos:theme`.
- **React Native Paper**: MD3, `Dialog`, `Portal` y componentes de UI.
- **Reanimated**: entradas en cascada, reacomodo de listas y transiciones.
- **EAS Build**: perfil `preview` con `.apk` interno.

## 6. Aprendizajes y desafíos (30 s)

Los principales desafíos fueron adaptar la app a la web, donde `Alert` no funciona y `DateTimePicker` no está disponible; estabilizar Firestore en React Native con long polling forzado; y mantener un solo sistema de colores mediante el tema MD3 y la regla de centralizar los hex en `constants/theme.ts`.

Como resultado, la app muestra errores reales con `Dialog`, convierte fechas `DD-MM-AAAA` a ISO antes de guardar y mantiene el tema consistente en claro y oscuro.

## 7. Futuro y cierre (30 s)

Las mejoras naturales son ingresos mensuales y balance, presupuestos por categoría con alertas, autenticación por usuario, comprobantes en Firebase Storage, consultas paginadas con soporte offline y ordenamiento cronológico con `createdAt` como marca ISO opcional. Están detalladas en la [ficha de alcance](./Ficha%20de%20alcance%20-%20Gastos%20App.md).

Muchas gracias por su atención. Estamos abiertos a preguntas.

## Checklist antes de presentar

- [ ] Preparar los gastos de prueba en Firestore o cargarlos durante la demo.
- [ ] Verificar conexión a internet o explicar el comportamiento sin conexión.
- [ ] Ensayar la navegación paso a paso.
- [x] Validado en dispositivo físico con el build `3e77acdc-f0c8-4586-a827-c323438a028b` (revalidar antes de presentar si cambia el entorno).
- [x] Tener un video de la demo como plan B: `demo_gastos_app.mp4`.
- [ ] Revisar tiempos: 5 minutos aproximados.
- [ ] Mostrar casos clave: instalación, flujo principal y diferenciador.

## Enlaces

- [README del proyecto](../README.md)
- [Ficha de alcance](./Ficha%20de%20alcance%20-%20Gastos%20App.md)
- [Demo funcional grabada (mp4)](./demo_gastos_app.mp4)
- [Build preview en EAS](https://expo.dev/accounts/nanhy/projects/gastos-app-sdk54/builds/3e77acdc-f0c8-4586-a827-c323438a028b) — requiere login con la cuenta `nanhy` para ver el artefacto.
