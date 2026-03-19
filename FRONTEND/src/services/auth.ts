import { apiRequest } from '../lib/api';
import type { LoginRequest, LoginResponse, User } from '../types/api';

export function login(payload: LoginRequest) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export function getCurrentUser(token: string) {
  return apiRequest<User>('/auth/me', {
    token,
  });
}
