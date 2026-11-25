import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icone } from './Icone.jsx';
import { PRODUTOS, caminhoProduto, montarUrlFoto, nomeCategoria } from '../../data/produtos.js';
import { formatarMoeda, normalizar } from '../../utils/formato.js';

const MAXIMO_SUGESTOES = 5;

/**
 * Retorna até cinco produtos que combinam com o termo digitado.
 *
 * Usa o mesmo critério da listagem: o termo precisa iniciar alguma palavra do
 * produto, para que "fone" não traga resultados por causa de "telefone".
 *
 * @param {string} termo
 */
function sugerir(termo) {
  const busca = normalizar(termo);
  if (busca.length < 2) return [];

  return PRODUTOS.filter((produto) =>
    normalizar(
      `${produto.nome} ${produto.marca} ${nomeCategoria(produto.categoria)} ${produto.etiquetas.join(' ')}`,
    )
      .split(/[^a-z0-9]+/)
      .some((palavra) => palavra.startsWith(busca)),
  )
    .sort((a, b) => b.nota - a.nota)
    .slice(0, MAXIMO_SUGESTOES);
}

/**
 * Barra de pesquisa com sugestões ao vivo.
 *
 * Enter abre a listagem filtrada; as setas percorrem as sugestões e Esc fecha.
 *
 * @param {object} props
 * @param {string} [props.valorInicial]
 * @param {boolean} [props.focoAutomatico]
 * @param {() => void} [props.aoNavegar] chamado após ir para outra página
 * @param {string} [props.className]
 */
export function CampoBusca({
  valorInicial = '',
  focoAutomatico = false,
  aoNavegar,
  className = '',
}) {
  const [termo, setTermo] = useState(valorInicial);
  const [aberto, setAberto] = useState(false);
  const [destacado, setDestacado] = useState(-1);

  const navegar = useNavigate();
  const containerRef = useRef(null);
  const idLista = useId();

  const sugestoes = useMemo(() => sugerir(termo), [termo]);

  // Fecha as sugestões ao clicar fora do campo.
  useEffect(() => {
    if (!aberto) return undefined;

    const aoClicarFora = (evento) => {
      if (!containerRef.current?.contains(evento.target)) setAberto(false);
    };
    document.addEventListener('mousedown', aoClicarFora);
    return () => document.removeEventListener('mousedown', aoClicarFora);
  }, [aberto]);

  const irParaBusca = (texto) => {
    const limpo = texto.trim();
    navegar(limpo ? `/produtos?busca=${encodeURIComponent(limpo)}` : '/produtos');
    setAberto(false);
    setDestacado(-1);
    aoNavegar?.();
  };

  const irParaProduto = (produto) => {
    navegar(caminhoProduto(produto.id));
    setTermo(produto.nome);
    setAberto(false);
    setDestacado(-1);
    aoNavegar?.();
  };

  const aoTeclar = (evento) => {
    if (evento.key === 'Escape') {
      setAberto(false);
      setDestacado(-1);
      return;
    }

    if (!aberto || sugestoes.length === 0) return;

    if (evento.key === 'ArrowDown') {
      evento.preventDefault();
      setDestacado((atual) => (atual + 1) % sugestoes.length);
    } else if (evento.key === 'ArrowUp') {
      evento.preventDefault();
      setDestacado((atual) => (atual <= 0 ? sugestoes.length - 1 : atual - 1));
    } else if (evento.key === 'Enter' && destacado >= 0) {
      evento.preventDefault();
      irParaProduto(sugestoes[destacado]);
    }
  };

  const mostrarLista = aberto && sugestoes.length > 0;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form
        role="search"
        onSubmit={(evento) => {
          evento.preventDefault();
          irParaBusca(termo);
        }}
      >
        <label htmlFor={`${idLista}-campo`} className="apenas-leitor">
          Pesquisar produtos
        </label>

        <div className="group relative flex items-center">
          <Icone
            nome="busca"
            tamanho={18}
            className="pointer-events-none absolute left-4 text-tenue transition-colors group-focus-within:text-turquesa-400"
          />

          <input
            id={`${idLista}-campo`}
            type="search"
            value={termo}
            onChange={(evento) => {
              setTermo(evento.target.value);
              setAberto(true);
              setDestacado(-1);
            }}
            onFocus={() => setAberto(true)}
            onKeyDown={aoTeclar}
            autoFocus={focoAutomatico}
            placeholder="Buscar notebook, fone, console..."
            autoComplete="off"
            role="combobox"
            aria-expanded={mostrarLista}
            aria-controls={idLista}
            aria-autocomplete="list"
            className="h-11 w-full rounded-full border border-borda bg-breu/80 pl-11 pr-24 text-sm text-claro
                       placeholder:text-tenue transition-colors hover:border-borda-forte
                       focus:border-turquesa-500/60 focus:bg-breu focus:outline-none"
          />

          <button
            type="submit"
            className="absolute right-1.5 h-8 rounded-full bg-linear-to-r from-turquesa-400 to-turquesa-500
                       px-4 text-xs font-bold text-abissal transition-opacity hover:opacity-90"
          >
            Buscar
          </button>
        </div>
      </form>

      {mostrarLista ? (
        <ul
          id={idLista}
          role="listbox"
          aria-label="Sugestões de produtos"
          className="animate-surgir absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl
                     border border-borda bg-grafite/95 shadow-2xl shadow-black/60 backdrop-blur-xl"
        >
          {sugestoes.map((produto, indice) => (
            <li key={produto.id} role="option" aria-selected={indice === destacado}>
              <button
                type="button"
                onMouseEnter={() => setDestacado(indice)}
                onClick={() => irParaProduto(produto)}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                  indice === destacado ? 'bg-fumaca' : 'hover:bg-fumaca/60'
                }`}
              >
                <img
                  src={montarUrlFoto(produto.foto, 96, 96)}
                  alt=""
                  loading="lazy"
                  className="size-11 shrink-0 rounded-lg border border-borda object-cover"
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-claro">
                    {produto.nome}
                  </span>
                  <span className="block text-xs text-tenue">{nomeCategoria(produto.categoria)}</span>
                </span>
                <span className="numerico shrink-0 text-sm font-bold text-turquesa-300">
                  {formatarMoeda(produto.preco)}
                </span>
              </button>
            </li>
          ))}

          <li>
            <button
              type="button"
              onClick={() => irParaBusca(termo)}
              className="flex w-full items-center justify-center gap-2 border-t border-borda px-3 py-2.5
                         text-xs font-semibold text-purpura-300 transition-colors hover:bg-fumaca"
            >
              Ver todos os resultados de &ldquo;{termo.trim()}&rdquo;
              <Icone nome="setaDireita" tamanho={14} />
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
