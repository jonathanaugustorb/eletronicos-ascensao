/**
 * Fundo "preto líquido" da loja.
 *
 * São quatro camadas fixas e decorativas, todas atrás do conteúdo:
 *   1. manchas de luz turquesa e púrpura bem desfocadas;
 *   2. uma grade fina que dá profundidade sem roubar atenção;
 *   3. um grão sutil que tira o aspecto "chapado" do preto puro;
 *   4. um degradê que escurece as bordas.
 *
 * O grão é gerado por SVG inline (feTurbulence), então não há requisição
 * extra nem imagem no projeto.
 */

const GRAO =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='r'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23r)' opacity='0.55'/%3E%3C/svg%3E\")";

export function FundoLiquido() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 1. Manchas de luz */}
      <div
        className="animate-pulsar-lento absolute -left-40 -top-48 size-[42rem] rounded-full blur-[130px]"
        style={{ background: 'radial-gradient(circle, rgba(22,214,193,0.20), transparent 68%)' }}
      />
      <div
        className="animate-pulsar-lento absolute -right-56 top-24 size-[46rem] rounded-full blur-[140px]"
        style={{
          background: 'radial-gradient(circle, rgba(139,70,240,0.22), transparent 68%)',
          animationDelay: '-2.5s',
        }}
      />
      <div
        className="absolute -bottom-72 left-1/3 size-[40rem] rounded-full blur-[150px]"
        style={{ background: 'radial-gradient(circle, rgba(109,40,217,0.16), transparent 70%)' }}
      />

      {/* 2. Grade fina */}
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,40,64,0.5) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(34,40,64,0.5) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, #000 20%, transparent 78%)',
        }}
      />

      {/* 3. Grão */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: GRAO }}
      />

      {/* 4. Vinheta */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% 0%, transparent 35%, rgba(4,5,10,0.85) 100%)',
        }}
      />
    </div>
  );
}
