import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Botao } from '../components/ui/Botao.jsx';
import { Icone } from '../components/ui/Icone.jsx';
import { EstadoVazio } from '../components/ui/EstadoVazio.jsx';
import { GradeProdutos } from '../components/produtos/GradeProdutos.jsx';
import { PainelFiltros } from '../components/produtos/PainelFiltros.jsx';
import { ORDENACOES, useFiltrosProdutos } from '../hooks/useFiltrosProdutos.js';
import { PRODUTOS } from '../data/produtos.js';
import { formatarNumero } from '../utils/formato.js';

/** Quantos cards aparecem antes de o visitante pedir mais. */
const LOTE = 12;

export function Produtos() {
  const controle = useFiltrosProdutos();
  const { filtros, produtos, filtrosAtivos, definirFiltros, limparFiltros } = controle;

  const [visiveis, setVisiveis] = useState(LOTE);
  const [painelAberto, setPainelAberto] = useState(false);

  // Qualquer mudança de filtro recomeça a paginação.
  useEffect(() => setVisiveis(LOTE), [filtros]);

  // Trava a rolagem enquanto o painel de filtros ocupa a tela no celular.
  useEffect(() => {
    document.body.style.overflow = painelAberto ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [painelAberto]);

  const mostrados = produtos.slice(0, visiveis);
  const restantes = produtos.length - mostrados.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <nav aria-label="Trilha de navegação" className="mb-3 text-xs text-tenue">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link to="/" className="transition-colors hover:text-neutro">
                Início
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-neutro">Produtos</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-claro sm:text-4xl">
          {filtros.busca ? (
            <>
              Resultados para <span className="texto-degrade">&ldquo;{filtros.busca}&rdquo;</span>
            </>
          ) : (
            'Catálogo completo'
          )}
        </h1>

        <p className="numerico mt-2 text-sm text-neutro">
          {formatarNumero(produtos.length)} de {formatarNumero(PRODUTOS.length)}{' '}
          {PRODUTOS.length === 1 ? 'produto' : 'produtos'}
          {filtrosAtivos.length > 0 ? ' com os filtros aplicados' : ' no catálogo'}
        </p>
      </header>

      <div className="flex gap-8">
        {/* ------------------------ Filtros (desktop) ------------------------ */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto rounded-2xl border border-borda bg-breu/70 p-5 pr-4">
            <PainelFiltros controle={controle} />
          </div>
        </aside>

        {/* ------------------------- Lista de produtos ----------------------- */}
        <div className="min-w-0 flex-1">
          {/* Barra de controle */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setPainelAberto(true)}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-borda bg-grafite px-4
                         text-sm font-semibold text-claro transition-colors hover:border-borda-forte lg:hidden"
            >
              <Icone nome="filtro" tamanho={16} className="text-turquesa-400" />
              Filtros
              {filtrosAtivos.length > 0 ? (
                <span className="numerico grid size-5 place-items-center rounded-full bg-turquesa-400 text-[11px] font-bold text-abissal">
                  {filtrosAtivos.length}
                </span>
              ) : null}
            </button>

            <div className="ml-auto flex items-center gap-2">
              <label htmlFor="ordenacao" className="text-xs font-medium text-tenue">
                Ordenar por
              </label>
              <div className="relative">
                <select
                  id="ordenacao"
                  value={filtros.ordem}
                  onChange={(evento) => definirFiltros({ ordem: evento.target.value })}
                  className="h-10 cursor-pointer appearance-none rounded-full border border-borda bg-grafite
                             py-0 pl-4 pr-9 text-sm font-medium text-claro transition-colors
                             hover:border-borda-forte focus:border-turquesa-500/60 focus:outline-none"
                >
                  {ORDENACOES.map((opcao) => (
                    <option key={opcao.id} value={opcao.id} className="bg-grafite">
                      {opcao.nome}
                    </option>
                  ))}
                </select>
                <Icone
                  nome="setaBaixo"
                  tamanho={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-tenue"
                />
              </div>
            </div>
          </div>

          {/* Filtros ativos */}
          {filtrosAtivos.length > 0 ? (
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-tenue">Filtros ativos:</span>
              {filtrosAtivos.map((ativo) => (
                <button
                  key={ativo.chave}
                  type="button"
                  onClick={() => definirFiltros(ativo.limpar)}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-turquesa-500/35
                             bg-turquesa-500/10 py-1 pl-3 pr-2 text-xs font-medium text-turquesa-300
                             transition-colors hover:border-erro/50 hover:bg-erro/10 hover:text-erro"
                >
                  {ativo.rotulo}
                  <Icone nome="fechar" tamanho={12} />
                  <span className="apenas-leitor">Remover filtro</span>
                </button>
              ))}
              <button
                type="button"
                onClick={limparFiltros}
                className="rounded-full px-2 py-1 text-xs font-semibold text-tenue underline-offset-4
                           transition-colors hover:text-claro hover:underline"
              >
                limpar tudo
              </button>
            </div>
          ) : null}

          {/* Grade */}
          {mostrados.length > 0 ? (
            <>
              <GradeProdutos produtos={mostrados} />

              {restantes > 0 ? (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <p className="numerico text-xs text-tenue">
                    Mostrando {mostrados.length} de {produtos.length}
                  </p>
                  <Botao variacao="contorno" onClick={() => setVisiveis((n) => n + LOTE)}>
                    Mostrar mais {Math.min(restantes, LOTE)}
                    <Icone nome="setaBaixo" tamanho={16} />
                  </Botao>
                </div>
              ) : null}
            </>
          ) : (
            <EstadoVazio
              icone="busca"
              titulo="Nenhum produto encontrado"
              texto="Nenhum item do catálogo atende a essa combinação de filtros. Tente remover algum critério ou pesquisar por outro termo."
            >
              <Botao variacao="contorno" onClick={limparFiltros}>
                <Icone nome="troca" tamanho={16} />
                Limpar filtros
              </Botao>
              <Botao para="/produtos">Ver catálogo completo</Botao>
            </EstadoVazio>
          )}
        </div>
      </div>

      {/* -------------------- Filtros em tela cheia (mobile) ------------------ */}
      {painelAberto ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-abissal/80 backdrop-blur-sm"
            onClick={() => setPainelAberto(false)}
            aria-label="Fechar filtros"
          />

          <div className="animate-deslizar absolute inset-y-0 left-0 flex w-[min(22rem,90vw)] flex-col border-r border-borda bg-breu">
            <div className="flex items-center justify-between border-b border-borda px-5 py-4">
              <h2 className="text-sm font-bold text-claro">Filtrar produtos</h2>
              <button
                type="button"
                onClick={() => setPainelAberto(false)}
                className="grid size-9 place-items-center rounded-full border border-borda text-neutro transition-colors hover:text-claro"
                aria-label="Fechar filtros"
              >
                <Icone nome="fechar" tamanho={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <PainelFiltros controle={controle} />
            </div>

            <div className="border-t border-borda p-4">
              <Botao blocoCompleto onClick={() => setPainelAberto(false)}>
                Ver {formatarNumero(produtos.length)}{' '}
                {produtos.length === 1 ? 'produto' : 'produtos'}
              </Botao>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
