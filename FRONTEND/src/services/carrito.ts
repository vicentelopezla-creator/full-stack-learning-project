import { apiRequest } from '../lib/api';
import type { Carrito, CarritoCreate } from '../types/carrito';

export function getCarrito(token: string) {
  return apiRequest<Carrito[]>('/cars/', {
    token,
  });
}

export function createCarritoItem(token: string, payload: CarritoCreate) {
  return apiRequest<Carrito>('/cars/', {
    method: 'POST',
    body: payload,
    token,
  });
}
