import { Icone } from '../ui/Icone.jsx';
import { formatarMoeda, valorParcela } from '../../utils/formato.js';
import { FRETE_GRATIS_ACIMA } from '../../utils/pedido.js';

/** Uma linha "rótulo à esquerda, valor à direita". */
function Linha({ rotulo, valor, destaque = false, positivo = false }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <span className={destaque ? 'font-semibold text-claro' : 'text-neutro'}>{rotulo}</span>
      <span
        className={`numerico ${
          destaque ? 'text-lg font-bold text-claro' : positivo ? 'text-sucesso' : 'text-claro'
        }`}
      >
        {valor}
      </span>
    </div>
  );
}

/**
 * Resumo de valores do pedido.
 *
 * @param {object} props
 * @param {import('../../utils/pedido.js').ResumoPedido} props.resumo
 * @param {number} props.quantidadeTotal
 * @param {string} [props.nomeFormaPagamento] exibido na linha de desconto do pagamento
 * @param {number} [props.parcelas]
 * @param {import('react').ReactNode} [props.children] ações abaixo dos valores
 */
export function ResumoPedido({
  resumo,
  quantidadeTotal,
  nomeFormaPagamento,
  parcelas = 12,
  children,
}) {
  const faltaFrete = resumo.faltaParaFreteGratis;
  const progressoFrete = Math.min(100, (resumo.subtotal / FRETE_GRATIS_ACIMA) * 100);

  return (
    <div className="rounded-2xl border border-borda bg-breu/70 p-5">
      <h2 className="text-sm font-bold uppercase tracking-widest text-claro">Resumo</h2>

      <div className="mt-4 space-y-2.5 border-b border-borda pb-4">
        <Linha
          rotulo={`Subtotal (${quantidadeTotal} ${quantidadeTotal === 1 ? 'item' : 'itens'})`}
          valor={formatarMoeda(resumo.subtotal)}
        />

        {resumo.descontoCupom > 0 ? (
          <Linha
            rotulo="Desconto do cupom"
            valor={`- ${formatarMoeda(resumo.descontoCupom)}`}
            positivo
          />
        ) : null}

        {resumo.descontoPagamento > 0 ? (
          <Linha
            rotulo={`Desconto ${nomeFormaPagamento ?? 'do pagamento'}`}
            valor={`- ${formatarMoeda(resumo.descontoPagamento)}`}
            positivo
          />
        ) : null}

        <Linha
          rotulo="Frete"
          valor={resumo.freteGratuito ? 'Grátis' : formatarMoeda(resumo.frete)}
          positivo={resumo.freteGratuito}
        />
      </div>

      <div className="py-4">
        <Linha rotulo="Total" valor={formatarMoeda(resumo.total)} destaque />
        <p className="numerico mt-1 text-xs text-tenue">
          ou {parcelas}x de {formatarMoeda(valorParcela(resumo.total, parcelas))} sem juros
        </p>

        {resumo.economia > 0 ? (
          <p className="numerico mt-2.5 inline-flex items-center gap-1.5 rounded-lg bg-sucesso/10 px-2.5 py-1.5 text-xs font-semibold text-sucesso">
            <Icone nome="etiqueta" tamanho={13} />
            Você economiza {formatarMoeda(resumo.economia)}
          </p>
        ) : null}
      </div>

      {/* Barra de progresso até o frete grátis */}
      {!resumo.freteGratuito && resumo.subtotal > 0 ? (
        <div className="mb-4 rounded-xl border border-borda bg-abissal/60 p-3">
          <p className="numerico text-xs text-neutro">
            Faltam <strong className="font-bold text-turquesa-300">{formatarMoeda(faltaFrete)}</strong>{' '}
            para o frete grátis
          </p>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-fumaca"
            role="progressbar"
            aria-valuenow={Math.round(progressoFrete)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso para o frete grátis"
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-turquesa-400 to-purpura-400 transition-[width] duration-500"
              style={{ width: `${progressoFrete}%` }}
            />
          </div>
        </div>
      ) : null}

      {children}
    </div>
  );
}
