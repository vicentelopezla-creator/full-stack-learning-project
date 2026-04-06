import type { FormEvent, RefObject } from 'react';
import type { Category } from '../types/category';
import type { User } from '../types/user';
import { AcademyBrand } from './AcademyBrand';
import { CatalogFilters } from './CatalogFilters';

type TopbarProps = {
  categories: Category[];
  selectedCategoryId: number | 'all';
  searchDraft: string;
  cartCount: number;
  user: User | null;
  displayName: string;
  userInitials: string;
  isMenuOpen: boolean;
  isProfileMenuOpen: boolean;
  profileMenuRef: RefObject<HTMLDivElement | null>;
  onCategoryChange: (value: number | 'all') => void;
  onSearchDraftChange: (value: string) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onProfileToggle: () => void;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
};

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 4h2.2c.46 0 .87.31.98.76L6.7 7H20a1 1 0 0 1 .97 1.24l-1.4 5.6a1 1 0 0 1-.97.76H8.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="18.5" r="1.5" fill="currentColor" />
      <circle cx="17" cy="18.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function Topbar({
  categories,
  selectedCategoryId,
  searchDraft,
  cartCount,
  user,
  displayName,
  userInitials,
  isMenuOpen,
  isProfileMenuOpen,
  profileMenuRef,
  onCategoryChange,
  onSearchDraftChange,
  onSearchSubmit,
  onMenuToggle,
  onMenuClose,
  onProfileToggle,
  onLoginClick,
  onRegisterClick,
  onLogout,
}: TopbarProps) {
  // Concentramos la navegacion completa fuera de App.tsx para dejarlo como orquestador.
  return (
    <>
      <header className="topbar">
        <div className="topbar__inner">
          <button
            type="button"
            className="topbar__menu-button"
            aria-label={isMenuOpen ? 'Cerrar menu principal' : 'Abrir menu principal'}
            aria-expanded={isMenuOpen}
            aria-controls="topbar-navigation"
            onClick={onMenuToggle}
          >
            <span />
            <span />
            <span />
          </button>

          <AcademyBrand />

          <div className="topbar__mobile-spacer" aria-hidden="true" />

          <nav className="topbar__nav" aria-label="Navegacion principal">
            <CatalogFilters
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              searchDraft={searchDraft}
              categorySelectId="category-filter"
              onCategoryChange={onCategoryChange}
              onSearchDraftChange={onSearchDraftChange}
              onSearchSubmit={onSearchSubmit}
            />

            <div className="topbar__actions">
              <span className="topbar__link topbar__link--learning topbar__action--learning">
                Mi aprendizaje
              </span>
              <span
                className="topbar__cart topbar__action--primary"
                aria-label={`Carrito con ${cartCount} productos`}
              >
                <span className="topbar__cart-icon" aria-hidden="true">
                  <CartIcon />
                </span>
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
                    onClick={onProfileToggle}
                  >
                    <span className="topbar__profile-avatar" aria-hidden="true">
                      {userInitials}
                    </span>
                    <span className="topbar__profile-copy">
                      <span className="topbar__profile-label">Sesion activa</span>
                      <strong>{displayName}</strong>
                    </span>
                    <span className="topbar__profile-caret" aria-hidden="true">
                      {'\u25BE'}
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
                        onClick={onLogout}
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
                    onClick={onLoginClick}
                  >
                    Iniciar sesion
                  </button>
                  <button
                    type="button"
                    className="topbar__link topbar__link--accent topbar__action-button topbar__action--tertiary"
                    onClick={onRegisterClick}
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
          <AcademyBrand variant="drawer" />

          <button
            type="button"
            className="topbar__drawer-close"
            aria-label="Cerrar menu"
            onClick={onMenuClose}
          >
            <span aria-hidden="true">x</span>
            <span>Salir</span>
          </button>
        </div>

        <div className="topbar__drawer-body">
          <CatalogFilters
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            searchDraft={searchDraft}
            categorySelectId="category-filter-drawer"
            onCategoryChange={onCategoryChange}
            onSearchDraftChange={onSearchDraftChange}
            onSearchSubmit={onSearchSubmit}
          />

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
                  <button type="button" className="topbar__mobile-action" onClick={onLogout}>
                    Cerrar sesion
                  </button>
                </li>
              ) : (
                <>
                  <li className="topbar__mobile-item">
                    <button type="button" className="topbar__mobile-action" onClick={onLoginClick}>
                      Iniciar sesion
                    </button>
                  </li>
                  <li className="topbar__mobile-item topbar__mobile-item--accent">
                    <button
                      type="button"
                      className="topbar__mobile-action"
                      onClick={onRegisterClick}
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
        onClick={onMenuClose}
      />
    </>
  );
}
