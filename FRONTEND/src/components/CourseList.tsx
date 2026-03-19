import type { Category, Course } from '../types/api';

type CourseListProps = {
  courses: Course[];
  categories: Category[];
};

function getCategoryName(categoryId: number, categories: Category[]) {
  return categories.find((category) => category.id === categoryId)?.name || 'Sin categoria';
}

export function CourseList({ courses, categories }: CourseListProps) {
  return (
    <section className="panel">
      <div className="panel__header">
        <p className="eyebrow">Cursos</p>
        <h2>Listado inicial para tu academia</h2>
      </div>

      <div className="course-grid">
        {courses.length === 0 ? (
          <p className="empty-state">No hay cursos disponibles todavia.</p>
        ) : (
          courses.map((course) => (
            <article className="course-card" key={course.id}>
              <div className="course-card__top">
                <span className="course-card__tag">
                  {getCategoryName(course.category_id, categories)}
                </span>
                <span className="course-card__sales">{course.num_ventas} ventas</span>
              </div>

              <h3>{course.name || `Curso #${course.id}`}</h3>
              <p>{course.detalle || 'Sin descripcion corta.'}</p>

              <div className="course-card__bottom">
                <strong>
                  {course.precio_ahora ? `$${course.precio_ahora}` : 'Precio pendiente'}
                </strong>
                {course.url ? (
                  <a href={course.url} target="_blank" rel="noreferrer">
                    Ver enlace
                  </a>
                ) : (
                  <span className="muted-text">Sin URL</span>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
