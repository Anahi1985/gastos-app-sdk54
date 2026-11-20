import { useCallback, useState } from "react";

import { addDoc, collection } from "firebase/firestore";

import { db } from "@/config/firebase";
import { CreateGastoData } from "@/constants/api";

export function usePostGasto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveGasto = useCallback(async (gastoData: CreateGastoData) => {
    setLoading(true);
    setError(null);
    try {
      if (!db) {
        throw new Error(
          "Firebase no está configurado. Revisá las variables EXPO_PUBLIC_FIREBASE_* en .env."
        );
      }

      await addDoc(collection(db, "gastos"), gastoData);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar el gasto");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { saveGasto, loading, error };
}
