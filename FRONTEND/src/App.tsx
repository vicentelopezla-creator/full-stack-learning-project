import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { AppFooter } from './components/AppFooter';
import { AuthDialog } from './components/AuthDialog';
import { CategoryList } from './components/CategoryList';
import { CourseList } from './components/CourseList';
import { HeroSection } from './components/HeroSection';
import { LoginForm } from './components/LoginForm';
import { Topbar } from './components/Topbar';
import { UserPanel } from './components/UserPanel';
import { clearStoredToken, getStoredToken, setStoredToken } from './lib/storage';
import { getUserDisplayName, getUserInitials } from './lib/user';
import {
  getCurrentUser,
  getRegistrationChallenge,
  login,
  requestRegistrationCode,
  verifyRegistrationCode,
} from './services/auth';
import { getCarrito } from './services/carrito';
import { getCategories, getCourses, getHealth } from './services/catalog';
import type {
  AuthDialogMode,
  LoginResponse,
  RegistrationChallenge,
  RegistrationFormValues,
} from './types/auth';
import type { Category } from './types/category';
import type { Course } from './types/course';
import type { User } from './types/user';

const CONSENT_VERSION = '2026-03';

export default function App() {
  const [healthStatus, setHealthStatus] = useState('Comprobando...');
  const [catalogError, setCatalogError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => getStoredToken());
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
  const isOverlayOpen = isMenuOpen || isAuthDialogOpen;

  useEffect(() => {
    // Cargamos el catalogo publico al montar la pantalla para que el home arranque con datos reales.
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
        setCatalogError(null);
      } catch (error) {
        setHealthStatus('error');
        setCatalogError(error instanceof Error ? error.message : 'No se pudo cargar la API');
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

    // Revalidamos el token guardado antes de dar por buena la sesion local.
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

    // Mantenemos el contador del carrito sincronizado sin acoplar el header al servicio.
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

    if (isOverlayOpen) {
      body.style.overflow = 'hidden';
      body.style.touchAction = 'none';
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.touchAction = previousTouchAction;
    };
  }, [isOverlayOpen]);

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

  function resetRegistrationFeedback() {
    setRegistrationError(null);
    setRegistrationMessage(null);
    setPendingRegistrationEmail('');
  }

  function handleAuthSuccess(response: LoginResponse) {
    // Unificamos el exito de login y registro porque ambos terminan creando sesion.
    setStoredToken(response.access_token);
    setToken(response.access_token);
    setUser(response.user);
    setSessionError(null);
    setIsAuthDialogOpen(false);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
    setLoginError(null);
    resetRegistrationFeedback();
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
    setSessionError(null);
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }

  function handleCategoryChange(value: number | 'all') {
    setSelectedCategoryId(value);
  }

  function handleSearchDraftChange(value: string) {
    setSearchDraft(value);
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchTerm(searchDraft.trim().toLowerCase());
  }

  async function loadRegistrationChallenge() {
    try {
      const challenge = await getRegistrationChallenge();
      setRegistrationChallenge(challenge);
      setRegistrationError(null);
    } catch (error) {
      setRegistrationError(
        error instanceof Error ? error.message : 'No se pudo preparar el registro',
      );
    }
  }

  function openAuthDialog(mode: AuthDialogMode = 'login') {
    setLoginError(null);
    resetRegistrationFeedback();
    setIsMenuOpen(false);
    setAuthDialogMode(mode);
    setIsAuthDialogOpen(true);

    if (mode === 'register') {
      void loadRegistrationChallenge();
    }
  }

  function closeAuthDialog() {
    setLoginError(null);
    resetRegistrationFeedback();
    setIsAuthDialogOpen(false);
  }

  function handleAuthDialogModeChange(mode: AuthDialogMode) {
    setLoginError(null);
    resetRegistrationFeedback();
    setAuthDialogMode(mode);

    if (mode === 'register' && !registrationChallenge) {
      void loadRegistrationChallenge();
    }
  }

  async function handleRegistrationRequest(payload: RegistrationFormValues) {
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
        consent_version: CONSENT_VERSION,
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

  const filteredCourses = courses.filter((course) => {
    const matchesCategory =
      selectedCategoryId === 'all' || course.category_id === selectedCategoryId;

    const matchesSearch =
      searchTerm.length === 0 ||
      (course.name || '').toLowerCase().includes(searchTerm) ||
      (course.detalle || '').toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  const displayName = user ? getUserDisplayName(user) : '';
  const userInitials = user ? getUserInitials(user) : '';

  return (
    <div className="page-shell">
      <Topbar
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        searchDraft={searchDraft}
        cartCount={cartCount}
        user={user}
        displayName={displayName}
        userInitials={userInitials}
        isMenuOpen={isMenuOpen}
        isProfileMenuOpen={isProfileMenuOpen}
        profileMenuRef={profileMenuRef}
        onCategoryChange={handleCategoryChange}
        onSearchDraftChange={handleSearchDraftChange}
        onSearchSubmit={handleSearchSubmit}
        onMenuToggle={() => setIsMenuOpen((current) => !current)}
        onMenuClose={() => setIsMenuOpen(false)}
        onProfileToggle={() => setIsProfileMenuOpen((current) => !current)}
        onLoginClick={() => openAuthDialog('login')}
        onRegisterClick={() => openAuthDialog('register')}
        onLogout={handleLogout}
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
          consentVersion={CONSENT_VERSION}
          onClose={closeAuthDialog}
          onModeChange={handleAuthDialogModeChange}
          onLogin={handleLogin}
          onRequestRegistration={handleRegistrationRequest}
          onVerifyRegistration={handleRegistrationVerification}
        />
      ) : null}

      <div className="app-shell">
        <HeroSection
          healthStatus={healthStatus}
          loadingCatalog={loadingCatalog}
          categoryCount={categories.length}
          courseCount={courses.length}
        />

        {catalogError ? <p className="feedback feedback--error">{catalogError}</p> : null}
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

        <AppFooter />
      </div>
    </div>
  );
}
