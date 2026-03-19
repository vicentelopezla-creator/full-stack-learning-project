export type CourseBase = {
  category_id: number;
  name: string | null;
  detalle: string | null;
  image: string | null;
  url: string | null;
  accordion: number;
  precio_ahora: string | null;
  precio_antes: string | null;
  num_ventas: number;
};

export type CourseCreate = CourseBase;

export type CourseUpdate = {
  category_id: number | null;
  name: string | null;
  detalle: string | null;
  image: string | null;
  url: string | null;
  accordion: number | null;
  precio_ahora: string | null;
  precio_antes: string | null;
  num_ventas: number | null;
};

export type Course = CourseBase & {
  id: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};
