import { useState } from 'react';
import { Icone } from '../ui/Icone.jsx';
import { useCarrinho } from '../../hooks/useCarrinho.js';

/**
 * Entrada de cupom com validação imediata.
 *
 * Enquanto houver um cupom aplicado, o campo dá lugar ao código ativo e ao
 * botão de remover.
 */
export function CampoCupom() {
  const { cupom, aplicarCupom, removerCupom } = useCarrinho();
  const [codigo, setCodigo] = useState('');
  const [retorno, setRetorno] = useState(null);

  const enviar = (evento) => {
    evento.preventDefault();
    if (!codigo.trim()) return;

    const resultado = aplicarCupom(codigo);
    setRetorno(resultado);
    if (resultado.ok) setCodigo('');
  };

  if (cupom) {
    return (
      <div className="rounded-xl border border-sucesso/35 bg-sucesso/10 p-3">
        <div className="flex items-center justify-between gap-3">
          <p className="flex min-w-0 items-center gap-2 text-sm">
            <Icone nome="check" tamanho={15} className="shrink-0 text-sucesso" />
            <span className="truncate">
              <strong className="font-bold text-sucesso">{cupom.codigo}</strong>
              <span className="text-neutro"> — {cupom.descricao}</span>
            </span>
          </p>

          <button
            type="button"
            onClick={() => {
              removerCupom();
              setRetorno(null);
            }}
            className="shrink-0 rounded-lg px-2 py-1 text-xs font-semibold text-tenue transition-colors hover:text-erro"
          >
            Remover
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar}>
      <label htmlFor="campo-cupom" className="text-xs font-semibold text-neutro">
        Cupom de desconto
      </label>

      <div className="mt-1.5 flex gap-2">
        <input
          id="campo-cupom"
          type="text"
          value={codigo}
          onChange={(evento) => {
            setCodigo(evento.target.value.toUpperCase());
            setRetorno(null);
          }}
          placeholder="ASCENSAO10"
          autoComplete="off"
          aria-describedby={retorno ? 'retorno-cupom' : undefined}
          className="h-10 min-w-0 flex-1 rounded-lg border border-borda bg-abissal px-3 text-sm
                     uppercase tracking-wide text-claro placeholder:normal-case placeholder:tracking-normal
                     placeholder:text-tenue focus:border-turquesa-500/60 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!codigo.trim()}
          className="h-10 shrink-0 rounded-lg border border-borda-forte px-4 text-sm font-semibold
                     text-claro transition-colors hover:border-turquesa-400 hover:text-turquesa-300
                     disabled:cursor-not-allowed disabled:opacity-40"
        >
          Aplicar
        </button>
      </div>

      {retorno ? (
        <p
          id="retorno-cupom"
          role="status"
          className={`mt-2 text-xs ${retorno.ok ? 'text-sucesso' : 'text-erro'}`}
        >
          {retorno.mensagem}
        </p>
      ) : null}
    </form>
  );
}
