import { apiRequest } from '../lib/api';
import type { Response, ResponseCreate } from '../types/response';

export function getResponses(token: string) {
  return apiRequest<Response[]>('/responses/', {
    token,
  });
}

export function createResponse(token: string, payload: ResponseCreate) {
  return apiRequest<Response>('/responses/', {
    method: 'POST',
    body: payload,
    token,
  });
}
