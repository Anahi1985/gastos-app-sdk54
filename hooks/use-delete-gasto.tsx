import { useCallback, useState } from "react";

import { deleteGasto as removeGasto } from "@/constants/api";

type DeleteGastoResult = { ok: boolean; error?: string };

/** Hook que elimina un gasto de Firestore y expone su estado de operación. */
export function useDeleteGasto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteGasto = useCallback(async (id: string): Promise<DeleteGastoResult> => {
    setLoading(true);
    setError(null);
    try {
      await removeGasto(id);
      return { ok: true };
    } catch (e) {
      const mensaje = e instanceof Error ? e.message : "Error al eliminar el gasto";
      setError(mensaje);
      return { ok: false, error: mensaje };
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteGasto, loading, error };
}
