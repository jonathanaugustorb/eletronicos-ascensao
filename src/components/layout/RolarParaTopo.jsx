import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Leva a página ao topo a cada troca de rota.
 *
 * A mudança apenas da query string (filtros, busca) não reposiciona a página,
 * para quem está filtrando não perder o lugar na lista.
 */
export function RolarParaTopo() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const alvo = document.getElementById(hash.slice(1));
      if (alvo) {
        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}
