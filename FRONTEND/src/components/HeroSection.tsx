import { API_BASE_URL } from '../lib/api';
import { StatCard } from './StatCard';

type HeroSectionProps = {
  healthStatus: string;
  loadingCatalog: boolean;
  categoryCount: number;
  courseCount: number;
};

export function HeroSection({
  healthStatus,
  loadingCatalog,
  categoryCount,
  courseCount,
}: HeroSectionProps) {
  // El hero resume el estado tecnico para que la pantalla sirva como panel inicial del proyecto.
  return (
    <header className="hero">
      <div className="hero__copy">
        <p className="eyebrow">Frontend base</p>
        <h1>Academia Full Stack conectada a FastAPI</h1>
        <p className="hero__text">
          Esta base te deja listo para crecer hacia un panel real de cursos, autenticacion, carrito
          y consumo ordenado de tu API REST.
        </p>
      </div>

      <div className="hero__stats">
        <StatCard label="API" value={healthStatus} hint="Respuesta del endpoint /health" />
        <StatCard
          label="Categorias"
          value={loadingCatalog ? '...' : String(categoryCount)}
          hint="Datos leidos desde /categories/"
        />
        <StatCard
          label="Cursos"
          value={loadingCatalog ? '...' : String(courseCount)}
          hint="Datos leidos desde /products/"
        />
        <StatCard label="Base URL" value="API" hint={API_BASE_URL} />
      </div>
    </header>
  );
}
