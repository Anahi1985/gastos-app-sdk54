# API local (json-server)

Mock REST para desarrollo de la app de gastos. Los datos persisten en `db.json`.

## Uso

```bash
npm install
npm run dev      # http://127.0.0.1:3001
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

La app lee la variable de entorno `EXPO_PUBLIC_API_URL` (ver `../.env.example`).
Si no está definida, usa por defecto:

- Android emulador: `http://10.0.2.2:3001`
- iOS / web / dispositivo físico: `http://localhost:3001`

Para dispositivo físico, define `EXPO_PUBLIC_API_URL=http://<IP-de-tu-PC>:3001`.
