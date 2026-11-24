import { useCallback, useEffect, useState } from "react";

import { getGastos as fetchGastos } from "@/constants/api";
import { Gasto } from "@/constants/gastos";

/** Hook que carga y expone los gastos almacenados en Cloud Firestore. */
export function useGetGastos() {
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getGastos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGastos();
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
