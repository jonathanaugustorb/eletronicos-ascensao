import { useEffect, useState } from 'react';
import { Icone } from '../ui/Icone.jsx';
import { Estrelas } from '../ui/Estrelas.jsx';
import { CATEGORIAS, FAIXA_PRECO, MARCAS } from '../../data/produtos.js';
import { formatarMoeda } from '../../utils/formato.js';

/** Atalhos de faixa de preço oferecidos acima do controle deslizante. */
const FAIXAS_RAPIDAS = [
  { rotulo: 'Até R$ 500', min: FAIXA_PRECO.minimo, max: 500 },
  { rotulo: 'R$ 500 a R$ 2 mil', min: 500, max: 2000 },
  { rotulo: 'R$ 2 mil a R$ 6 mil', min: 2000, max: 6000 },
  { rotulo: 'Acima de R$ 6 mil', min: 6000, max: FAIXA_PRECO.maximo },
];

const NOTAS = [4.5, 4, 3.5];

/** Seção recolhível do painel. */
function Secao({ titulo, children, aberturaInicial = true }) {
  const [aberta, setAberta] = useState(aberturaInicial);

  return (
    <section className="border-b border-borda py-4 first:pt-0 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={() => setAberta((valor) => !valor)}
        aria-expanded={aberta}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutro">{titulo}</h3>
        <Icone
          nome="setaBaixo"
          tamanho={16}
          className={`shrink-0 text-tenue transition-transform duration-200 ${aberta ? '' : '-rotate-90'}`}
        />
      </button>

      {aberta ? <div className="mt-3.5">{children}</div> : null}
    </section>
  );
}

/** Caixa de seleção com contagem de resultados à direita. */
function Opcao({ marcada, aoAlternar, rotulo, contagem }) {
  const indisponivel = contagem === 0 && !marcada;

  return (
    <li>
      <label
        className={`flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors ${
          indisponivel ? 'cursor-not-allowed opacity-40' : 'hover:bg-fumaca/70'
        }`}
      >
        <input
          type="checkbox"
          checked={marcada}
          disabled={indisponivel}
          onChange={aoAlternar}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className="grid size-4 shrink-0 place-items-center rounded border border-borda-forte bg-breu
                     text-abissal transition-colors peer-checked:border-turquesa-400
                     peer-checked:bg-turquesa-400 peer-focus-visible:outline peer-focus-visible:outline-2
                     peer-focus-visible:outline-offset-2 peer-focus-visible:outline-turquesa-400"
        >
          <Icone nome="check" tamanho={11} espessura={3.5} className={marcada ? '' : 'invisible'} />
        </span>
        <span className={`flex-1 ${marcada ? 'font-semibold text-claro' : 'text-neutro'}`}>
          {rotulo}
        </span>
        <span className="numerico text-xs text-tenue">{contagem}</span>
      </label>
    </li>
  );
}

/** Interruptor usado nos filtros de sim/não. */
function Interruptor({ ligado, aoAlternar, rotulo, descricao }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-fumaca/70">
      <button
        type="button"
        role="switch"
        aria-checked={ligado}
        onClick={aoAlternar}
        className={`mt-0.5 h-5 w-9 shrink-0 rounded-full border transition-colors ${
          ligado ? 'border-turquesa-400 bg-turquesa-500/80' : 'border-borda-forte bg-breu'
        }`}
      >
        <span
          className={`block size-3.5 rounded-full bg-claro transition-transform duration-200 ${
            ligado ? 'translate-x-4.5' : 'translate-x-0.5'
          }`}
        />
      </button>
      <span className="flex-1">
        <span className={`block text-sm ${ligado ? 'font-semibold text-claro' : 'text-neutro'}`}>
          {rotulo}
        </span>
        <span className="block text-xs text-tenue">{descricao}</span>
      </span>
    </label>
  );
}

/**
 * Painel com todos os filtros do catálogo.
 *
 * @param {object} props
 * @param {ReturnType<typeof import('../../hooks/useFiltrosProdutos.js').useFiltrosProdutos>} props.controle
 */
export function PainelFiltros({ controle }) {
  const { filtros, contagens, definirFiltros, alternarItem, limparFiltros } = controle;

  // Espelho local do máximo para o slider responder enquanto é arrastado.
  const [precoMaxLocal, setPrecoMaxLocal] = useState(filtros.precoMax);
  useEffect(() => setPrecoMaxLocal(filtros.precoMax), [filtros.precoMax]);

  const faixaAtiva = (faixa) => filtros.precoMin === faixa.min && filtros.precoMax === faixa.max;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-borda pb-3">
        <span className="flex items-center gap-2 text-sm font-bold text-claro">
          <Icone nome="filtro" tamanho={16} className="text-turquesa-400" />
          Filtros
        </span>
        <button
          type="button"
          onClick={limparFiltros}
          className="rounded-full px-2 py-1 text-xs font-semibold text-tenue transition-colors hover:bg-fumaca hover:text-erro"
        >
          Limpar tudo
        </button>
      </div>

      <div className="pt-4">
        <Secao titulo="Categoria">
          <ul className="space-y-0.5">
            {CATEGORIAS.map((categoria) => (
              <Opcao
                key={categoria.id}
                rotulo={categoria.nome}
                marcada={filtros.categorias.includes(categoria.id)}
                contagem={contagens.porCategoria[categoria.id] ?? 0}
                aoAlternar={() => alternarItem('categorias', categoria.id)}
              />
            ))}
          </ul>
        </Secao>

        <Secao titulo="Preço">
          <div className="grid grid-cols-2 gap-2">
            {FAIXAS_RAPIDAS.map((faixa) => (
              <button
                key={faixa.rotulo}
                type="button"
                onClick={() =>
                  definirFiltros(
                    faixaAtiva(faixa)
                      ? { precoMin: FAIXA_PRECO.minimo, precoMax: FAIXA_PRECO.maximo }
                      : { precoMin: faixa.min, precoMax: faixa.max },
                  )
                }
                className={`rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-colors ${
                  faixaAtiva(faixa)
                    ? 'border-turquesa-500/60 bg-turquesa-500/12 text-turquesa-300'
                    : 'border-borda bg-breu text-neutro hover:border-borda-forte hover:text-claro'
                }`}
              >
                {faixa.rotulo}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label
              htmlFor="filtro-preco-maximo"
              className="numerico flex items-baseline justify-between text-xs text-tenue"
            >
              <span>{formatarMoeda(filtros.precoMin)}</span>
              <span className="font-bold text-claro">até {formatarMoeda(precoMaxLocal)}</span>
            </label>
            <input
              id="filtro-preco-maximo"
              type="range"
              min={FAIXA_PRECO.minimo}
              max={FAIXA_PRECO.maximo}
              step={50}
              value={precoMaxLocal}
              onChange={(evento) => setPrecoMaxLocal(Number(evento.target.value))}
              onPointerUp={() => definirFiltros({ precoMax: precoMaxLocal })}
              onKeyUp={() => definirFiltros({ precoMax: precoMaxLocal })}
              className="mt-2 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-fumaca
                         accent-turquesa-400 outline-offset-4"
              style={{
                background: `linear-gradient(to right, var(--color-turquesa-500) 0%, var(--color-purpura-500) ${
                  ((precoMaxLocal - FAIXA_PRECO.minimo) / (FAIXA_PRECO.maximo - FAIXA_PRECO.minimo)) *
                  100
                }%, var(--color-fumaca) ${
                  ((precoMaxLocal - FAIXA_PRECO.minimo) / (FAIXA_PRECO.maximo - FAIXA_PRECO.minimo)) *
                  100
                }%)`,
              }}
            />
          </div>
        </Secao>

        <Secao titulo="Marca">
          <ul className="space-y-0.5">
            {MARCAS.map((marca) => (
              <Opcao
                key={marca}
                rotulo={marca}
                marcada={filtros.marcas.includes(marca)}
                contagem={contagens.porMarca[marca] ?? 0}
                aoAlternar={() => alternarItem('marcas', marca)}
              />
            ))}
          </ul>
        </Secao>

        <Secao titulo="Avaliação">
          <div className="space-y-1.5">
            {NOTAS.map((nota) => {
              const ativa = filtros.notaMinima === nota;
              return (
                <button
                  key={nota}
                  type="button"
                  onClick={() => definirFiltros({ notaMinima: ativa ? 0 : nota })}
                  className={`flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 transition-colors ${
                    ativa
                      ? 'border-turquesa-500/60 bg-turquesa-500/12'
                      : 'border-transparent hover:bg-fumaca/70'
                  }`}
                >
                  <Estrelas nota={nota} mostrarNumero={false} tamanho={13} />
                  <span className={`text-xs ${ativa ? 'font-semibold text-claro' : 'text-neutro'}`}>
                    {nota.toFixed(1).replace('.', ',')} ou mais
                  </span>
                </button>
              );
            })}
          </div>
        </Secao>

        <Secao titulo="Outras opções">
          <div className="space-y-1">
            <Interruptor
              ligado={filtros.somentePromocao}
              aoAlternar={() => definirFiltros({ somentePromocao: !filtros.somentePromocao })}
              rotulo="Somente em promoção"
              descricao="Itens com preço reduzido"
            />
            <Interruptor
              ligado={filtros.somenteEstoque}
              aoAlternar={() => definirFiltros({ somenteEstoque: !filtros.somenteEstoque })}
              rotulo="Somente em estoque"
              descricao="Esconde produtos esgotados"
            />
          </div>
        </Secao>
      </div>
    </div>
  );
}
