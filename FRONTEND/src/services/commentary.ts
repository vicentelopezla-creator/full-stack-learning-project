import { apiRequest } from '../lib/api';
import type { Commentary, CommentaryCreate } from '../types/commentary';

export function getCommentaries(token: string) {
  return apiRequest<Commentary[]>('/commentaries/', {
    token,
  });
}

export function createCommentary(token: string, payload: CommentaryCreate) {
  return apiRequest<Commentary>('/commentaries/', {
    method: 'POST',
    body: payload,
    token,
  });
}
