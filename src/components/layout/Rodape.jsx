import { Link } from 'react-router-dom';
import { Logo } from './Logo.jsx';
import { Icone } from '../ui/Icone.jsx';
import { CATEGORIAS } from '../../data/produtos.js';
import { AUTORIA, EMPRESA } from '../../data/empresa.js';

const INSTITUCIONAL = [
  { rotulo: 'Quem somos', para: '/quem-somos' },
  { rotulo: 'Perguntas frequentes', para: '/quem-somos#perguntas' },
  { rotulo: 'Todos os produtos', para: '/produtos' },
  { rotulo: 'Ofertas', para: '/produtos?promo=1&ordem=desconto' },
];

const PAGAMENTOS = ['Pix', 'Boleto', 'Visa', 'Mastercard', 'Elo'];

export function Rodape() {
  return (
    <footer className="relative mt-24 border-t border-borda bg-breu">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-linear-to-r from-transparent via-turquesa-500/50 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-tenue">
              Loja de eletrônicos com curadoria própria, assistência técnica autorizada e entrega
              para todo o Brasil.
            </p>

            <ul className="mt-5 space-y-2 text-sm text-neutro">
              <li className="flex items-center gap-2.5">
                <Icone nome="local" tamanho={15} className="shrink-0 text-turquesa-400" />
                {EMPRESA.cidade}
              </li>
              <li className="flex items-center gap-2.5">
                <Icone nome="email" tamanho={15} className="shrink-0 text-turquesa-400" />
                {EMPRESA.email}
              </li>
              <li className="flex items-center gap-2.5">
                <Icone nome="telefone" tamanho={15} className="shrink-0 text-turquesa-400" />
                {EMPRESA.telefone}
              </li>
            </ul>
          </div>

          <nav aria-labelledby="rodape-categorias">
            <h2
              id="rodape-categorias"
              className="text-xs font-bold uppercase tracking-widest text-claro"
            >
              Categorias
            </h2>
            <ul className="mt-4 space-y-2.5">
              {CATEGORIAS.map((categoria) => (
                <li key={categoria.id}>
                  <Link
                    to={`/produtos?cat=${categoria.id}`}
                    className="text-sm text-neutro transition-colors hover:text-turquesa-300"
                  >
                    {categoria.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="rodape-institucional">
            <h2
              id="rodape-institucional"
              className="text-xs font-bold uppercase tracking-widest text-claro"
            >
              A loja
            </h2>
            <ul className="mt-4 space-y-2.5">
              {INSTITUCIONAL.map((item) => (
                <li key={item.rotulo}>
                  <Link
                    to={item.para}
                    className="text-sm text-neutro transition-colors hover:text-turquesa-300"
                  >
                    {item.rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-claro">
              Compra protegida
            </h2>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-neutro">
                <Icone nome="cadeado" tamanho={15} className="mt-0.5 shrink-0 text-turquesa-400" />
                Ambiente com certificado SSL
              </li>
              <li className="flex items-start gap-2.5 text-sm text-neutro">
                <Icone nome="escudo" tamanho={15} className="mt-0.5 shrink-0 text-turquesa-400" />
                15 meses de garantia total
              </li>
              <li className="flex items-start gap-2.5 text-sm text-neutro">
                <Icone nome="troca" tamanho={15} className="mt-0.5 shrink-0 text-turquesa-400" />
                30 dias para troca ou devolução
              </li>
            </ul>

            <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-tenue">
              Formas de pagamento
            </p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {PAGAMENTOS.map((meio) => (
                <li
                  key={meio}
                  className="rounded-md border border-borda bg-grafite px-2.5 py-1 text-[11px] font-medium text-neutro"
                >
                  {meio}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-borda pt-6">
          <div className="flex flex-col gap-3 text-xs text-tenue sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {new Date().getFullYear()} {EMPRESA.nome} &middot; CNPJ {EMPRESA.cnpj}
            </p>
            <p>
              Projeto acadêmico e fictício &middot; nenhum pedido ou pagamento é processado de
              verdade.
            </p>
          </div>

          <p className="mt-5 border-t border-borda pt-5 text-center text-xs text-neutro">
            {AUTORIA.chamada}{' '}
            <strong className="font-semibold text-turquesa-300">{AUTORIA.autor}</strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
