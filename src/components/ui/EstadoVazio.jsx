import { Icone } from './Icone.jsx';

/**
 * Bloco exibido quando uma lista não tem nada para mostrar.
 *
 * @param {object} props
 * @param {string} [props.icone] nome de um ícone de Icone.jsx
 * @param {string} props.titulo
 * @param {string} props.texto
 * @param {import('react').ReactNode} [props.children] ações sugeridas
 */
export function EstadoVazio({ icone = 'busca', titulo, texto, children }) {
  return (
    <div className="painel-vidro animate-surgir flex flex-col items-center rounded-3xl px-6 py-16 text-center">
      <span className="relative mb-5 grid size-16 place-items-center rounded-2xl border border-borda bg-breu text-turquesa-400">
        <span
          aria-hidden="true"
          className="animate-pulsar-lento absolute inset-0 rounded-2xl bg-turquesa-500/10 blur-xl"
        />
        <Icone nome={icone} tamanho={26} />
      </span>

      <h3 className="text-xl font-semibold text-claro">{titulo}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-neutro">{texto}</p>

      {children ? <div className="mt-7 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </div>
  );
}
