import logo from '../assets/images/logo.png';

type AcademyBrandProps = {
  variant?: 'topbar' | 'drawer';
};

const BRAND_NAME = 'Vicenweb Academy';
const BRAND_TAGLINE = 'Plataforma moderna de cursos online';

export function AcademyBrand({ variant = 'topbar' }: AcademyBrandProps) {
  // Mantenemos la marca en un unico componente para evitar textos duplicados.
  const className = variant === 'drawer' ? 'topbar__drawer-brand' : 'topbar__brand';

  return (
    <div className={className}>
      <img src={logo} alt="Logo de la academia" />
      <div>
        <strong>{BRAND_NAME}</strong>
        <p>{BRAND_TAGLINE}</p>
      </div>
    </div>
  );
}
