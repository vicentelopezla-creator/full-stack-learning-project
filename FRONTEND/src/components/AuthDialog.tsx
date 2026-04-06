import { FormEvent, useEffect, useRef, useState } from 'react';
import type { AuthDialogMode, RegistrationChallenge, RegistrationFormValues } from '../types/auth';

type AuthDialogProps = {
  mode: AuthDialogMode;
  loginSubmitting: boolean;
  loginError: string | null;
  registrationSubmitting: boolean;
  registrationError: string | null;
  registrationMessage: string | null;
  registrationChallenge: RegistrationChallenge | null;
  pendingRegistrationEmail: string;
  consentVersion: string;
  onClose: () => void;
  onModeChange: (mode: AuthDialogMode) => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onRequestRegistration: (payload: RegistrationFormValues) => Promise<void>;
  onVerifyRegistration: (email: string, code: string) => Promise<void>;
};

const consentSections = [
  {
    title: 'Responsable del tratamiento',
    text: 'Vicenweb Academy utilizara los datos del formulario para crear la cuenta, gestionar el acceso y proteger el proceso de registro.',
  },
  {
    title: 'Datos utilizados',
    text: 'Nombre, apellido, email, password cifrada y evidencias tecnicas minimas del proceso de verificacion.',
  },
  {
    title: 'Finalidad',
    text: 'Crear tu perfil, enviarte el codigo de verificacion, autenticar el acceso y prevenir registros automatizados o fraudulentos.',
  },
  {
    title: 'Conservacion',
    text: 'Las solicitudes pendientes se conservaran solo el tiempo necesario para completar o descartar el registro. Los datos de la cuenta activa se mantendran mientras exista la relacion con la plataforma o una obligacion legal.',
  },
  {
    title: 'Tus derechos',
    text: 'Podras solicitar acceso, rectificacion, eliminacion o retirada del consentimiento respecto a los datos personales vinculados a tu cuenta.',
  },
];

export function AuthDialog({
  mode,
  loginSubmitting,
  loginError,
  registrationSubmitting,
  registrationError,
  registrationMessage,
  registrationChallenge,
  pendingRegistrationEmail,
  consentVersion,
  onClose,
  onModeChange,
  onLogin,
  onRequestRegistration,
  onVerifyRegistration,
}: AuthDialogProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerSurname, setRegisterSurname] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState('');
  const [humanAnswer, setHumanAnswer] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [localRegisterError, setLocalRegisterError] = useState<string | null>(null);

  const loginInputRef = useRef<HTMLInputElement | null>(null);
  const registerInputRef = useRef<HTMLInputElement | null>(null);

  function resetLoginForm() {
    setLoginEmail('');
    setLoginPassword('');
  }

  function resetRegistrationForm() {
    setRegisterName('');
    setRegisterSurname('');
    setRegisterEmail('');
    setRegisterPassword('');
    setRegisterPasswordConfirm('');
    setHumanAnswer('');
    setVerificationCode('');
    setConsentAccepted(false);
    setLocalRegisterError(null);
  }

  useEffect(() => {
    // Dirigimos el foco al formulario activo para que el dialogo sea mas comodo al abrirse.
    const timeoutId = window.setTimeout(() => {
      if (mode === 'login') {
        loginInputRef.current?.focus();
      } else {
        registerInputRef.current?.focus();
      }
    }, 30);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [mode]);

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onLogin(loginEmail, loginPassword);
  }

  async function handleRegistrationRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalRegisterError(null);

    if (registerPassword !== registerPasswordConfirm) {
      setLocalRegisterError('Las passwords no coinciden.');
      return;
    }

    if (!consentAccepted) {
      setLocalRegisterError('Debes aceptar el tratamiento de datos para continuar.');
      return;
    }

    if (!registrationChallenge) {
      setLocalRegisterError(
        'La verificacion humana aun no esta lista. Intenta de nuevo en unos segundos.',
      );
      return;
    }

    await onRequestRegistration({
      name: registerName,
      surname: registerSurname,
      email: registerEmail,
      password: registerPassword,
      consentAccepted,
      humanAnswer,
    });

    setLocalRegisterError(null);
    setVerificationCode('');
  }

  async function handleVerificationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLocalRegisterError(null);

    if (!verificationCode.trim()) {
      setLocalRegisterError('Escribe el codigo que recibiste por email.');
      return;
    }

    await onVerifyRegistration(pendingRegistrationEmail || registerEmail, verificationCode);
  }

  const activeRegisterError = localRegisterError || registrationError;

  function handleModeSwitch(nextMode: AuthDialogMode) {
    if (nextMode === mode) {
      return;
    }

    // Limpiamos ambos modos para que login y registro no compartan residuos visuales.
    setLocalRegisterError(null);
    resetLoginForm();
    resetRegistrationForm();
    onModeChange(nextMode);
  }

  return (
    <div
      className="auth-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-dialog-title"
    >
      <div className="auth-dialog__backdrop" onClick={onClose} aria-hidden="true" />

      <div
        className={`auth-dialog__surface${mode === 'register' ? ' auth-dialog__surface--wide' : ''}`}
      >
        <button
          type="button"
          className="auth-dialog__close"
          aria-label="Cerrar acceso"
          onClick={onClose}
        >
          x
        </button>

        <div className="auth-dialog__switch" role="tablist" aria-label="Tipo de acceso">
          <button
            type="button"
            className={`auth-dialog__switch-button${mode === 'login' ? ' auth-dialog__switch-button--active' : ''}`}
            onClick={() => handleModeSwitch('login')}
          >
            Iniciar sesion
          </button>
          <button
            type="button"
            className={`auth-dialog__switch-button${mode === 'register' ? ' auth-dialog__switch-button--active' : ''}`}
            onClick={() => handleModeSwitch('register')}
          >
            Registrate
          </button>
        </div>

        {mode === 'login' ? (
          <>
            <div className="auth-dialog__header">
              <p className="eyebrow">Acceso</p>
              <h2 id="auth-dialog-title">Inicia sesion en tu cuenta</h2>
              <p>
                Usa tu email y password para entrar. Cuando la sesion sea valida, el encabezado
                mostrara tu identidad activa.
              </p>
            </div>

            <form className="form-grid" onSubmit={handleLoginSubmit}>
              <label className="field">
                <span>Email</span>
                <input
                  ref={loginInputRef}
                  type="email"
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="tu-correo@ejemplo.com"
                  required
                />
              </label>

              <label className="field">
                <span>Password</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  placeholder="Escribe tu password"
                  required
                />
              </label>

              <button className="button button--primary" type="submit" disabled={loginSubmitting}>
                {loginSubmitting ? 'Entrando...' : 'Iniciar sesion'}
              </button>
            </form>

            {loginError ? (
              <p className="feedback feedback--error auth-dialog__feedback">{loginError}</p>
            ) : null}
          </>
        ) : (
          <>
            <div className="auth-dialog__header">
              <p className="eyebrow">Registro</p>
              <h2 id="auth-dialog-title">Crea tu cuenta verificada</h2>
              <p>
                Primero validamos tus datos y te enviamos un codigo al email registrado. Solo
                despues de verificar ese codigo se crea la cuenta.
              </p>
            </div>

            <form className="form-grid" onSubmit={handleRegistrationRequest}>
              <div className="auth-dialog__two-columns">
                <label className="field">
                  <span>Nombre</span>
                  <input
                    ref={registerInputRef}
                    type="text"
                    autoComplete="given-name"
                    value={registerName}
                    onChange={(event) => setRegisterName(event.target.value)}
                    placeholder="Tu nombre"
                    required
                  />
                </label>

                <label className="field">
                  <span>Apellido</span>
                  <input
                    type="text"
                    autoComplete="family-name"
                    value={registerSurname}
                    onChange={(event) => setRegisterSurname(event.target.value)}
                    placeholder="Tu apellido"
                  />
                </label>
              </div>

              <label className="field">
                <span>Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={registerEmail}
                  onChange={(event) => setRegisterEmail(event.target.value)}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </label>

              <div className="auth-dialog__two-columns">
                <label className="field">
                  <span>Password</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={registerPassword}
                    onChange={(event) => setRegisterPassword(event.target.value)}
                    placeholder="Minimo 8 caracteres"
                    minLength={8}
                    required
                  />
                </label>

                <label className="field">
                  <span>Confirmar password</span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={registerPasswordConfirm}
                    onChange={(event) => setRegisterPasswordConfirm(event.target.value)}
                    placeholder="Repite tu password"
                    minLength={8}
                    required
                  />
                </label>
              </div>

              <div className="auth-dialog__document">
                <div className="auth-dialog__document-header">
                  <strong>Consentimiento de tratamiento de datos</strong>
                  <span>Version {consentVersion}</span>
                </div>

                <div className="auth-dialog__document-body">
                  {consentSections.map((section) => (
                    <div key={section.title} className="auth-dialog__document-section">
                      <strong>{section.title}</strong>
                      <p>{section.text}</p>
                    </div>
                  ))}
                </div>

                <label className="auth-dialog__checkbox">
                  <input
                    type="checkbox"
                    checked={consentAccepted}
                    onChange={(event) => setConsentAccepted(event.target.checked)}
                  />
                  <span>Acepto el tratamiento de mis datos para crear y verificar mi cuenta.</span>
                </label>
              </div>

              <label className="field">
                <span>Verificacion humana</span>
                <input
                  type="text"
                  value={humanAnswer}
                  onChange={(event) => setHumanAnswer(event.target.value)}
                  placeholder={
                    registrationChallenge ? registrationChallenge.question : 'Preparando reto...'
                  }
                  required
                />
              </label>

              <button
                className="button button--primary"
                type="submit"
                disabled={registrationSubmitting}
              >
                {registrationSubmitting ? 'Enviando codigo...' : 'Enviar codigo al email'}
              </button>
            </form>

            {registrationMessage ? (
              <p className="feedback auth-dialog__feedback">{registrationMessage}</p>
            ) : null}
            {activeRegisterError ? (
              <p className="feedback feedback--error auth-dialog__feedback">
                {activeRegisterError}
              </p>
            ) : null}

            {pendingRegistrationEmail ? (
              <form
                className="form-grid auth-dialog__verification"
                onSubmit={handleVerificationSubmit}
              >
                <div className="auth-dialog__verification-copy">
                  <strong>Verifica tu email</strong>
                  <p>
                    Hemos preparado el alta para <strong>{pendingRegistrationEmail}</strong>.
                    Introduce el codigo que te enviamos para completar el registro.
                  </p>
                </div>

                <label className="field">
                  <span>Codigo de verificacion</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={verificationCode}
                    onChange={(event) => setVerificationCode(event.target.value)}
                    placeholder="Ejemplo: 123456"
                    required
                  />
                </label>

                <button
                  className="button button--primary"
                  type="submit"
                  disabled={registrationSubmitting}
                >
                  {registrationSubmitting ? 'Verificando...' : 'Verificar y crear cuenta'}
                </button>
              </form>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
