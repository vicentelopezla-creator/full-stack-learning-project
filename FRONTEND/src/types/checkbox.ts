export type CheckboxCreate = {
  course_id: number;
  video_id: number;
  checkbox: number;
};

export type Checkbox = CheckboxCreate & {
  id: number;
  deleted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};
