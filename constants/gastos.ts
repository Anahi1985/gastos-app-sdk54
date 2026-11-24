/** Nombre de la colección de gastos en Cloud Firestore. */
export const GASTOS_COLLECTION = "gastos";

/** Modelo de un gasto persistido en Firestore. */
export interface Gasto {
  id: string;
  lugar: string;
  monto: number;
  categoria: string;
  fecha: string;
  comprobanteUri?: string;
}