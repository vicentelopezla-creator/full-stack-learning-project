export type ResponseCreate = {
  commentary_id: number;
  response: string | null;
  image: string | null;
};

export type Response = ResponseCreate & {
  id: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};
