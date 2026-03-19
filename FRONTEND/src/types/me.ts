import type { Course } from './course';

export type PurchasedCourse = {
  venta_id: number;
  course_id: number;
  name: string | null;
  detalle: string | null;
  image: string | null;
  progreso: number;
  cantidad_v: number;
};

export type VideoProgress = {
  id: number;
  title: string;
  content: string;
  seccion: number;
  title_accordion: string | null;
  url: string | null;
  file: string | null;
  descarga: string | null;
  completed: boolean;
};

export type CourseContent = {
  course: Course;
  videos: VideoProgress[];
  progreso: number;
  cantidad_v: number;
  total_videos: number;
};
