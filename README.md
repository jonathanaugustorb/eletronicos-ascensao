# EletronicosAscensão

Loja de eletrônicos front-end, construída como projeto acadêmico. Não há
back-end: o catálogo é um arquivo de dados e o carrinho vive no navegador.

**Stack:** React 19 · JavaScript · Tailwind CSS 4 · Vite 8 · React Router 7

---

## Como rodar

```bash
npm install
npm run dev
```

A loja abre em `http://localhost:5173`.

| Comando           | O que faz                                  |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | servidor de desenvolvimento com hot reload |
| `npm run build`   | gera a versão de produção em `dist/`       |
| `npm run preview` | serve o `dist/` já construído              |

---

## Páginas

| Rota                 | Página            | O que tem                                                      |
| -------------------- | ----------------- | -------------------------------------------------------------- |
| `/`                  | Home              | vitrine, categorias, mais avaliados, ofertas                    |
| `/produtos`          | Catálogo          | busca, filtros, ordenação e paginação                           |
| `/produtos/:id`      | Detalhe           | ficha técnica, preço no Pix, estoque e relacionados             |
| `/carrinho`          | Carrinho          | quantidades, cupom, resumo e sugestões                          |
| `/finalizar-pedido`  | Finalizar pedido  | 4 etapas com validação                                          |
| `/pedido-confirmado` | Confirmação       | comprovante do pedido simulado                                  |
| `/quem-somos`        | Quem somos        | história, princípios, time e perguntas frequentes               |
| `*`                  | 404               | página não encontrada                                           |

---

## Busca e filtros

O estado dos filtros mora na **query string**, então toda listagem filtrada pode
ser recarregada, favoritada ou compartilhada.

| Parâmetro | Exemplo                 | Filtro                                       |
| --------- | ----------------------- | -------------------------------------------- |
| `busca`   | `?busca=notebook`       | nome, marca, categoria, resumo e etiquetas    |
| `cat`     | `?cat=audio,games`      | uma ou mais categorias                        |
| `marca`   | `?marca=Nuvex,Orbyn`    | uma ou mais marcas                            |
| `min`     | `?min=500`              | preço mínimo                                  |
| `max`     | `?max=2000`             | preço máximo                                  |
| `nota`    | `?nota=4.5`             | avaliação mínima                              |
| `promo`   | `?promo=1`              | somente itens com desconto                    |
| `estoque` | `?estoque=1`            | esconde os esgotados                          |
| `ordem`   | `?ordem=menor-preco`    | `relevancia`, `menor-preco`, `maior-preco`, `nota`, `desconto`, `novidades` |

Dois detalhes da implementação:

- **Contagem por faceta.** Cada categoria e cada marca mostra quantos produtos
  traria considerando os *outros* filtros ativos — marcar "Notebooks" não zera
  as demais categorias da lista.
- **Busca por início de palavra.** "note" encontra "notebook", mas "fone" não
  casa com "telefone". Acentos são ignorados: "audio" acha "Áudio".

---

## Regras do pedido

- **Frete grátis** acima de R$ 499, na entrega padrão. A entrega expressa é um
  serviço à parte e continua cobrando; retirar na loja é sempre grátis.
- **Pix** dá 10% de desconto, aplicado depois do cupom.
- **Cartão** parcela em até 12x sem juros.

Cupons aceitos:

| Cupom         | Efeito             | Mínimo |
| ------------- | ------------------ | ------ |
| `ASCENSAO10`  | 10% de desconto    | —      |
| `BEMVINDO5`   | 5% de desconto     | —      |
| `FRETEGRATIS` | zera o frete       | R$ 199 |

---

## Organização

```
src/
├── components/
│   ├── carrinho/     linha do carrinho, cupom e resumo
│   ├── layout/       cabeçalho, rodapé, fundo e moldura
│   ├── produtos/     card, grade, imagem e painel de filtros
│   └── ui/           botão, campo, ícones, estrelas, selo...
├── context/          provider do carrinho (reducer + localStorage)
├── data/             catálogo e conteúdo institucional
├── hooks/            carrinho, filtros, formulário e debounce
├── pages/            uma página por rota
├── utils/            formatação (pt-BR) e regras de preço
└── index.css         tokens de cor, tipografia e utilitários
```

Decisões que valem o comentário:

- **As URLs de produto saem de `caminhoProduto(id)`**, em `data/produtos.js`.
  Nenhuma tela monta o caminho à mão, então mudar a rota é mexer em um lugar só.
- **O card inteiro é clicável com um link só.** O `::after` do link do título
  cobre o card; o botão "Adicionar" sobe com `z-10` para continuar recebendo o
  clique. Assim o leitor de tela anuncia um link por produto, não três.
- **O carrinho guarda só `id` e `quantidade`.** Preço, nome e estoque são sempre
  lidos do catálogo atual, então um carrinho salvo ontem nunca exibe um preço
  defasado. A quantidade é limitada ao estoque na hora de gravar.
- **As regras de preço são funções puras** em `utils/pedido.js`, sem React e sem
  DOM. O carrinho e o fechamento do pedido usam exatamente o mesmo cálculo.
- **O contexto fica em três arquivos** (contexto, provider e hook) para o Fast
  Refresh do Vite continuar funcionando.

---

## Visual

Paleta turquesa e púrpura sobre um "preto líquido" montado em quatro camadas
(manchas de luz desfocadas, grade fina, grão em SVG e vinheta), em
`components/layout/FundoLiquido.jsx`.

As cores vêm de tokens declarados em `src/index.css` com `@theme`, do Tailwind 4
— não existe `tailwind.config.js`. Os pares de texto e fundo ficam acima de
4,5:1 de contraste (AA); o texto principal passa de 18:1.

Tipografia: **Space Grotesk** nos títulos e **Inter** no texto corrido.

---

## Sobre os dados

Marcas, produtos, preços, depoimentos, endereço e CNPJ são **fictícios**. As
fotos são carregadas do Unsplash por URL; se alguma não abrir, o card mostra o
ícone da categoria no lugar, sem quebrar o layout.

Nenhum pagamento é processado e nenhum dado sai do navegador.
