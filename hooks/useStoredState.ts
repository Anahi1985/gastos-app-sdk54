import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let active = true;

    const loadValue = async () => {
      try {
        const saved = await AsyncStorage.getItem(key);
        if (saved !== null && active) setValue(JSON.parse(saved) as T);
      } catch (error) {
        console.error("Error al leer", key, error);
      } finally {
        if (active) setIsReady(true);
      }
    };

    loadValue();
    return () => {
      active = false;
    };
  }, [key]);

  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem(key, JSON.stringify(value)).catch((error) =>
      console.error("Error al guardar", key, error)
    );
  }, [key, value, isReady]);

  return [value, setValue, isReady] as const;
}
