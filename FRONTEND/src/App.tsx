import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { CategoryList } from './components/CategoryList';
import { CourseList } from './components/CourseList';
import { LoginForm } from './components/LoginForm';
import { StatCard } from './components/StatCard';
import { UserPanel } from './components/UserPanel';
import { clearStoredToken, getStoredToken, setStoredToken } from './lib/storage';
import { getCurrentUser, login } from './services/auth';
import { getCarrito } from './services/carrito';
import { getCategories, getCourses, getHealth } from './services/catalog';
import { API_BASE_URL } from './lib/api';
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

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchTerm(searchDraft.trim().toLowerCase());
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

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="topbar__inner">
          <div className="topbar__brand">
            <img src={logo} alt="Logo de la academia" />
            <div>
              <strong>Vicenweb Academy</strong>
              <p>Plataforma moderna de cursos online</p>
            </div>
          </div>

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
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name || `Categoria ${category.id}`}
                  </option>
                ))}
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
              <span className="topbar__link topbar__link--learning">Mi aprendizaje</span>
              <span className="topbar__cart" aria-label={`Carrito con ${cartCount} productos`}>
                <span className="topbar__cart-icon">🛒</span>
                <span className="topbar__cart-count">{cartCount}</span>
              </span>
              <span className="topbar__link topbar__link--session">Iniciar sesion</span>
              <span className="topbar__link topbar__link--accent">Registrate</span>
            </div>
          </nav>
        </div>
      </header>

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
            <CourseList courses={filteredCourses} categories={categories} />
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
