import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { AuthDialog } from './components/AuthDialog';
import { CategoryList } from './components/CategoryList';
import { CourseList } from './components/CourseList';
import { LoginForm } from './components/LoginForm';
import { StatCard } from './components/StatCard';
import { UserPanel } from './components/UserPanel';
import { clearStoredToken, getStoredToken, setStoredToken } from './lib/storage';
import {
  getCurrentUser,
  getRegistrationChallenge,
  login,
  requestRegistrationCode,
  verifyRegistrationCode,
} from './services/auth';
import { getCarrito } from './services/carrito';
import { getCategories, getCourses, getHealth } from './services/catalog';
import { API_BASE_URL } from './lib/api';
import type { AuthDialogMode, LoginResponse, RegistrationChallenge } from './types/auth';
import type { Category } from './types/category';
import type { Course } from './types/course';
import type { User } from './types/user';
import logo from './assets/images/logo.png';

export default function App() {
  const [healthStatus, setHealthStatus] = useState('Comprobando...');
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [searchDraft, setSearchDraft] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [authDialogMode, setAuthDialogMode] = useState<AuthDialogMode>('login');
  const [registering, setRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const [registrationChallenge, setRegistrationChallenge] = useState<RegistrationChallenge | null>(
    null,
  );
  const [pendingRegistrationEmail, setPendingRegistrationEmail] = useState('');
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadPublicData() {
      try {
        const [health, categoryList, courseList] = await Promise.all([
          getHealth(),
          getCategories(),
          getCourses(),
        ]);

        setHealthStatus(health.status);
        setCategories(categoryList);
        setCourses(courseList);
      } catch (error) {
        setHealthStatus('error');
        setSessionError(error instanceof Error ? error.message : 'No se pudo cargar la API');
      } finally {
        setLoadingCatalog(false);
      }
    }

    void loadPublicData();
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setCartCount(0);
      return;
    }

    const sessionToken = token;

    async function loadUserSession() {
      try {
        const currentUser = await getCurrentUser(sessionToken);
        setUser(currentUser);
        setSessionError(null);
      } catch (error) {
        clearStoredToken();
        setToken(null);
        setUser(null);
        setSessionError(error instanceof Error ? error.message : 'Sesion invalida');
      }
    }

    void loadUserSession();
  }, [token]);

  useEffect(() => {
    if (!token) {
      setCartCount(0);
      return;
    }

    const sessionToken = token;

    async function loadCart() {
      try {
        const items = await getCarrito(sessionToken);
        const total = items.reduce((sum, item) => sum + item.cantidad, 0);
        setCartCount(total);
      } catch {
        setCartCount(0);
      }
    }

    void loadCart();
  }, [token]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1024px)');

    function handleViewportChange(event: MediaQueryListEvent) {
      if (!event.matches) {
        setIsMenuOpen(false);
      }
    }

    mediaQuery.addEventListener('change', handleViewportChange);

    return () => {
      mediaQuery.removeEventListener('change', handleViewportChange);
    };
  }, []);

  useEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousTouchAction = body.style.touchAction;

    if (isMenuOpen || isAuthDialogOpen) {
      body.style.overflow = 'hidden';
      body.style.touchAction = 'none';
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.touchAction = previousTouchAction;
    };
  }, [isAuthDialogOpen, isMenuOpen]);

  useEffect(() => {
    if (!isProfileMenuOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileMenuOpen]);

  function handleAuthSuccess(response: LoginResponse) {
    setStoredToken(response.access_token);
    setToken(response.access_token);
    setUser(response.user);
    setIsAuthDialogOpen(false);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    setRegistrationError(null);
    setRegistrationMessage(null);
    setPendingRegistrationEmail('');
  }

  async function handleLogin(email: string, password: string) {
    try {
      setLoggingIn(true);
      setLoginError(null);

      const response = await login({ email, password });
      handleAuthSuccess(response);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'No se pudo iniciar sesion');
    } finally {
      setLoggingIn(false);
    }
  }

  function handleLogout() {
    clearStoredToken();
    setToken(null);
    setUser(null);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchTerm(searchDraft.trim().toLowerCase());
  }

  async function loadRegistrationChallenge() {
    try {
      const challenge = await getRegistrationChallenge();
      setRegistrationChallenge(challenge);
    } catch (error) {
      setRegistrationError(
        error instanceof Error ? error.message : 'No se pudo preparar el registro',
      );
    }
  }

  function openAuthDialog(mode: AuthDialogMode = 'login') {
    setLoginError(null);
    setRegistrationError(null);
    setRegistrationMessage(null);
    setIsMenuOpen(false);
    setAuthDialogMode(mode);
    setIsAuthDialogOpen(true);

    if (mode === 'register') {
      setPendingRegistrationEmail('');
      void loadRegistrationChallenge();
    }
  }

  function closeAuthDialog() {
    setLoginError(null);
    setRegistrationError(null);
    setRegistrationMessage(null);
    setPendingRegistrationEmail('');
    setIsAuthDialogOpen(false);
  }

  function handleAuthDialogModeChange(mode: AuthDialogMode) {
    setLoginError(null);
    setRegistrationError(null);
    setRegistrationMessage(null);
    setAuthDialogMode(mode);

    if (mode === 'register' && !registrationChallenge) {
      void loadRegistrationChallenge();
    }
  }

  async function handleRegistrationRequest(payload: {
    name: string;
    surname: string;
    email: string;
    password: string;
    consentAccepted: boolean;
    humanAnswer: string;
  }) {
    if (!registrationChallenge) {
      await loadRegistrationChallenge();
      throw new Error('No pudimos preparar la verificacion humana. Intenta otra vez.');
    }

    try {
      setRegistering(true);
      setRegistrationError(null);

      const response = await requestRegistrationCode({
        name: payload.name,
        surname: payload.surname,
        email: payload.email,
        password: payload.password,
        consent_accepted: payload.consentAccepted,
        consent_version: '2026-03',
        human_challenge_token: registrationChallenge.challenge_token,
        human_challenge_answer: payload.humanAnswer,
      });

      setPendingRegistrationEmail(response.email);
      setRegistrationMessage(response.detail);
      void loadRegistrationChallenge();
    } catch (error) {
      setRegistrationError(
        error instanceof Error ? error.message : 'No se pudo solicitar el codigo',
      );
      void loadRegistrationChallenge();
      throw error;
    } finally {
      setRegistering(false);
    }
  }

  async function handleRegistrationVerification(email: string, code: string) {
    try {
      setRegistering(true);
      setRegistrationError(null);
      const response = await verifyRegistrationCode({ email, code });
      handleAuthSuccess(response);
    } catch (error) {
      setRegistrationError(
        error instanceof Error ? error.message : 'No se pudo verificar el codigo',
      );
      throw error;
    } finally {
      setRegistering(false);
    }
  }

  function getUserDisplayName(currentUser: User) {
    const firstName = currentUser.name.trim().split(/\s+/)[0] ?? '';
    const firstSurname = currentUser.surname?.trim().split(/\s+/)[0] ?? '';

    return [firstName, firstSurname].filter(Boolean).join(' ');
  }

  function getUserInitials(currentUser: User) {
    const firstName = currentUser.name.trim().split(/\s+/)[0] ?? '';
    const firstSurname = currentUser.surname?.trim().split(/\s+/)[0] ?? '';
    const firstInitial = firstName.charAt(0);
    const secondInitial = firstSurname.charAt(0) || firstName.charAt(1);

    return `${firstInitial}${secondInitial ?? ''}`.toUpperCase();
  }

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategoryId === 'all' || course.category_id === selectedCategoryId;

    const matchesSearch =
      searchTerm.length === 0 ||
      (course.name || '').toLowerCase().includes(searchTerm) ||
      (course.detalle || '').toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  const categoryOptionNodes = categories.map((category) => (
    <option key={category.id} value={category.id}>
      {category.name || `Categoria ${category.id}`}
    </option>
  ));
  const displayName = user ? getUserDisplayName(user) : '';
  const userInitials = user ? getUserInitials(user) : '';

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <button
            type="button"
            className="topbar__menu-button"
            aria-label={isMenuOpen ? 'Cerrar menu principal' : 'Abrir menu principal'}
            aria-expanded={isMenuOpen}
            aria-controls="topbar-navigation"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className="topbar__brand">
            <img src={logo} alt="Logo de la academia" />
            <div>
              <strong>Vicenweb Academy</strong>
              <p>Plataforma moderna de cursos online</p>
            </div>
          </div>

          <div className="topbar__mobile-spacer" aria-hidden="true" />

          <nav className="topbar__nav" aria-label="Navegacion principal">
            <div className="topbar__group topbar__group--compact">
              <label className="topbar__label topbar__label--featured" htmlFor="category-filter">
                Categorias
              </label>
              <select
                id="category-filter"
                className="topbar__select"
                value={selectedCategoryId}
                onChange={(event) => {
                  const value = event.target.value;
                  setSelectedCategoryId(value === 'all' ? 'all' : Number(value));
                }}
              >
                <option value="all">Todas</option>
                {categoryOptionNodes}
              </select>
            </div>

            <form className="topbar__search" role="search" onSubmit={handleSearchSubmit}>
              <input
                type="search"
                placeholder="Buscar cursos..."
                aria-label="Buscar cursos"
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
              />
              <button className="topbar__search-button" type="submit" aria-label="Activar busqueda">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.43 4.44 1.41-1.42-4.43-4.43A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </form>

            <div className="topbar__actions">
              <span className="topbar__link topbar__link--learning topbar__action--learning">
                Mi aprendizaje
              </span>
              <span
                className="topbar__cart topbar__action--primary"
                aria-label={`Carrito con ${cartCount} productos`}
              >
                <span className="topbar__cart-icon">🛒</span>
                <span className="topbar__cart-count">{cartCount}</span>
              </span>
              {user ? (
                <div
                  ref={profileMenuRef}
                  className={`topbar__profile-menu${isProfileMenuOpen ? ' topbar__profile-menu--open' : ''}`}
                >
                  <button
                    type="button"
                    className="topbar__profile"
                    aria-label={`Sesion iniciada como ${displayName}`}
                    aria-haspopup="menu"
                    aria-expanded={isProfileMenuOpen}
                    onClick={() => setIsProfileMenuOpen((current) => !current)}
                  >
                    <span className="topbar__profile-avatar" aria-hidden="true">
                      {userInitials}
                    </span>
                    <span className="topbar__profile-copy">
                      <span className="topbar__profile-label">Sesion activa</span>
                      <strong>{displayName}</strong>
                    </span>
                    <span className="topbar__profile-caret" aria-hidden="true">
                      ▾
                    </span>
                  </button>

                  <ul
                    className="topbar__profile-dropdown"
                    role="menu"
                    aria-label="Opciones de la cuenta"
                  >
                    <li role="none">
                      <button
                        type="button"
                        className="topbar__profile-dropdown-action"
                        role="menuitem"
                        onClick={handleLogout}
                      >
                        Cerrar sesion
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className="topbar__link topbar__link--session topbar__action-button"
                    onClick={() => openAuthDialog('login')}
                  >
                    Iniciar sesion
                  </button>
                  <button
                    type="button"
                    className="topbar__link topbar__link--accent topbar__action-button topbar__action--tertiary"
                    onClick={() => openAuthDialog('register')}
                  >
                    Registrate
                  </button>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      <aside
        id="topbar-navigation"
        className={`topbar__drawer${isMenuOpen ? ' topbar__drawer--open' : ''}`}
        aria-label="Navegacion principal"
        aria-hidden={!isMenuOpen}
      >
        <div className="topbar__drawer-header">
          <div className="topbar__drawer-brand">
            <img src={logo} alt="Logo de la academia" />
            <div>
              <strong>Vicenweb Academy</strong>
              <p>Plataforma moderna de cursos online</p>
            </div>
          </div>

          <button
            type="button"
            className="topbar__drawer-close"
            aria-label="Cerrar menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <span aria-hidden="true">x</span>
            <span>Salir</span>
          </button>
        </div>

        <div className="topbar__drawer-body">
          <div className="topbar__group topbar__group--compact">
            <label
              className="topbar__label topbar__label--featured"
              htmlFor="category-filter-drawer"
            >
              Categorias
            </label>
            <select
              id="category-filter-drawer"
              className="topbar__select"
              value={selectedCategoryId}
              onChange={(event) => {
                const value = event.target.value;
                setSelectedCategoryId(value === 'all' ? 'all' : Number(value));
              }}
            >
              <option value="all">Todas</option>
              {categoryOptionNodes}
            </select>
          </div>

          <form className="topbar__search" role="search" onSubmit={handleSearchSubmit}>
            <input
              type="search"
              placeholder="Buscar cursos..."
              aria-label="Buscar cursos"
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
            />
            <button className="topbar__search-button" type="submit" aria-label="Activar busqueda">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.43 4.44 1.41-1.42-4.43-4.43A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </form>

          <div className="topbar__mobile-list-group">
            <span className="topbar__mobile-list-title">Opciones</span>
            {user ? (
              <div
                className="topbar__mobile-profile"
                aria-label={`Sesion iniciada como ${displayName}`}
              >
                <span className="topbar__mobile-profile-avatar" aria-hidden="true">
                  {userInitials}
                </span>
                <div className="topbar__mobile-profile-copy">
                  <span className="topbar__mobile-profile-label">Sesion activa</span>
                  <strong>{displayName}</strong>
                </div>
              </div>
            ) : null}
            <ul className="topbar__mobile-list" aria-label="Opciones del encabezado">
              <li className="topbar__mobile-item">Mi aprendizaje</li>
              <li className="topbar__mobile-item">Carrito ({cartCount})</li>
              {user ? (
                <li className="topbar__mobile-item">
                  <button type="button" className="topbar__mobile-action" onClick={handleLogout}>
                    Cerrar sesion
                  </button>
                </li>
              ) : (
                <>
                  <li className="topbar__mobile-item">
                    <button
                      type="button"
                      className="topbar__mobile-action"
                      onClick={() => openAuthDialog('login')}
                    >
                      Iniciar sesion
                    </button>
                  </li>
                  <li className="topbar__mobile-item topbar__mobile-item--accent">
                    <button
                      type="button"
                      className="topbar__mobile-action"
                      onClick={() => openAuthDialog('register')}
                    >
                      Registrate
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </aside>

      <div
        className={`topbar__backdrop${isMenuOpen ? ' topbar__backdrop--visible' : ''}`}
        aria-hidden={!isMenuOpen}
        onClick={() => setIsMenuOpen(false)}
      />

      {isAuthDialogOpen ? (
        <AuthDialog
          mode={authDialogMode}
          loginSubmitting={loggingIn}
          loginError={loginError}
          registrationSubmitting={registering}
          registrationError={registrationError}
          registrationMessage={registrationMessage}
          registrationChallenge={registrationChallenge}
          pendingRegistrationEmail={pendingRegistrationEmail}
          consentVersion="2026-03"
          onClose={closeAuthDialog}
          onModeChange={handleAuthDialogModeChange}
          onLogin={handleLogin}
          onRequestRegistration={handleRegistrationRequest}
          onVerifyRegistration={handleRegistrationVerification}
        />
      ) : null}

      <div className="app-shell">
        <header className="hero">
          <div className="hero__copy">
            <p className="eyebrow">Frontend base</p>
            <h1>Academia Full Stack conectada a FastAPI</h1>
            <p className="hero__text">
              Esta base te deja listo para crecer hacia un panel real de cursos, autenticacion,
              carrito y consumo ordenado de tu API REST.
            </p>
          </div>

          <div className="hero__stats">
            <StatCard label="API" value={healthStatus} hint="Respuesta del endpoint /health" />
            <StatCard
              label="Categorias"
              value={loadingCatalog ? '...' : String(categories.length)}
              hint="Datos leidos desde /categories/"
            />
            <StatCard
              label="Cursos"
              value={loadingCatalog ? '...' : String(courses.length)}
              hint="Datos leidos desde /products/"
            />
            <StatCard label="Base URL" value="API" hint={API_BASE_URL} />
          </div>
        </header>

        {sessionError ? <p className="feedback feedback--error">{sessionError}</p> : null}

        <main className="content-grid">
          <div className="content-grid__primary">
            <CourseList courses={filteredCourses} categories={categories} />
            <CategoryList categories={categories} />
          </div>

          <aside className="content-grid__sidebar">
            {!user ? (
              <LoginForm isSubmitting={loggingIn} error={loginError} onSubmit={handleLogin} />
            ) : null}
            <UserPanel user={user} token={token} onLogout={handleLogout} />
          </aside>
        </main>

        <footer className="app-footer">
          <hr className="app-footer__divider" />
          <p style={{ textAlign: 'center' }}>
            Plataforma de cursos online desarrollada por vicenweb.site &copy;
          </p>
        </footer>
      </div>
    </div>
  );
}
