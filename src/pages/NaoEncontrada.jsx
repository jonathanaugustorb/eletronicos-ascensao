import { Botao } from '../components/ui/Botao.jsx';
import { Icone } from '../components/ui/Icone.jsx';

export function NaoEncontrada() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="texto-degrade font-display text-7xl font-bold tracking-tight">404</p>

      <h1 className="mt-4 text-2xl font-bold tracking-tight text-claro sm:text-3xl">
        Esta página não existe
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-neutro">
        O endereço que você abriu pode ter mudado de lugar ou nunca ter existido. Use a busca ou
        volte ao catálogo para continuar.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Botao para="/" tamanho="grande">
          Voltar ao início
        </Botao>
        <Botao para="/produtos" variacao="contorno" tamanho="grande">
          <Icone nome="busca" tamanho={17} />
          Ver produtos
        </Botao>
      </div>
    </div>
  );
}
