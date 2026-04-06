import type { FormEvent } from 'react';
import type { Category } from '../types/category';

type CatalogFiltersProps = {
  categories: Category[];
  selectedCategoryId: number | 'all';
  searchDraft: string;
  categorySelectId: string;
  onCategoryChange: (value: number | 'all') => void;
  onSearchDraftChange: (value: string) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M10.5 4a6.5 6.5 0 1 0 4.03 11.6l4.43 4.44 1.41-1.42-4.43-4.43A6.5 6.5 0 0 0 10.5 4Zm0 2a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CatalogFilters({
  categories,
  selectedCategoryId,
  searchDraft,
  categorySelectId,
  onCategoryChange,
  onSearchDraftChange,
  onSearchSubmit,
}: CatalogFiltersProps) {
  // Reutilizamos el mismo bloque de filtros en escritorio y movil para que no diverjan.
  return (
    <>
      <div className="topbar__group topbar__group--compact">
        <label className="topbar__label topbar__label--featured" htmlFor={categorySelectId}>
          Categorias
        </label>
        <select
          id={categorySelectId}
          className="topbar__select"
          value={selectedCategoryId}
          onChange={(event) => {
            const value = event.target.value;
            onCategoryChange(value === 'all' ? 'all' : Number(value));
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

      <form className="topbar__search" role="search" onSubmit={onSearchSubmit}>
        <input
          type="search"
          placeholder="Buscar cursos..."
          aria-label="Buscar cursos"
          value={searchDraft}
          onChange={(event) => onSearchDraftChange(event.target.value)}
        />
        <button className="topbar__search-button" type="submit" aria-label="Activar busqueda">
          <SearchIcon />
        </button>
      </form>
    </>
  );
}
