import type { Category } from '../types/category';

type CategoryListProps = {
  categories: Category[];
};

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <section className="panel">
      <div className="panel__header">
        <p className="eyebrow">Categorias</p>
        <h2>Datos traidos desde FastAPI</h2>
      </div>

      <div className="chip-list">
        {categories.length === 0 ? (
          <p className="empty-state">No hay categorias registradas.</p>
        ) : (
          categories.map((category) => (
            <span className="chip" key={category.id}>
              {category.name || `Categoria #${category.id}`}
            </span>
          ))
        )}
      </div>
    </section>
  );
}
