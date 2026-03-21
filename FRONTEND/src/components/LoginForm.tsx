import { FormEvent, useState } from 'react';

type LoginFormProps = {
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (email: string, password: string) => Promise<void>;
};

export function LoginForm({ isSubmitting, error, onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(email, password);
  }

  return (
    <section className="panel">
      <div className="panel__header">
        <p className="eyebrow">Acceso</p>
        <h2>Conecta el frontend con tu API</h2>
        <p>
          Este formulario consume <code>/auth/login</code> y guarda el token para futuras llamadas
          autenticadas.
        </p>
      </div>

      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu-correo@ejemplo.com"
            required
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Escribe tu password"
            required
          />
        </label>

        <button className="button button--primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Iniciar sesion'}
        </button>
      </form>

      {error ? <p className="feedback feedback--error">{error}</p> : null}
    </section>
  );
}
