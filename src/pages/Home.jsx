import { Link } from 'react-router-dom';
import { Botao } from '../components/ui/Botao.jsx';
import { Icone } from '../components/ui/Icone.jsx';
import { Selo } from '../components/ui/Selo.jsx';
import { GradeProdutos } from '../components/produtos/GradeProdutos.jsx';
import { ImagemProduto } from '../components/produtos/ImagemProduto.jsx';
import {
  CATEGORIAS,
  PRODUTOS,
  buscarProduto,
  caminhoProduto,
  calcularDesconto,
} from '../data/produtos.js';
import { DIFERENCIAIS, INDICADORES } from '../data/empresa.js';
import { formatarMoeda } from '../utils/formato.js';
import { FRETE_GRATIS_ACIMA } from '../utils/pedido.js';

/** Produto usado na imagem principal da home. */
const DESTAQUE_PRINCIPAL = 'krytek-forge-rgb';

const MAIS_VENDIDOS = [...PRODUTOS]
  .filter((produto) => produto.estoque > 0)
  .sort((a, b) => b.nota * Math.log10(b.avaliacoes) - a.nota * Math.log10(a.avaliacoes))
  .slice(0, 4);

const OFERTAS = [...PRODUTOS]
  .filter((produto) => produto.precoAntigo && produto.estoque > 0)
  .sort((a, b) => calcularDesconto(b) - calcularDesconto(a))
  .slice(0, 4);

/** Cabeçalho padrão das seções da home. */
function TituloSecao({ etiqueta, titulo, texto, acao }) {
  return (
    <header className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {etiqueta ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-turquesa-400">
            {etiqueta}
          </p>
        ) : null}
        <h2 className="text-2xl font-bold tracking-tight text-claro sm:text-3xl">{titulo}</h2>
        {texto ? <p className="mt-2 text-sm leading-relaxed text-neutro">{texto}</p> : null}
      </div>
      {acao}
    </header>
  );
}

export function Home() {
  const destaque = buscarProduto(DESTAQUE_PRINCIPAL);
  const descontoDestaque = destaque ? calcularDesconto(destaque) : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* ----------------------------- Vitrine ----------------------------- */}
      <section className="grid items-center gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <div className="animate-surgir">
          <Selo tom="roxo" className="mb-5">
            <Icone nome="relampago" tamanho={12} />
            Semana da tecnologia
          </Selo>

          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-claro sm:text-5xl lg:text-6xl">
            Equipamento de ponta,
            <br />
            <span className="texto-degrade">sem pagar o preço de vitrine.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-neutro">
            Smartphones, notebooks, áudio, periféricos e games selecionados item a item. Conferimos
            a ficha técnica antes de publicar e entregamos com garantia estendida de 15 meses.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Botao para="/produtos" tamanho="grande">
              Ver catálogo
              <Icone nome="setaDireita" tamanho={17} />
            </Botao>
            <Botao para="/produtos?promo=1&ordem=desconto" variacao="contorno" tamanho="grande">
              <Icone nome="etiqueta" tamanho={17} />
              Ofertas da semana
            </Botao>
          </div>

          <dl className="mt-11 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-borda pt-7 sm:grid-cols-4">
            {INDICADORES.map((indicador) => (
              <div key={indicador.rotulo}>
                <dt className="numerico text-xl font-bold text-claro">{indicador.valor}</dt>
                <dd className="mt-0.5 text-xs leading-snug text-tenue">{indicador.rotulo}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Imagem principal */}
        {destaque ? (
          <div className="animate-surgir relative mx-auto w-full max-w-lg [animation-delay:120ms]">
            <div
              aria-hidden="true"
              className="absolute -inset-8 rounded-full opacity-70 blur-3xl"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, rgba(22,214,193,0.28), transparent 60%),' +
                  'radial-gradient(circle at 70% 70%, rgba(139,70,240,0.30), transparent 62%)',
              }}
            />

            <article className="painel-vidro relative overflow-hidden rounded-3xl">
              <div className="relative aspect-4/3 overflow-hidden">
                <ImagemProduto
                  produto={destaque}
                  largura={800}
                  altura={600}
                  carregamento="eager"
                  className="size-full object-cover"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-grafite to-transparent"
                />
                {descontoDestaque > 0 ? (
                  <span className="absolute right-4 top-4">
                    <Selo tom="roxo" sobreImagem>
                      -{descontoDestaque}% OFF
                    </Selo>
                  </span>
                ) : null}
              </div>

              <div className="relative -mt-10 p-6">
                <p className="text-[11px] font-bold uppercase tracking-widest text-turquesa-300">
                  Destaque da semana
                </p>
                <h2 className="mt-1.5 text-xl font-bold text-claro">{destaque.nome}</h2>

                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {destaque.destaques.slice(0, 3).map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-borda bg-abissal/60 px-2 py-1 text-[11px] text-neutro"
                    >
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    {destaque.precoAntigo ? (
                      <p className="numerico text-xs text-tenue line-through">
                        {formatarMoeda(destaque.precoAntigo)}
                      </p>
                    ) : null}
                    <p className="numerico text-2xl font-bold text-claro">
                      {formatarMoeda(destaque.preco)}
                    </p>
                  </div>
                  <Botao para={caminhoProduto(destaque.id)} tamanho="pequeno">
                    Ver produto
                  </Botao>
                </div>
              </div>
            </article>
          </div>
        ) : null}
      </section>

      {/* -------------------------- Diferenciais --------------------------- */}
      <section aria-label="Vantagens da loja" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {DIFERENCIAIS.map((item) => (
          <div
            key={item.titulo}
            className="group rounded-2xl border border-borda bg-breu/70 p-5 transition-colors hover:border-borda-forte"
          >
            <span className="grid size-10 place-items-center rounded-xl border border-borda bg-grafite text-turquesa-400 transition-colors group-hover:text-turquesa-300">
              <Icone nome={item.icone} tamanho={19} />
            </span>
            <h3 className="mt-3.5 text-sm font-semibold text-claro">{item.titulo}</h3>
            <p className="mt-1 text-xs leading-relaxed text-tenue">{item.texto}</p>
          </div>
        ))}
      </section>

      {/* --------------------------- Categorias ---------------------------- */}
      <section className="pt-20">
        <TituloSecao
          etiqueta="Navegue por tipo"
          titulo="Categorias"
          texto="Oito famílias de produtos, cada uma com filtros próprios de marca, preço e avaliação."
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIAS.map((categoria) => {
            const quantidade = PRODUTOS.filter(
              (produto) => produto.categoria === categoria.id,
            ).length;

            return (
              <Link
                key={categoria.id}
                to={`/produtos?cat=${categoria.id}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border
                           border-borda bg-breu p-5 transition-[border-color,transform] duration-300
                           hover:-translate-y-1 hover:border-turquesa-500/50"
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-6 -top-6 size-24 rounded-full bg-purpura-500/10 blur-2xl
                             transition-colors duration-300 group-hover:bg-turquesa-500/15"
                />

                <span className="relative grid size-11 place-items-center rounded-xl border border-borda bg-grafite text-purpura-300 transition-colors group-hover:border-turquesa-500/40 group-hover:text-turquesa-300">
                  <Icone nome={categoria.icone} tamanho={21} />
                </span>

                <span className="relative mt-8 block">
                  <span className="block text-sm font-semibold text-claro">{categoria.nome}</span>
                  <span className="numerico mt-0.5 flex items-center gap-1.5 text-xs text-tenue">
                    {quantidade} {quantidade === 1 ? 'produto' : 'produtos'}
                    <Icone
                      nome="setaDireita"
                      tamanho={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* -------------------------- Mais vendidos -------------------------- */}
      <section className="pt-20">
        <TituloSecao
          etiqueta="Escolha do público"
          titulo="Os mais bem avaliados"
          texto="Ranking montado pela nota média cruzada com o volume de avaliações."
          acao={
            <Botao para="/produtos?ordem=nota" variacao="contorno" tamanho="pequeno">
              Ver todos
              <Icone nome="setaDireita" tamanho={15} />
            </Botao>
          }
        />
        <GradeProdutos produtos={MAIS_VENDIDOS} prioridadeAte={2} />
      </section>

      {/* ----------------------------- Ofertas ----------------------------- */}
      <section className="pt-20">
        <TituloSecao
          etiqueta="Preço reduzido"
          titulo="Ofertas com maior desconto"
          texto="Promoções válidas enquanto durarem os estoques apresentados."
          acao={
            <Botao para="/produtos?promo=1&ordem=desconto" variacao="contorno" tamanho="pequeno">
              Ver todas
              <Icone nome="setaDireita" tamanho={15} />
            </Botao>
          }
        />
        <GradeProdutos produtos={OFERTAS} prioridadeAte={0} />
      </section>

      {/* ------------------------- Chamada final --------------------------- */}
      <section className="pt-20">
        <div className="painel-vidro relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12">
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(139,70,240,0.18), transparent 70%)',
            }}
          />

          <div className="relative mx-auto max-w-2xl">
            <Selo tom="turquesa" className="mb-4">
              <Icone nome="caminhao" tamanho={12} />
              Entrega para todo o Brasil
            </Selo>

            <h2 className="text-2xl font-bold tracking-tight text-claro sm:text-3xl">
              Frete grátis a partir de {formatarMoeda(FRETE_GRATIS_ACIMA)}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutro">
              Use o cupom <strong className="font-bold text-turquesa-300">ASCENSAO10</strong> no
              carrinho e garanta 10% de desconto. Pagando no Pix, o desconto é somado ao do cupom.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Botao para="/produtos" tamanho="grande">
                Começar a comprar
                <Icone nome="setaDireita" tamanho={17} />
              </Botao>
              <Botao para="/quem-somos" variacao="fantasma" tamanho="grande">
                Conhecer a loja
              </Botao>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
