import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query } from "firebase/firestore";

import { db } from "@/app/config/firebase";
import { GASTOS_COLLECTION, type Gasto } from "./gastos";

export { GASTOS_COLLECTION };
export type { Gasto };
/** Datos necesarios para crear un gasto; el id lo genera Firestore. */
export type CreateGastoData = Omit<Gasto, "id">;

function getDb() {
  if (!db) {
    throw new Error(
      "Firebase no está configurado. Revisá las variables EXPO_PUBLIC_FIREBASE_* en .env."
    );
  }
  return db;
}

/** Obtiene todos los gastos de Firestore ordenados por fecha descendente. */
export async function getGastos(): Promise<Gasto[]> {
  const firestore = getDb();
  const gastosQuery = query(
    collection(firestore, GASTOS_COLLECTION),
    orderBy("fecha", "desc")
  );
  const snapshot = await getDocs(gastosQuery);
  return snapshot.docs.map((documento) => ({
    ...(documento.data() as Omit<Gasto, "id">),
    id: documento.id,
  }));
}

/** Crea un gasto en Firestore y devuelve el documento con su id generado. */
export async function createGasto(data: CreateGastoData): Promise<Gasto> {
  const firestore = getDb();
  const payload: Record<string, unknown> = {
    lugar: data.lugar,
    categoria: data.categoria,
    monto: Number(data.monto),
    fecha: data.fecha,
  };
  if (data.comprobanteUri) payload.comprobanteUri = data.comprobanteUri;

  const docRef = await addDoc(collection(firestore, GASTOS_COLLECTION), payload);
  return { id: docRef.id, ...data };
}

/** Elimina de Firestore el gasto identificado por `id`. */
export async function deleteGasto(id: string): Promise<void> {
  const firestore = getDb();
  await deleteDoc(doc(firestore, GASTOS_COLLECTION, id));
}
