import type { ComponentProps } from "react";
import { Ionicons } from "@expo/vector-icons";

import { categoryColors } from "@/constants/theme";

export type IoniconName = ComponentProps<typeof Ionicons>["name"];

export interface Categoria {
  id: string;
  nombre: string;
  icono: IoniconName;
  color: string;
}

export const CATEGORIAS: Categoria[] = [
  { id: "comida", nombre: "Comida", icono: "restaurant-outline", color: categoryColors.comida },
  { id: "hogar", nombre: "Hogar", icono: "home-outline", color: categoryColors.hogar },
  { id: "transporte", nombre: "Transporte", icono: "car-outline", color: categoryColors.transporte },
  { id: "salud", nombre: "Salud", icono: "medkit-outline", color: categoryColors.salud },
  { id: "educacion", nombre: "Educación", icono: "school-outline", color: categoryColors.educacion },
  { id: "vestimenta", nombre: "Vestimenta", icono: "shirt-outline", color: categoryColors.vestimenta },
  { id: "servicios", nombre: "Servicios", icono: "flash-outline", color: categoryColors.servicios },
  { id: "entretenimiento", nombre: "Entretenimiento", icono: "game-controller-outline", color: categoryColors.entretenimiento },
  { id: "impuestos", nombre: "Impuestos", icono: "receipt-outline", color: categoryColors.impuestos },
  { id: "mascotas", nombre: "Mascotas", icono: "paw-outline", color: categoryColors.mascotas },
  { id: "otro", nombre: "Otro", icono: "ellipsis-horizontal-circle-outline", color: categoryColors.otro },
];

export function getCategoria(id: string): Categoria {
  return CATEGORIAS.find((c) => c.id === id) ?? CATEGORIAS[CATEGORIAS.length - 1];
}