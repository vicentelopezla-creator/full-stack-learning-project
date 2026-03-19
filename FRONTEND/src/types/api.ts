export type User = {
  id: number;
  name: string;
  surname: string | null;
  email: string;
  description: string | null;
  image: string | null;
  remember_token: string | null;
  role: string | null;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export type Category = {
  id: number;
  name: string | null;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type Course = {
  id: number;
  category_id: number;
  name: string | null;
  detalle: string | null;
  image: string | null;
  url: string | null;
  accordion: number;
  precio_ahora: string | null;
  precio_antes: string | null;
  num_ventas: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type HealthResponse = {
  status: string;
};
