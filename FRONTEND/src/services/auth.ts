import { apiRequest } from '../lib/api';
import type {
  LoginRequest,
  LoginResponse,
  RegistrationChallenge,
  RegistrationRequestPayload,
  RegistrationRequestResponse,
  RegistrationVerifyPayload,
} from '../types/auth';
import type { User } from '../types/user';

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

export function getRegistrationChallenge() {
  return apiRequest<RegistrationChallenge>('/auth/register/challenge');
}

export function requestRegistrationCode(payload: RegistrationRequestPayload) {
  return apiRequest<RegistrationRequestResponse>('/auth/register/request-code', {
    method: 'POST',
    body: payload,
  });
}

export function verifyRegistrationCode(payload: RegistrationVerifyPayload) {
  return apiRequest<LoginResponse>('/auth/register/verify', {
    method: 'POST',
    body: payload,
  });
}
