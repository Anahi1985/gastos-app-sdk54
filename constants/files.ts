import { Directory, File, Paths } from "expo-file-system";
import { Platform } from "react-native";

const CARPETA_COMPROBANTES = "comprobantes";

// Copia la imagen temporal (caché) a documentDirectory para que no desaparezca.
export function persistirComprobante(origen: string): string {
  if (Platform.OS === "web") return origen;

  const carpeta = new Directory(Paths.document, CARPETA_COMPROBANTES);
  if (!carpeta.exists) {
    carpeta.create({ intermediates: true, idempotent: true });
  }

  const archivoOrigen = new File(origen);
  const extension = archivoOrigen.extension || ".jpg";
  const destino = new File(carpeta, `comprobante-${Date.now()}${extension}`);

  archivoOrigen.copy(destino);
  return destino.uri;
}

export function eliminarComprobante(uri: string): void {
  if (Platform.OS === "web") return;
  try {
    const archivo = new File(uri);
    if (archivo.exists) archivo.delete();
  } catch {
    // Si el archivo ya no existe o no se puede borrar, no hacemos nada.
  }
}
