import type { User } from '../types/user';

export function getUserDisplayName(currentUser: User) {
  // Reducimos el nombre mostrado para que el header no se rompa con nombres largos.
  const firstName = currentUser.name.trim().split(/\s+/)[0] ?? '';
  const firstSurname = currentUser.surname?.trim().split(/\s+/)[0] ?? '';

  return [firstName, firstSurname].filter(Boolean).join(' ');
}

export function getUserInitials(currentUser: User) {
  // Generamos un avatar compacto reutilizable para escritorio y movil.
  const firstName = currentUser.name.trim().split(/\s+/)[0] ?? '';
  const firstSurname = currentUser.surname?.trim().split(/\s+/)[0] ?? '';
  const firstInitial = firstName.charAt(0) || currentUser.email.charAt(0);
  const secondInitial = firstSurname.charAt(0) || firstName.charAt(1);

  return `${firstInitial}${secondInitial ?? ''}`.toUpperCase();
}
