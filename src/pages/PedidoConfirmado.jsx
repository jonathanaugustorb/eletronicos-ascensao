import { Navigate, useLocation } from 'react-router-dom';
import { Botao } from '../components/ui/Botao.jsx';
import { Icone } from '../components/ui/Icone.jsx';
import { Selo } from '../components/ui/Selo.jsx';
import { formatarMoeda } from '../utils/formato.js';

const FORMATADOR_DATA = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeStyle: 'short',
});

/** Linha de "rótulo: valor" usada nos blocos de dados do pedido. */
function Dado({ rotulo, children }) {
  return (
    <div>
      <dt className="text-[11px] font-bold uppercase tracking-widest text-tenue">{rotulo}</dt>
      <dd className="mt-1 text-sm text-claro">{children}</dd>
    </div>
  );
}

export function PedidoConfirmado() {
  const { state } = useLocation();
  const pedido = state?.pedido;

  // A página só existe logo após um fechamento de pedido.
  if (!pedido) return <Navigate to="/" replace />;

  const { endereco } = pedido;

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="animate-surgir text-center">
        <span className="relative mx-auto mb-6 grid size-20 place-items-center">
          <span
            aria-hidden="true"
            className="animate-pulsar-lento absolute inset-0 rounded-full bg-sucesso/20 blur-xl"
          />
          <span className="relative grid size-20 place-items-center rounded-full border border-sucesso/40 bg-sucesso/10 text-sucesso">
            <Icone nome="check" tamanho={34} espessura={2.2} />
          </span>
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-claro sm:text-4xl">
          Pedido confirmado!
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-neutro">
          Obrigado, {pedido.cliente.nome.split(' ')[0]}. Enviamos os detalhes para{' '}
          <strong className="font-semibold text-claro">{pedido.cliente.email}</strong>.
        </p>

        <p className="numerico mt-6 inline-flex items-center gap-2 rounded-full border border-borda bg-breu px-5 py-2.5">
          <span className="text-xs text-tenue">Código do pedido</span>
          <strong className="text-base font-bold tracking-wider text-turquesa-300">
            {pedido.codigo}
          </strong>
        </p>
      </div>

      <section className="painel-vidro mt-10 rounded-2xl p-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Dado rotulo="Data do pedido">{FORMATADOR_DATA.format(new Date(pedido.data))}</Dado>

          <Dado rotulo="Pagamento">
            {pedido.pagamento?.nome}
            {pedido.parcelas > 1 ? (
              <span className="numerico text-neutro"> em {pedido.parcelas}x</span>
            ) : null}
          </Dado>

          <Dado rotulo="Entrega">
            {pedido.entrega?.nome}
            <span className="block text-xs text-tenue">{pedido.entrega?.prazo}</span>
          </Dado>

          <Dado rotulo="Endereço">
            {endereco.rua}, {endereco.numero}
            {endereco.complemento ? ` — ${endereco.complemento}` : ''}
            <span className="block text-xs text-tenue">
              {endereco.bairro} &middot; {endereco.cidade}/{endereco.uf} &middot; {endereco.cep}
            </span>
          </Dado>
        </div>

        <div className="mt-7 border-t border-borda pt-5">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-neutro">
            Itens do pedido
          </h2>
          <ul className="space-y-2">
            {pedido.itens.map((item) => (
              <li key={item.nome} className="flex justify-between gap-4 text-sm">
                <span className="min-w-0 text-claro">
                  <span className="numerico text-tenue">{item.quantidade}x </span>
                  {item.nome}
                </span>
                <span className="numerico shrink-0 text-neutro">
                  {formatarMoeda(item.subtotal)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 space-y-1.5 border-t border-borda pt-5">
          <div className="flex justify-between text-sm">
            <span className="text-neutro">Subtotal</span>
            <span className="numerico text-claro">{formatarMoeda(pedido.resumo.subtotal)}</span>
          </div>

          {pedido.resumo.descontoCupom > 0 ? (
            <div className="flex justify-between text-sm">
              <span className="text-neutro">Cupom</span>
              <span className="numerico text-sucesso">
                - {formatarMoeda(pedido.resumo.descontoCupom)}
              </span>
            </div>
          ) : null}

          {pedido.resumo.descontoPagamento > 0 ? (
            <div className="flex justify-between text-sm">
              <span className="text-neutro">Desconto {pedido.pagamento?.nome}</span>
              <span className="numerico text-sucesso">
                - {formatarMoeda(pedido.resumo.descontoPagamento)}
              </span>
            </div>
          ) : null}

          <div className="flex justify-between text-sm">
            <span className="text-neutro">Frete</span>
            <span className={`numerico ${pedido.resumo.freteGratuito ? 'text-sucesso' : 'text-claro'}`}>
              {pedido.resumo.freteGratuito ? 'Grátis' : formatarMoeda(pedido.resumo.frete)}
            </span>
          </div>

          <div className="flex items-baseline justify-between border-t border-borda pt-3 text-base">
            <span className="font-semibold text-claro">Total pago</span>
            <span className="numerico text-xl font-bold text-turquesa-300">
              {formatarMoeda(pedido.resumo.total)}
            </span>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-col items-center gap-4">
        <Selo tom="alerta">
          <Icone nome="alvo" tamanho={12} />
          Projeto acadêmico — pedido simulado
        </Selo>

        <p className="max-w-md text-center text-xs leading-relaxed text-tenue">
          Nenhuma cobrança foi feita e nenhum dado saiu do seu navegador. Ao recarregar esta
          página, o comprovante deixa de ser exibido.
        </p>

        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <Botao para="/produtos" tamanho="grande">
            Continuar comprando
            <Icone nome="setaDireita" tamanho={17} />
          </Botao>
          <Botao para="/" variacao="contorno" tamanho="grande">
            Voltar ao início
          </Botao>
        </div>
      </div>
    </div>
  );
}
