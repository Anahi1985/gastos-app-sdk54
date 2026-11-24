import { useCallback, useState } from "react";

import { createGasto, type CreateGastoData } from "@/constants/api";

type SaveGastoResult = { ok: boolean; error?: string };

/** Hook que crea un gasto en Firestore y expone su estado de guardado. */
export function usePostGasto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveGasto = useCallback(async (gastoData: CreateGastoData): Promise<SaveGastoResult> => {
    setLoading(true);
    setError(null);
    try {
      await createGasto(gastoData);
      return { ok: true };
    } catch (e) {
      const mensaje = e instanceof Error ? e.message : "Error al guardar el gasto";
      setError(mensaje);
      return { ok: false, error: mensaje };
    } finally {
      setLoading(false);
    }
  }, []);

  return { saveGasto, loading, error };
}
