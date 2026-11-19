// La URL base del servidor se define en .env con EXPO_PUBLIC_API_URL.
// Ejemplos:
//   Android emulador -> http://10.0.2.2:3002
//   iOS/web          -> http://localhost:3002
//   Dispositivo real -> http://<IP-de-tu-PC>:3002
const BASE_URL = process.env.EXPO_PUBLIC_API_URL?.trim().replace(/\/+$/, "");

if (!BASE_URL) {
  throw new Error(
    "Falta EXPO_PUBLIC_API_URL. Copiá .env.example a .env y configurá la URL del servidor."
  );
}

export const API_URL = `${BASE_URL}/gastos`;

// Interfaz adaptada a tus gastos para TypeScript
export interface Gasto {
  id: number; // lo autogenera el servidor
  lugar: string;
  categoria: string; // id del catálogo, ej: "comida"
  monto: number;
  fecha: string; // "YYYY-MM-DD"
  comprobanteUri?: string; // URI persistente en documentDirectory del comprobante (opcional)
}

// Datos que hay que enviar para crear un gasto (el id lo genera el servidor)
export interface CreateGastoData {
  lugar: string;
  categoria: string;
  monto: number;
  fecha: string;
  comprobanteUri?: string; // URI persistente en documentDirectory del comprobante (opcional)
}