import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Navega a una sección de la página principal. Si el usuario está en otra ruta
 * (login, pago, política de envíos...) primero vuelve a "/" y allí se hace el scroll.
 */
export const useSectionNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(
    (sectionId: string) => {
      if (location.pathname === '/') {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        if (location.hash) {
          navigate({ pathname: '/', search: location.search }, { replace: true });
        }
      } else {
        navigate({ pathname: '/', hash: `#${sectionId}` });
      }
    },
    [location.pathname, location.hash, location.search, navigate]
  );
};
