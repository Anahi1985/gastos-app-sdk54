import { useCallback, useState } from "react";

import { API_URL, CreateGastoData } from "@/constants/api";

export function usePostGasto() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveGasto = useCallback(async (gastoData: CreateGastoData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gastoData),
      });
      if (!response.ok) {
        throw new Error(`Error del servidor (${response.status})`);
      }
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