import { useCallback, useEffect, useState } from "react";

import { API_URL, Gasto } from "@/constants/api";

export function useGetGastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getGastos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Error del servidor (${response.status})`);
      }
      const data: Gasto[] = await response.json();
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