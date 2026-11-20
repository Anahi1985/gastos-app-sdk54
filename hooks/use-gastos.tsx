import { useCallback, useEffect, useState } from "react";

import { collection, getDocs, orderBy, query } from "firebase/firestore";

import { db } from "@/config/firebase";
import { Gasto } from "@/constants/gastos";

export function useGetGastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getGastos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!db) {
        throw new Error(
          "Firebase no está configurado. Revisá las variables EXPO_PUBLIC_FIREBASE_* en .env."
        );
      }

      const gastosQuery = query(
        collection(db, "gastos"),
        orderBy("fecha", "desc")
      );
      const snapshot = await getDocs(gastosQuery);
      const data = snapshot.docs.map((doc) => ({
        ...(doc.data() as Omit<Gasto, "id">),
        id: doc.id,
      }));
      setGastos(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar los gastos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getGastos();
  }, [getGastos]);

  return { gastos, loading, error, getGastos };
}
