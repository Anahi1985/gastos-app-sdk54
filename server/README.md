# API local (json-server)

Mock REST para desarrollo de la app de gastos. Los datos persisten en `db.json`.

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

La app lee la URL base del servidor desde la variable `EXPO_PUBLIC_API_URL` (ver `../.env.example`).
No incluyas `/gastos` al final: la app lo agrega automáticamente.

```bash
# Desde la raíz del proyecto
cp .env.example .env
```

Ejemplos de valor:

- Android emulador: `http://10.0.2.2:3002`
- iOS / web: `http://localhost:3002`
- Dispositivo físico: `http://<IP-de-tu-PC>:3002`

Si la variable no está definida, la app muestra un error al iniciar. El servidor escucha en `0.0.0.0`, así que también es accesible desde la red local.
