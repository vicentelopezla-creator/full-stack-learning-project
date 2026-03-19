import { useEffect, useState } from 'react';
import { CategoryList } from './components/CategoryList';
import { CourseList } from './components/CourseList';
import { LoginForm } from './components/LoginForm';
import { StatCard } from './components/StatCard';
import { UserPanel } from './components/UserPanel';
import { clearStoredToken, getStoredToken, setStoredToken } from './lib/storage';
import { getCurrentUser, login } from './services/auth';
import { getCategories, getCourses, getHealth } from './services/catalog';
import { API_BASE_URL } from './lib/api';
import type { Category, Course, User } from './types/api';

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

  async function handleLogin(email: string, password: string) {
    try {
      setLoggingIn(true);
      setLoginError(null);

      const response = await login({ email, password });
      setStoredToken(response.access_token);
      setToken(response.access_token);
      setUser(response.user);
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
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Frontend base</p>
          <h1>Academia Full Stack conectada a FastAPI</h1>
          <p className="hero__text">
            Esta base te deja listo para crecer hacia un panel real de cursos,
            autenticacion, carrito y consumo ordenado de tu API REST.
          </p>
        </div>

        <div className="hero__stats">
          <StatCard
            label="API"
            value={healthStatus}
            hint="Respuesta del endpoint /health"
          />
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
          <StatCard
            label="Base URL"
            value="API"
            hint={API_BASE_URL}
          />
        </div>
      </header>

      {sessionError ? <p className="feedback feedback--error">{sessionError}</p> : null}

      <main className="content-grid">
        <div className="content-grid__primary">
          <CourseList courses={courses} categories={categories} />
          <CategoryList categories={categories} />
        </div>

        <aside className="content-grid__sidebar">
          <LoginForm
            isSubmitting={loggingIn}
            error={loginError}
            onSubmit={handleLogin}
          />
          <UserPanel user={user} token={token} onLogout={handleLogout} />
        </aside>
      </main>
    </div>
  );
}
