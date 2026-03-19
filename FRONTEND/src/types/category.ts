export type CategoryCreate = {
  name: string | null;
};

export type CategoryUpdate = {
  name: string | null;
};

export type Category = CategoryCreate & {
  id: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};
