# API local (json-server) — legacy

Mock REST que se usó antes de migrar la app a **Cloud Firestore**. Los datos persisten en `db.json`.

> La app actual ya no consume este servidor. La lógica activa está en `hooks/use-gastos.tsx`, `hooks/use-post-gasto.tsx` y `app/config/firebase.ts`. Este directorio se conserva solo como referencia de la API anterior.

## Uso

```bash
npm install
npm run dev      # http://localhost:3002 (escucha en 0.0.0.0)
```

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/gastos` | Lista de gastos |
| POST | `/gastos` | Crea un gasto (el `id` lo genera el servidor) |
| GET | `/gastos?categoria=comida` | Filtra por categoría |
| GET | `/gastos?fecha_gte=2026-10-01` | Gastos desde una fecha |

Ejemplo de gasto:

```json
{
  "lugar": "Supermercado",
  "categoria": "comida",
  "monto": 5000,
  "fecha": "2026-10-06"
}
```

`categoria` es el **id estable** del catálogo definido en `../constants/categories.ts`
(`comida`, `hogar`, `transporte`, `salud`, `educacion`, `vestimenta`, `servicios`,
`entretenimiento`, `impuestos`, `mascotas`, `otro`).

## Configuración desde la app

La versión anterior leía la URL base del servidor desde `EXPO_PUBLIC_API_URL`. Esa variable ya no se usa; la configuración activa son las variables `EXPO_PUBLIC_FIREBASE_*` documentadas en `../.env.example`.
