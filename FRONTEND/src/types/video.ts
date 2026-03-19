export type VideoCreate = {
  course_id: number;
  title: string;
  content: string;
  url: string | null;
  file: string | null;
  descarga: string | null;
  seccion: number;
  title_accordion: string | null;
};

export type VideoUpdate = {
  course_id: number | null;
  title: string | null;
  content: string | null;
  url: string | null;
  file: string | null;
  descarga: string | null;
  seccion: number | null;
  title_accordion: string | null;
};

export type Video = VideoCreate & {
  id: number;
  user_id: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};
