import { Platform } from "react-native";

// IP de tu PC para el emulador de Android (ipconfig -> IPv4).
// En iOS/web se usa localhost. Podés sobrescribirlo con EXPO_PUBLIC_API_URL.
const IP_LOCAL = "10.0.2.2";

const DEFAULT_BASE_URL =
  Platform.OS === "android" ? `http://${IP_LOCAL}:3001` : "http://localhost:3001";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? DEFAULT_BASE_URL;

export const API_URL = `${BASE_URL}/gastos`;

// Interfaz adaptada a tus gastos para TypeScript
export interface Gasto {
  id: number; // lo autogenera el servidor
  lugar: string;
  categoria: string; // id del catálogo, ej: "comida"
  monto: number;
  fecha: string; // "YYYY-MM-DD"
}

// Datos que hay que enviar para crear un gasto (el id lo genera el servidor)
export interface CreateGastoData {
  lugar: string;
  categoria: string;
  monto: number;
  fecha: string;
}