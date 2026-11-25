import { useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Botao } from '../components/ui/Botao.jsx';
import { Campo } from '../components/ui/Campo.jsx';
import { Icone } from '../components/ui/Icone.jsx';
import { Selo } from '../components/ui/Selo.jsx';
import { LinhaCarrinho } from '../components/carrinho/LinhaCarrinho.jsx';
import { ResumoPedido } from '../components/carrinho/ResumoPedido.jsx';
import { useCarrinho } from '../hooks/useCarrinho.js';
import { ETAPAS, useFormularioPedido } from '../hooks/useFormularioPedido.js';
import {
  FORMAS_PAGAMENTO,
  OPCOES_ENTREGA,
  PARCELAS_DISPONIVEIS,
  calcularFrete,
  calcularResumo,
  gerarCodigoPedido,
} from '../utils/pedido.js';
import { formatarMoeda, valorParcela } from '../utils/formato.js';

/** Indicador das quatro etapas, com o progresso preenchido. */
function Trilha({ indiceAtual, aoVoltarPara }) {
  return (
    <ol className="mb-8 grid grid-cols-4 gap-2">
      {ETAPAS.map((etapa, indice) => {
        const concluida = indice < indiceAtual;
        const atual = indice === indiceAtual;

        return (
          <li key={etapa.id}>
            <button
              type="button"
              onClick={() => concluida && aoVoltarPara(indice)}
              disabled={!concluida}
              className={`flex w-full flex-col gap-2 text-left ${concluida ? 'cursor-pointer' : 'cursor-default'}`}
              aria-current={atual ? 'step' : undefined}
            >
              <span
                className={`h-1 rounded-full transition-colors duration-300 ${
                  concluida
                    ? 'bg-sucesso'
                    : atual
                      ? 'bg-linear-to-r from-turquesa-400 to-purpura-400'
                      : 'bg-fumaca'
                }`}
              />
              <span className="flex items-center gap-1.5">
                <Icone
                  nome={concluida ? 'check' : etapa.icone}
                  tamanho={14}
                  className={
                    concluida ? 'text-sucesso' : atual ? 'text-turquesa-300' : 'text-tenue'
                  }
                />
                <span
                  className={`truncate text-xs font-semibold ${
                    atual ? 'text-claro' : concluida ? 'text-neutro' : 'text-tenue'
                  }`}
                >
                  {etapa.nome}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/** Cartão selecionável usado nas opções de entrega e de pagamento. */
function OpcaoSelecionavel({ selecionada, aoSelecionar, titulo, descricao, valor, children }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
        selecionada
          ? 'border-turquesa-500/60 bg-turquesa-500/8'
          : 'border-borda bg-abissal/50 hover:border-borda-forte'
      }`}
    >
      <input
        type="radio"
        checked={selecionada}
        onChange={aoSelecionar}
        className="peer sr-only"
        name={titulo}
      />
      <span
        aria-hidden="true"
        className={`mt-0.5 grid size-4.5 shrink-0 place-items-center rounded-full border transition-colors ${
          selecionada ? 'border-turquesa-400' : 'border-borda-forte'
        }`}
      >
        <span
          className={`size-2.5 rounded-full bg-turquesa-400 transition-transform ${
            selecionada ? 'scale-100' : 'scale-0'
          }`}
        />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center justify-between gap-2">
          <span className={`text-sm font-semibold ${selecionada ? 'text-claro' : 'text-neutro'}`}>
            {titulo}
          </span>
          {valor ? <span className="numerico text-sm font-bold text-claro">{valor}</span> : null}
        </span>
        <span className="mt-0.5 block text-xs text-tenue">{descricao}</span>
        {children}
      </span>
    </label>
  );
}

/** Bloco de rótulo e valor usado na etapa de revisão. */
function Revisao({ titulo, children, aoEditar }) {
  return (
    <div className="rounded-xl border border-borda bg-abissal/50 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className="text-xs font-bold uppercase tracking-widest text-neutro">{titulo}</h3>
        <button
          type="button"
          onClick={aoEditar}
          className="text-xs font-semibold text-turquesa-300 underline-offset-4 hover:underline"
        >
          editar
        </button>
      </div>
      <div className="space-y-0.5 text-sm text-claro">{children}</div>
    </div>
  );
}

export function FinalizarPedido() {
  const { itens, vazio, cupom, quantidadeTotal, limpar } = useCarrinho();
  const { valores, definir, erroVisivel, etapaValida, revelarErros } = useFormularioPedido();
  const [indice, setIndice] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const navegar = useNavigate();

  const etapa = ETAPAS[indice];
  const ultima = indice === ETAPAS.length - 1;

  const resumo = useMemo(
    () =>
      calcularResumo({
        itens,
        cupom,
        entrega: valores.entrega,
        pagamento: valores.pagamento,
      }),
    [itens, cupom, valores.entrega, valores.pagamento],
  );

  const formaPagamento = FORMAS_PAGAMENTO.find((forma) => forma.id === valores.pagamento);
  const opcaoEntrega = OPCOES_ENTREGA.find((opcao) => opcao.id === valores.entrega);

  // Sem itens não há pedido a fechar.
  if (vazio && !enviando) return <Navigate to="/carrinho" replace />;

  const avancar = () => {
    if (!etapaValida(etapa.id)) {
      revelarErros(etapa.id);
      return;
    }
    setIndice((atual) => Math.min(atual + 1, ETAPAS.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const voltar = () => {
    setIndice((atual) => Math.max(atual - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmar = () => {
    setEnviando(true);

    const pedido = {
      codigo: gerarCodigoPedido(),
      data: new Date().toISOString(),
      cliente: { nome: valores.nome, email: valores.email },
      endereco: {
        rua: valores.rua,
        numero: valores.numero,
        complemento: valores.complemento,
        bairro: valores.bairro,
        cidade: valores.cidade,
        uf: valores.uf,
        cep: valores.cep,
      },
      entrega: opcaoEntrega,
      pagamento: formaPagamento,
      parcelas: valores.pagamento === 'cartao' ? valores.parcelas : 1,
      itens: itens.map((item) => ({
        nome: item.produto.nome,
        quantidade: item.quantidade,
        subtotal: item.subtotal,
      })),
      resumo,
    };

    // Simula o tempo de resposta de um gateway de pagamento.
    setTimeout(() => {
      limpar();
      navegar('/pedido-confirmado', { replace: true, state: { pedido } });
    }, 900);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <nav aria-label="Trilha de navegação" className="mb-3 text-xs text-tenue">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link to="/carrinho" className="transition-colors hover:text-neutro">
                Carrinho
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-neutro">Finalizar pedido</li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-claro sm:text-4xl">
          Finalizar pedido
        </h1>
        <p className="mt-2 text-sm text-neutro">
          Etapa {indice + 1} de {ETAPAS.length} &middot; {etapa.nome}
        </p>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
        <section className="rounded-2xl border border-borda bg-breu/70 p-5 sm:p-7">
          <Trilha indiceAtual={indice} aoVoltarPara={setIndice} />

          {/* -------------------------- Identificação -------------------------- */}
          {etapa.id === 'identificacao' ? (
            <div className="animate-surgir grid gap-4 sm:grid-cols-2">
              <Campo
                className="sm:col-span-2"
                rotulo="Nome completo"
                valor={valores.nome}
                aoMudar={(valor) => definir('nome', valor)}
                erro={erroVisivel('nome')}
                placeholder="Maria Silva Souza"
                autoComplete="name"
              />
              <Campo
                rotulo="E-mail"
                tipo="email"
                valor={valores.email}
                aoMudar={(valor) => definir('email', valor)}
                erro={erroVisivel('email')}
                placeholder="maria@email.com"
                autoComplete="email"
                dica="Enviaremos a confirmação para este endereço."
              />
              <Campo
                rotulo="Telefone"
                valor={valores.telefone}
                aoMudar={(valor) => definir('telefone', valor)}
                erro={erroVisivel('telefone')}
                placeholder="(31) 90000-0000"
                autoComplete="tel"
                inputMode="numeric"
              />
              <Campo
                rotulo="CPF"
                valor={valores.cpf}
                aoMudar={(valor) => definir('cpf', valor)}
                erro={erroVisivel('cpf')}
                placeholder="000.000.000-00"
                inputMode="numeric"
                dica="Usado apenas para emitir a nota fiscal."
              />
            </div>
          ) : null}

          {/* ----------------------------- Entrega ----------------------------- */}
          {etapa.id === 'entrega' ? (
            <div className="animate-surgir space-y-6">
              <div className="grid gap-4 sm:grid-cols-6">
                <Campo
                  className="sm:col-span-2"
                  rotulo="CEP"
                  valor={valores.cep}
                  aoMudar={(valor) => definir('cep', valor)}
                  erro={erroVisivel('cep')}
                  placeholder="30000-000"
                  autoComplete="postal-code"
                  inputMode="numeric"
                />
                <Campo
                  className="sm:col-span-4"
                  rotulo="Rua / Avenida"
                  valor={valores.rua}
                  aoMudar={(valor) => definir('rua', valor)}
                  erro={erroVisivel('rua')}
                  placeholder="Av. Afonso Pena"
                  autoComplete="address-line1"
                />
                <Campo
                  className="sm:col-span-2"
                  rotulo="Número"
                  valor={valores.numero}
                  aoMudar={(valor) => definir('numero', valor)}
                  erro={erroVisivel('numero')}
                  placeholder="1200"
                  inputMode="numeric"
                />
                <Campo
                  className="sm:col-span-4"
                  rotulo="Complemento"
                  valor={valores.complemento}
                  aoMudar={(valor) => definir('complemento', valor)}
                  placeholder="Apto 302, bloco B"
                  obrigatorio={false}
                />
                <Campo
                  className="sm:col-span-2"
                  rotulo="Bairro"
                  valor={valores.bairro}
                  aoMudar={(valor) => definir('bairro', valor)}
                  erro={erroVisivel('bairro')}
                  placeholder="Centro"
                />
                <Campo
                  className="sm:col-span-3"
                  rotulo="Cidade"
                  valor={valores.cidade}
                  aoMudar={(valor) => definir('cidade', valor)}
                  erro={erroVisivel('cidade')}
                  placeholder="Belo Horizonte"
                />
                <Campo
                  className="sm:col-span-1"
                  rotulo="UF"
                  valor={valores.uf}
                  aoMudar={(valor) => definir('uf', valor)}
                  erro={erroVisivel('uf')}
                  placeholder="MG"
                  maxLength={2}
                />
              </div>

              <fieldset>
                <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-neutro">
                  Forma de entrega
                </legend>
                <div className="space-y-2.5">
                  {OPCOES_ENTREGA.map((opcao) => {
                    const valorFrete = calcularFrete(opcao, resumo.subtotal, cupom);
                    return (
                      <OpcaoSelecionavel
                        key={opcao.id}
                        selecionada={valores.entrega === opcao.id}
                        aoSelecionar={() => definir('entrega', opcao.id)}
                        titulo={opcao.nome}
                        descricao={opcao.prazo}
                        valor={valorFrete === 0 ? 'Grátis' : formatarMoeda(valorFrete)}
                      />
                    );
                  })}
                </div>
              </fieldset>
            </div>
          ) : null}

          {/* ---------------------------- Pagamento ---------------------------- */}
          {etapa.id === 'pagamento' ? (
            <div className="animate-surgir space-y-6">
              <fieldset>
                <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-neutro">
                  Forma de pagamento
                </legend>
                <div className="space-y-2.5">
                  {FORMAS_PAGAMENTO.map((forma) => (
                    <OpcaoSelecionavel
                      key={forma.id}
                      selecionada={valores.pagamento === forma.id}
                      aoSelecionar={() => definir('pagamento', forma.id)}
                      titulo={forma.nome}
                      descricao={forma.detalhe}
                      valor={forma.desconto > 0 ? `-${forma.desconto * 100}%` : null}
                    />
                  ))}
                </div>
              </fieldset>

              {valores.pagamento === 'cartao' ? (
                <div className="animate-surgir space-y-4 rounded-xl border border-borda bg-abissal/50 p-4">
                  <p className="flex items-center gap-2 text-xs text-tenue">
                    <Icone nome="cadeado" tamanho={13} className="text-turquesa-400" />
                    Formulário simulado: use qualquer número de 16 dígitos.
                  </p>

                  <div className="grid gap-4 sm:grid-cols-6">
                    <Campo
                      className="sm:col-span-6"
                      rotulo="Número do cartão"
                      valor={valores.cartaoNumero}
                      aoMudar={(valor) => definir('cartaoNumero', valor)}
                      erro={erroVisivel('cartaoNumero')}
                      placeholder="0000 0000 0000 0000"
                      inputMode="numeric"
                    />
                    <Campo
                      className="sm:col-span-6"
                      rotulo="Nome impresso no cartão"
                      valor={valores.cartaoNome}
                      aoMudar={(valor) => definir('cartaoNome', valor.toUpperCase())}
                      erro={erroVisivel('cartaoNome')}
                      placeholder="MARIA S SOUZA"
                    />
                    <Campo
                      className="sm:col-span-3"
                      rotulo="Validade"
                      valor={valores.cartaoValidade}
                      aoMudar={(valor) => definir('cartaoValidade', valor)}
                      erro={erroVisivel('cartaoValidade')}
                      placeholder="MM/AA"
                      inputMode="numeric"
                    />
                    <Campo
                      className="sm:col-span-3"
                      rotulo="Código de segurança"
                      valor={valores.cartaoCvv}
                      aoMudar={(valor) => definir('cartaoCvv', valor)}
                      erro={erroVisivel('cartaoCvv')}
                      placeholder="000"
                      inputMode="numeric"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="parcelas"
                      className="block text-xs font-semibold text-neutro"
                    >
                      Parcelamento
                    </label>
                    <select
                      id="parcelas"
                      value={valores.parcelas}
                      onChange={(evento) => definir('parcelas', Number(evento.target.value))}
                      className="mt-1.5 h-11 w-full cursor-pointer rounded-xl border border-borda bg-abissal
                                 px-3.5 text-sm text-claro focus:border-turquesa-500/60 focus:outline-none"
                    >
                      {PARCELAS_DISPONIVEIS.map((numero) => (
                        <option key={numero} value={numero} className="bg-grafite">
                          {numero}x de {formatarMoeda(valorParcela(resumo.total, numero))}
                          {numero === 1 ? ' à vista' : ' sem juros'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}

              {valores.pagamento === 'pix' ? (
                <div className="animate-surgir flex items-start gap-3 rounded-xl border border-turquesa-500/30 bg-turquesa-500/8 p-4">
                  <Icone nome="relampago" tamanho={18} className="mt-0.5 shrink-0 text-turquesa-300" />
                  <p className="text-sm text-neutro">
                    O código Pix aparece na confirmação do pedido e vale por 30 minutos. O desconto
                    de 10% já está aplicado no resumo.
                  </p>
                </div>
              ) : null}

              {valores.pagamento === 'boleto' ? (
                <div className="animate-surgir flex items-start gap-3 rounded-xl border border-borda bg-abissal/50 p-4">
                  <Icone nome="caixa" tamanho={18} className="mt-0.5 shrink-0 text-purpura-300" />
                  <p className="text-sm text-neutro">
                    O boleto é gerado após a confirmação e vence em 3 dias úteis. O pedido só é
                    separado depois da compensação.
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* ----------------------------- Revisão ----------------------------- */}
          {etapa.id === 'revisao' ? (
            <div className="animate-surgir space-y-4">
              <Revisao titulo="Identificação" aoEditar={() => setIndice(0)}>
                <p>{valores.nome}</p>
                <p className="text-neutro">{valores.email}</p>
                <p className="numerico text-neutro">
                  {valores.telefone} &middot; CPF {valores.cpf}
                </p>
              </Revisao>

              <Revisao titulo="Entrega" aoEditar={() => setIndice(1)}>
                <p>
                  {valores.rua}, {valores.numero}
                  {valores.complemento ? ` — ${valores.complemento}` : ''}
                </p>
                <p className="text-neutro">
                  {valores.bairro} &middot; {valores.cidade}/{valores.uf} &middot; CEP {valores.cep}
                </p>
                <p className="mt-1.5 flex flex-wrap items-center gap-2">
                  <Selo tom="turquesa">{opcaoEntrega?.nome}</Selo>
                  <span className="text-xs text-tenue">{opcaoEntrega?.prazo}</span>
                </p>
              </Revisao>

              <Revisao titulo="Pagamento" aoEditar={() => setIndice(2)}>
                <p>{formaPagamento?.nome}</p>
                {valores.pagamento === 'cartao' ? (
                  <p className="numerico text-neutro">
                    Final {valores.cartaoNumero.slice(-4)} &middot; {valores.parcelas}x de{' '}
                    {formatarMoeda(valorParcela(resumo.total, valores.parcelas))}
                  </p>
                ) : (
                  <p className="text-neutro">{formaPagamento?.detalhe}</p>
                )}
              </Revisao>

              <div className="rounded-xl border border-borda bg-abissal/50 p-4">
                <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-neutro">
                  {quantidadeTotal} {quantidadeTotal === 1 ? 'item' : 'itens'}
                </h3>
                <ul className="divide-y divide-[var(--color-borda)]">
                  {itens.map((item) => (
                    <li key={item.produto.id}>
                      <LinhaCarrinho item={item} somenteLeitura />
                    </li>
                  ))}
                </ul>
              </div>

              <p className="flex items-start gap-2 text-xs leading-relaxed text-tenue">
                <Icone nome="escudo" tamanho={14} className="mt-0.5 shrink-0 text-turquesa-400" />
                Ao confirmar você aceita os termos da loja. Este é um projeto acadêmico: nenhuma
                cobrança é feita e nenhum dado é enviado para fora do navegador.
              </p>
            </div>
          ) : null}

          {/* ----------------------------- Navegação ---------------------------- */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-borda pt-6">
            {indice > 0 ? (
              <Botao variacao="fantasma" onClick={voltar}>
                <Icone nome="setaEsquerda" tamanho={16} />
                Voltar
              </Botao>
            ) : (
              <Botao variacao="fantasma" para="/carrinho">
                <Icone nome="setaEsquerda" tamanho={16} />
                Voltar ao carrinho
              </Botao>
            )}

            {ultima ? (
              <Botao onClick={confirmar} disabled={enviando} tamanho="grande">
                {enviando ? (
                  'Processando...'
                ) : (
                  <>
                    <Icone nome="check" tamanho={17} />
                    Confirmar pedido de {formatarMoeda(resumo.total)}
                  </>
                )}
              </Botao>
            ) : (
              <Botao onClick={avancar} tamanho="grande">
                Continuar
                <Icone nome="setaDireita" tamanho={17} />
              </Botao>
            )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-24">
          <ResumoPedido
            resumo={resumo}
            quantidadeTotal={quantidadeTotal}
            nomeFormaPagamento={formaPagamento?.nome}
            parcelas={valores.pagamento === 'cartao' ? valores.parcelas : 12}
          >
            <ul className="space-y-2 border-t border-borda pt-4">
              {itens.slice(0, 4).map((item) => (
                <li key={item.produto.id} className="flex justify-between gap-3 text-xs">
                  <span className="min-w-0 truncate text-neutro">
                    {item.quantidade}x {item.produto.nome}
                  </span>
                  <span className="numerico shrink-0 text-tenue">
                    {formatarMoeda(item.subtotal)}
                  </span>
                </li>
              ))}
              {itens.length > 4 ? (
                <li className="numerico text-xs text-tenue">
                  e mais {itens.length - 4} {itens.length - 4 === 1 ? 'produto' : 'produtos'}
                </li>
              ) : null}
            </ul>
          </ResumoPedido>
        </aside>
      </div>
    </div>
  );
}
