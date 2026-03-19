export type CarritoCreate = {
  course_id: number;
  cantidad: number;
};

export type Carrito = CarritoCreate & {
  id: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};
