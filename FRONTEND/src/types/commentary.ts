export type CommentaryCreate = {
  video_id: number;
  course_id: number | null;
  title: string | null;
  comment: string | null;
  image: string | null;
};

export type Commentary = CommentaryCreate & {
  id: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};
