import { apiRequest } from '../lib/api';
import type { Checkbox, CheckboxCreate } from '../types/checkbox';

export function getCheckboxes(token: string) {
  return apiRequest<Checkbox[]>('/checkbox/', {
    token,
  });
}

export function createCheckbox(token: string, payload: CheckboxCreate) {
  return apiRequest<Checkbox>('/checkbox/', {
    method: 'POST',
    body: payload,
    token,
  });
}
