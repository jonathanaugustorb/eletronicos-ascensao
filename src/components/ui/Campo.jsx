import { useId } from 'react';

/**
 * Campo de formulário com rótulo, dica e mensagem de erro.
 *
 * O erro é ligado ao input por `aria-describedby`, então leitores de tela
 * anunciam o motivo junto com o campo.
 *
 * @param {object} props
 * @param {string} props.rotulo
 * @param {string} props.valor
 * @param {(valor: string) => void} props.aoMudar
 * @param {string} [props.erro]
 * @param {string} [props.dica]
 * @param {string} [props.tipo]
 * @param {string} [props.placeholder]
 * @param {string} [props.autoComplete]
 * @param {number} [props.maxLength]
 * @param {string} [props.inputMode]
 * @param {boolean} [props.obrigatorio]
 * @param {string} [props.className] classes do contêiner
 */
export function Campo({
  rotulo,
  valor,
  aoMudar,
  erro,
  dica,
  tipo = 'text',
  placeholder,
  autoComplete,
  maxLength,
  inputMode,
  obrigatorio = true,
  className = '',
}) {
  const id = useId();
  const idErro = `${id}-erro`;
  const idDica = `${id}-dica`;

  const descricao = [erro ? idErro : null, dica ? idDica : null].filter(Boolean).join(' ');

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-xs font-semibold text-neutro">
        {rotulo}
        {!obrigatorio ? <span className="ml-1 font-normal text-tenue">(opcional)</span> : null}
      </label>

      <input
        id={id}
        type={tipo}
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        inputMode={inputMode}
        aria-invalid={erro ? 'true' : undefined}
        aria-describedby={descricao || undefined}
        className={`mt-1.5 h-11 w-full rounded-xl border bg-abissal px-3.5 text-sm text-claro
                    placeholder:text-tenue transition-colors focus:outline-none ${
                      erro
                        ? 'border-erro/60 focus:border-erro'
                        : 'border-borda hover:border-borda-forte focus:border-turquesa-500/60'
                    }`}
      />

      {erro ? (
        <p id={idErro} className="mt-1.5 text-xs text-erro">
          {erro}
        </p>
      ) : dica ? (
        <p id={idDica} className="mt-1.5 text-xs text-tenue">
          {dica}
        </p>
      ) : null}
    </div>
  );
}
