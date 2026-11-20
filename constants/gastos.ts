// El nombre de la colección de Firebase
export const GASTOS_COLLECTION = "gastos";

export interface Gasto {
  id: string;
  lugar: string;
  monto: number;
  categoria: string;
  fecha: string;
  comprobanteUri?: string;
}