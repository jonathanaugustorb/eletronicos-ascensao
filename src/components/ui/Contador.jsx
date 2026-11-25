import { Icone } from './Icone.jsx';

/**
 * Seletor de quantidade com botões de menos e mais.
 *
 * @param {object} props
 * @param {number} props.valor
 * @param {(novoValor: number) => void} props.aoMudar
 * @param {number} [props.minimo]
 * @param {number} [props.maximo]
 * @param {string} props.rotulo descrição do item, lida por leitores de tela
 * @param {'pequeno'|'medio'} [props.tamanho]
 */
export function Contador({
  valor,
  aoMudar,
  minimo = 1,
  maximo = 99,
  rotulo,
  tamanho = 'medio',
}) {
  const alturas = tamanho === 'pequeno' ? 'h-9' : 'h-11';
  const larguraBotao = tamanho === 'pequeno' ? 'w-9' : 'w-11';

  const botao =
    `${alturas} ${larguraBotao} grid place-items-center text-neutro transition-colors ` +
    'hover:bg-fumaca hover:text-turquesa-300 disabled:opacity-35 disabled:hover:bg-transparent ' +
    'disabled:hover:text-neutro';

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded-full border border-borda bg-breu ${alturas}`}
    >
      <button
        type="button"
        className={botao}
        onClick={() => aoMudar(valor - 1)}
        disabled={valor <= minimo}
        aria-label={`Diminuir quantidade de ${rotulo}`}
      >
        <Icone nome="menos" tamanho={16} />
      </button>

      <input
        type="number"
        className="numerico w-11 border-0 bg-transparent text-center text-sm font-semibold text-claro focus:outline-none"
        value={valor}
        min={minimo}
        max={maximo}
        onChange={(evento) => {
          const novo = Number(evento.target.value);
          if (Number.isFinite(novo)) aoMudar(Math.max(minimo, Math.min(novo, maximo)));
        }}
        aria-label={`Quantidade de ${rotulo}`}
      />

      <button
        type="button"
        className={botao}
        onClick={() => aoMudar(valor + 1)}
        disabled={valor >= maximo}
        aria-label={`Aumentar quantidade de ${rotulo}`}
      >
        <Icone nome="mais" tamanho={16} />
      </button>
    </div>
  );
}
