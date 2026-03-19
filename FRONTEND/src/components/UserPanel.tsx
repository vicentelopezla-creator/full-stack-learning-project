import type { User } from '../types/user';

type UserPanelProps = {
  user: User | null;
  token: string | null;
  onLogout: () => void;
};

export function UserPanel({ user, token, onLogout }: UserPanelProps) {
  return (
    <section className="panel">
      <div className="panel__header panel__header--row">
        <div>
          <p className="eyebrow">Sesion</p>
          <h2>Estado del usuario autenticado</h2>
        </div>
        <button className="button button--ghost" type="button" onClick={onLogout}>
          Cerrar sesion
        </button>
      </div>

      {user ? (
        <div className="user-card">
          <div>
            <span className="muted-text">Nombre</span>
            <strong>{user.name} {user.surname || ''}</strong>
          </div>
          <div>
            <span className="muted-text">Email</span>
            <strong>{user.email}</strong>
          </div>
          <div>
            <span className="muted-text">Rol</span>
            <strong>{user.role || 'Sin rol'}</strong>
          </div>
          <div>
            <span className="muted-text">Token</span>
            <code>{token?.slice(0, 24)}...</code>
          </div>
        </div>
      ) : (
        <p className="empty-state">Aun no hay usuario autenticado.</p>
      )}
    </section>
  );
}
