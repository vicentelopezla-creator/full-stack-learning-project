import { apiRequest } from '../lib/api';
import type { Category } from '../types/category';
import type { Course } from '../types/course';
import type { HealthResponse } from '../types/health';

export function getHealth() {
  return apiRequest<HealthResponse>('/health');
}

export function getCategories() {
  return apiRequest<Category[]>('/categories/');
}

export function getCourses() {
  return apiRequest<Course[]>('/products/');
}
