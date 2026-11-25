import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Botao } from '../components/ui/Botao.jsx';
import { Icone } from '../components/ui/Icone.jsx';
import { Selo } from '../components/ui/Selo.jsx';
import { AUTORIA, EMPRESA, HISTORIA, INDICADORES, PERGUNTAS, VALORES } from '../data/empresa.js';
import { PRODUTOS } from '../data/produtos.js';

/** Item recolhível da seção de perguntas frequentes. */
function Pergunta({ pergunta, resposta, aberta, aoAlternar }) {
  return (
    <div className="border-b border-borda last:border-b-0">
      <h3>
        <button
          type="button"
          onClick={aoAlternar}
          aria-expanded={aberta}
          className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors hover:text-turquesa-300"
        >
          <span className={`text-sm font-semibold ${aberta ? 'text-turquesa-300' : 'text-claro'}`}>
            {pergunta}
          </span>
          <Icone
            nome="setaBaixo"
            tamanho={17}
            className={`shrink-0 text-tenue transition-transform duration-200 ${aberta ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>

      {aberta ? (
        <p className="animate-surgir pb-4 pr-8 text-sm leading-relaxed text-neutro">{resposta}</p>
      ) : null}
    </div>
  );
}

export function QuemSomos() {
  const [perguntaAberta, setPerguntaAberta] = useState(0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* ---------------------------- Abertura ---------------------------- */}
      <section className="py-10 text-center lg:py-16">
        <Selo tom="roxo" className="mb-5">
          Desde {EMPRESA.fundacao} &middot; {EMPRESA.cidade}
        </Selo>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-claro sm:text-5xl">
          Uma loja de eletrônicos feita por quem{' '}
          <span className="texto-degrade">conserta eletrônicos</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-neutro">
          A {EMPRESA.nome} nasceu de uma bancada de reparos. Quem passa anos abrindo aparelho
          aprende rápido quais duram e quais só parecem bons na caixa — e é essa régua que usamos
          para escolher cada item do catálogo.
        </p>

        <dl className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          {INDICADORES.map((indicador) => (
            <div key={indicador.rotulo} className="rounded-2xl border border-borda bg-breu/70 p-4">
              <dt className="numerico text-2xl font-bold text-claro">{indicador.valor}</dt>
              <dd className="mt-1 text-xs leading-snug text-tenue">{indicador.rotulo}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ----------------------------- História ---------------------------- */}
      <section className="pt-14">
        <header className="mb-9 max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-turquesa-400">
            Como chegamos aqui
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-claro sm:text-3xl">
            Nossa trajetória
          </h2>
        </header>

        <ol className="relative space-y-8 border-l border-borda pl-8">
          {HISTORIA.map((etapa) => (
            <li key={etapa.ano} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[2.3rem] top-1 grid size-5 place-items-center rounded-full border border-turquesa-500/50 bg-abissal"
              >
                <span className="size-2 rounded-full bg-linear-to-br from-turquesa-400 to-purpura-400" />
              </span>

              <p className="numerico text-xs font-bold tracking-widest text-purpura-300">
                {etapa.ano}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-claro">{etapa.titulo}</h3>
              <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-neutro">{etapa.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ------------------------------ Valores ---------------------------- */}
      <section className="pt-20">
        <header className="mb-9 max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-turquesa-400">
            O que não abrimos mão
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-claro sm:text-3xl">
            Nossos princípios
          </h2>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {VALORES.map((valor) => (
            <article
              key={valor.titulo}
              className="group relative overflow-hidden rounded-2xl border border-borda bg-breu/70 p-6
                         transition-colors hover:border-borda-forte"
            >
              <span
                aria-hidden="true"
                className="absolute -right-8 -top-8 size-28 rounded-full bg-purpura-500/10 blur-2xl
                           transition-colors duration-300 group-hover:bg-turquesa-500/12"
              />

              <span className="relative grid size-11 place-items-center rounded-xl border border-borda bg-grafite text-turquesa-400">
                <Icone nome={valor.icone} tamanho={20} />
              </span>

              <h3 className="relative mt-4 text-base font-semibold text-claro">{valor.titulo}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-neutro">{valor.texto}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ------------------------------ Autoria ---------------------------- */}
      <section className="pt-20">
        <div className="painel-vidro relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12">
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 100% at 50% 0%, rgba(139,70,240,0.16), transparent 70%)',
            }}
          />

          <div className="relative mx-auto max-w-2xl">
            <Selo tom="roxo" className="mb-6">
              <Icone nome="alvo" tamanho={12} />
              Projeto acadêmico
            </Selo>

            {/* O nome fica em linha própria: o degradê é recortado por linha,
                e quebrá-lo no meio deixaria as duas metades descasadas. */}
            <p className="text-base leading-relaxed text-neutro sm:text-lg">{AUTORIA.chamada}</p>
            <p className="texto-degrade mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              {AUTORIA.autor}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------- Perguntas ---------------------------- */}
      <section id="perguntas" className="scroll-mt-28 pt-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <header>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-turquesa-400">
              Tira-dúvidas
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-claro sm:text-3xl">
              Perguntas frequentes
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutro">
              Não achou o que procurava? Escreva para{' '}
              <a
                href={`mailto:${EMPRESA.email}`}
                className="font-medium text-turquesa-300 underline-offset-4 hover:underline"
              >
                {EMPRESA.email}
              </a>
              .
            </p>
          </header>

          <div className="rounded-2xl border border-borda bg-breu/70 px-5">
            {PERGUNTAS.map((item, indice) => (
              <Pergunta
                key={item.pergunta}
                pergunta={item.pergunta}
                resposta={item.resposta}
                aberta={perguntaAberta === indice}
                aoAlternar={() => setPerguntaAberta(perguntaAberta === indice ? -1 : indice)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------- Chamada final -------------------------- */}
      <section className="pt-20">
        <div className="painel-vidro relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12">
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 100% at 50% 100%, rgba(22,214,193,0.16), transparent 70%)',
            }}
          />

          <div className="relative mx-auto max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight text-claro sm:text-3xl">
              Pronto para montar seu setup?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-neutro">
              São {PRODUTOS.length} produtos no catálogo de demonstração, com filtros de categoria,
              marca, preço e avaliação.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Botao para="/produtos" tamanho="grande">
                Ver catálogo
                <Icone nome="setaDireita" tamanho={17} />
              </Botao>
              <Link
                to="/produtos?promo=1&ordem=desconto"
                className="inline-flex h-13 items-center gap-2 rounded-full px-6 text-base font-semibold
                           text-neutro transition-colors hover:text-claro"
              >
                Ver só as ofertas
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
