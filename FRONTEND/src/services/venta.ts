import { apiRequest } from '../lib/api';
import type { CheckoutResult, Venta, VentaCreate } from '../types/venta';

export function getVentas(token: string) {
  return apiRequest<Venta[]>('/ventas/', {
    token,
  });
}

export function createVenta(token: string, payload: VentaCreate) {
  return apiRequest<Venta>('/ventas/', {
    method: 'POST',
    body: payload,
    token,
  });
}

export function checkoutCart(token: string) {
  return apiRequest<CheckoutResult>('/ventas/checkout', {
    method: 'POST',
    token,
  });
}
