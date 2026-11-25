import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImagemProduto } from './ImagemProduto.jsx';
import { Estrelas } from '../ui/Estrelas.jsx';
import { Icone } from '../ui/Icone.jsx';
import { Selo } from '../ui/Selo.jsx';
import { useCarrinho } from '../../hooks/useCarrinho.js';
import { caminhoProduto, calcularDesconto, nomeCategoria } from '../../data/produtos.js';
import { formatarMoeda, valorParcela } from '../../utils/formato.js';

const ANO_LANCAMENTO_RECENTE = 2025;
const PARCELAS_VITRINE = 12;

/**
 * Card de produto da vitrine e da listagem.
 *
 * @param {object} props
 * @param {import('../../data/produtos.js').Produto} props.produto
 * @param {boolean} [props.prioridade] carrega a imagem imediatamente (primeira dobra)
 */
export function CardProduto({ produto, prioridade = false }) {
  const { adicionar, quantidadeDe } = useCarrinho();
  const [confirmado, setConfirmado] = useState(false);
  const cronometro = useRef(null);

  const desconto = calcularDesconto(produto);
  const esgotado = produto.estoque === 0;
  const noCarrinho = quantidadeDe(produto.id);
  const ultimasUnidades = !esgotado && produto.estoque <= 5;

  useEffect(() => () => clearTimeout(cronometro.current), []);

  const aoAdicionar = () => {
    adicionar(produto.id, 1);
    setConfirmado(true);
    clearTimeout(cronometro.current);
    cronometro.current = setTimeout(() => setConfirmado(false), 1600);
  };

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-borda bg-breu
                 transition-[border-color,transform,box-shadow] duration-300
                 hover:-translate-y-1 hover:border-borda-forte hover:shadow-[0_24px_48px_-24px_rgba(0,0,0,0.9)]"
    >
      {/* Brilho que acompanha o hover, puramente decorativo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300
                   group-hover:opacity-100
                   bg-[radial-gradient(420px_circle_at_50%_-10%,rgba(22,214,193,0.16),transparent_70%)]"
      />

      <div className="relative aspect-square overflow-hidden bg-grafite">
        <Link to={caminhoProduto(produto.id)} tabIndex={-1} aria-hidden="true">
          <ImagemProduto
            produto={produto}
            largura={520}
            altura={520}
            carregamento={prioridade ? 'eager' : 'lazy'}
            className={`size-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              esgotado ? 'grayscale-[0.75] opacity-55' : ''
            }`}
          />
        </Link>

        {/* Degradê para o texto não competir com a foto */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-breu to-transparent"
        />

        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {desconto > 0 && !esgotado ? (
            <Selo tom="roxo" sobreImagem>
              -{desconto}%
            </Selo>
          ) : null}
          {produto.lancamento >= ANO_LANCAMENTO_RECENTE && !esgotado ? (
            <Selo tom="turquesa" sobreImagem>
              Lançamento
            </Selo>
          ) : null}
          {esgotado ? (
            <Selo tom="neutro" sobreImagem>
              Esgotado
            </Selo>
          ) : null}
        </div>

        {noCarrinho > 0 ? (
          <span
            className="numerico absolute right-3 top-3 grid size-7 place-items-center rounded-full
                       bg-turquesa-500 text-xs font-bold text-abissal shadow-lg"
            title={`${noCarrinho} no carrinho`}
          >
            {noCarrinho}
          </span>
        ) : null}
      </div>

      <div className="relative flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-purpura-300">
            {nomeCategoria(produto.categoria)}
          </span>
          <span className="text-[11px] font-medium text-tenue">{produto.marca}</span>
        </div>

        <h3 className="text-base font-semibold leading-snug text-claro">
          {/* O ::after estica a área clicável por todo o card, mantendo um
              único link no fluxo de leitura dos leitores de tela. */}
          <Link
            to={caminhoProduto(produto.id)}
            className="transition-colors after:absolute after:inset-0 after:content-[''] hover:text-turquesa-300"
          >
            {produto.nome}
          </Link>
        </h3>

        <Estrelas nota={produto.nota} avaliacoes={produto.avaliacoes} />

        <p className="line-clamp-2 text-xs leading-relaxed text-tenue">{produto.resumo}</p>

        <div className="mt-auto pt-2">
          {produto.precoAntigo ? (
            <p className="numerico text-xs text-tenue line-through">
              {formatarMoeda(produto.precoAntigo)}
            </p>
          ) : (
            <p className="text-xs text-transparent select-none" aria-hidden="true">
              &nbsp;
            </p>
          )}

          <p className="numerico text-xl font-bold tracking-tight text-claro">
            {formatarMoeda(produto.preco)}
          </p>
          <p className="numerico text-[11px] text-tenue">
            em até {PARCELAS_VITRINE}x de{' '}
            {formatarMoeda(valorParcela(produto.preco, PARCELAS_VITRINE))} sem juros
          </p>

          {ultimasUnidades ? (
            <p className="mt-2 text-[11px] font-semibold text-alerta">
              Últimas {produto.estoque} unidades
            </p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={aoAdicionar}
          disabled={esgotado}
          aria-label={esgotado ? `${produto.nome} está esgotado` : `Adicionar ${produto.nome} ao carrinho`}
          className={`relative z-10 mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-xl
                      text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed ${
                        esgotado
                          ? 'border border-borda bg-transparent text-tenue'
                          : confirmado
                            ? 'bg-sucesso text-abissal'
                            : 'border border-borda-forte bg-grafite text-claro hover:border-turquesa-500/70 hover:bg-turquesa-500/12 hover:text-turquesa-300'
                      }`}
        >
          <Icone nome={esgotado ? 'cadeado' : confirmado ? 'check' : 'carrinho'} tamanho={17} />
          {esgotado ? 'Indisponível' : confirmado ? 'Adicionado!' : 'Adicionar'}
        </button>
      </div>
    </article>
  );
}
