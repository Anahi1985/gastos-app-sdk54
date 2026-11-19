import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  "(drawer)": undefined;
  detalle: { gasto?: string };
  crear: undefined;
};

export type DetalleScreenProps = NativeStackScreenProps<RootStackParamList, "detalle">;
export type DetalleRouteProp = DetalleScreenProps["route"];
export type DetalleNavigationProp = DetalleScreenProps["navigation"];
