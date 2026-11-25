import { useEffect, useRef, useState } from 'react';
import { Icone } from '../ui/Icone.jsx';
import { CATEGORIAS, montarUrlFoto } from '../../data/produtos.js';

/**
 * Foto do produto com reserva de espaço e alternativa em caso de falha.
 *
 * As fotos vêm de um serviço externo. Se alguma não carregar, no lugar dela
 * aparece o ícone da categoria sobre um degradê — assim o layout não quebra.
 *
 * @param {object} props
 * @param {import('../../data/produtos.js').Produto} props.produto
 * @param {number} [props.largura]
 * @param {number} [props.altura]
 * @param {string} [props.className] classes da imagem
 * @param {'lazy'|'eager'} [props.carregamento]
 */
export function ImagemProduto({
  produto,
  largura = 640,
  altura = 640,
  className = '',
  carregamento = 'lazy',
}) {
  const [falhou, setFalhou] = useState(false);
  const [carregada, setCarregada] = useState(false);
  const referencia = useRef(null);

  // Uma imagem já em cache termina de carregar antes de o React ligar o
  // onLoad, e sem esta checagem ela ficaria presa em opacity-0.
  useEffect(() => {
    if (referencia.current?.complete) setCarregada(true);
  }, []);

  const icone = CATEGORIAS.find((categoria) => categoria.id === produto.categoria)?.icone ?? 'caixa';

  if (falhou) {
    return (
      <div
        className={`grid place-items-center bg-linear-to-br from-grafite via-breu to-abissal text-borda-forte ${className}`}
        role="img"
        aria-label={produto.nome}
      >
        <Icone nome={icone} tamanho={56} espessura={1.1} />
      </div>
    );
  }

  return (
    <img
      ref={referencia}
      src={montarUrlFoto(produto.foto, largura, altura)}
      alt={produto.nome}
      width={largura}
      height={altura}
      loading={carregamento}
      decoding="async"
      onError={() => setFalhou(true)}
      onLoad={() => setCarregada(true)}
      className={`bg-grafite transition-opacity duration-500 ${carregada ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  );
}
