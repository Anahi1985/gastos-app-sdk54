import { Ionicons } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  AppState,
  Linking,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";

import ComprobanteImage from "@/components/ComprobanteImage";
import { useTheme } from "@/context/ThemeContext";

interface ComprobanteAdjuntoProps {
  uri: string | null;
  onChange: (uri: string | null) => void;
}

export default function ComprobanteAdjunto({ uri, onChange }: ComprobanteAdjuntoProps) {
  const { colors } = useTheme();

  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission, getCameraPermission] =
    useCameraPermissions();

  // Al volver de Ajustes, volvemos a leer el permiso para reflejar el cambio.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (estado) => {
      if (estado === "active") {
        getCameraPermission();
      }
    });
    return () => subscription.remove();
  }, [getCameraPermission]);

  const abrirCamara = useCallback(() => {
    setShowCamera(true);
    getCameraPermission();
  }, [getCameraPermission]);

  const handleRequestPermission = useCallback(async () => {
    if (cameraPermission && !cameraPermission.canAskAgain) {
      // Si el sistema ya no permite pedir el permiso con el cartel flotante:
      await Linking.openSettings();
    } else {
      // Si todavía puede pedirlo normalmente:
      await requestCameraPermission();
    }
  }, [cameraPermission, requestCameraPermission]);

  // takePictureAsync captura y devuelve la ubicación temporal del archivo.
  const takePicture = async () => {
    if (!cameraRef.current) return;
    try {
      const result = await cameraRef.current.takePictureAsync({ quality: 0.85 });
      if (result?.uri) {
        onChange(result.uri);
        setShowCamera(false);
      }
    } catch {
      Alert.alert("Error", "No se pudo tomar la foto");
    }
  };

  const abrirGaleria = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 6],
      quality: 0.85,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      onChange(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    try {
      const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permiso.granted) {
        Alert.alert(
          "Permiso requerido",
          "Necesitamos acceso a tus fotos para adjuntar el comprobante",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Abrir configuración", onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }
      await abrirGaleria();
    } catch {
      Alert.alert("Error", "No se pudo seleccionar la imagen");
    }
  };

  return (
    <View>
      <Text style={styles.label}>Comprobante (opcional)</Text>

      <View style={styles.botones}>
        <Button
          mode="outlined"
          icon="camera"
          onPress={abrirCamara}
          style={styles.boton}
        >
          Tomar foto
        </Button>
        <Button
          mode="outlined"
          icon="image"
          onPress={pickFromGallery}
          style={styles.boton}
        >
          Galería
        </Button>
      </View>

      {uri && (
        <Card style={[styles.card, { backgroundColor: colors.card }]}>
          <Card.Content style={styles.contenido}>
            <ComprobanteImage uri={uri} height={240} />
          </Card.Content>
          <Card.Actions style={styles.acciones}>
            <IconButton
              icon="trash-can-outline"
              iconColor={colors.error}
              onPress={() => onChange(null)}
            />
          </Card.Actions>
        </Card>
      )}

      {/* Modal de cámara: overlay nativo sobre el formulario (no lo desmonta). */}
      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={() => setShowCamera(false)}
        statusBarTranslucent
        navigationBarTranslucent
      >
        {/* Escenario 1: el estado de los permisos todavía no se cargó. */}
        {!cameraPermission ? (
          <View style={[styles.flex, { backgroundColor: colors.cameraBackground }]} />
        ) : !cameraPermission.granted ? (
          /* Escenario 2: permiso denegado o todavía no pedido. */
          <View style={[styles.permisoContainer, { backgroundColor: colors.background }]}>
            <Ionicons name="camera-outline" size={64} color={colors.error} />
            <Text style={styles.permisoTitulo}>Permiso de cámara requerido</Text>
            <Text style={[styles.permisoTexto, { color: colors.textSecondary }]}>
              Necesitamos acceso a tu cámara para tomar el comprobante
            </Text>
            <Button mode="contained" onPress={handleRequestPermission}>
              {cameraPermission.canAskAgain ? "Solicitar permiso" : "Abrir configuración"}
            </Button>
            <Button
              mode="text"
              onPress={() => setShowCamera(false)}
              textColor={colors.textSecondary}
              style={styles.permisoCancelar}
            >
              Cancelar
            </Button>
          </View>
        ) : (
          /* Escenario 3: cámara lista (controles dibujados encima). */
          <View style={[styles.flex, { backgroundColor: colors.cameraBackground }]}>
            <CameraView style={styles.flex} facing={"back" as CameraType} ref={cameraRef} />
            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: colors.cameraOverlay }]}
                onPress={() => setShowCamera(false)}
              >
                <Ionicons name="close" size={24} color={colors.cameraOnOverlay} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.captureButton, { borderColor: colors.cameraOnOverlay }]}
                onPress={takePicture}
              >
                <View
                  style={[
                    styles.captureButtonInner,
                    { backgroundColor: colors.cameraOnOverlay },
                  ]}
                />
              </TouchableOpacity>
              <View
                style={[styles.controlButton, { backgroundColor: colors.cameraOverlay }]}
              />
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

// Solo estructura: los colores vienen del theme con useTheme().
const styles = StyleSheet.create({
  flex: { flex: 1 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, marginTop: 16 },
  botones: {
    flexDirection: "row",
    gap: 8,
  },
  boton: { flex: 1 },
  card: { marginTop: 12 },
  contenido: { alignItems: "center" },
  acciones: { justifyContent: "flex-end" },
  permisoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permisoTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  permisoTexto: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  permisoCancelar: { marginTop: 8 },
  cameraControls: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
