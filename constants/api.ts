import type { Gasto as GastoModel } from "./gastos";

export { GASTOS_COLLECTION } from "./gastos";
export type { Gasto } from "./gastos";
export type CreateGastoData = Omit<GastoModel, "id">;