import { apiRequest } from '../lib/api';
import type { Category, Course, HealthResponse } from '../types/api';

export function getHealth() {
  return apiRequest<HealthResponse>('/health');
}

export function getCategories() {
  return apiRequest<Category[]>('/categories/');
}

export function getCourses() {
  return apiRequest<Course[]>('/products/');
}
