import { apiRequest } from '../lib/api';
import type { CourseContent, PurchasedCourse } from '../types/me';

export function getMyCourses(token: string) {
  return apiRequest<PurchasedCourse[]>('/me/courses', {
    token,
  });
}

export function getMyCourseContent(token: string, courseId: number) {
  return apiRequest<CourseContent>(`/me/courses/${courseId}/content`, {
    token,
  });
}
