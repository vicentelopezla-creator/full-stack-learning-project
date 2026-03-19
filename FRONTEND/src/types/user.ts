export type UserBase = {
  name: string;
  surname: string | null;
  email: string;
  description: string | null;
  image: string | null;
  remember_token: string | null;
};

export type UserCreate = UserBase & {
  password: string;
};

export type User = {
  id: number;
  role: string | null;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
} & UserBase;
