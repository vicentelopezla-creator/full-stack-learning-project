export type VentaCreate = {
  course_id: number;
  progreso: number | null;
  cantidad_v: number | null;
};

export type Venta = VentaCreate & {
  id: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CheckoutResult = {
  purchased: Venta[];
  skipped_course_ids: number[];
};
