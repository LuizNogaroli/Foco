# Modais em Nível de Seção

O formulário agora conta com **duas vias de edição** independentes. Isso será excelente para validar com o cliente qual o modelo mental de trabalho que melhor se adequa ao fluxo dos analistas.

## O que foi feito?

1. **Injeção dos Ícones nos Títulos:**
   Um novo ícone de "Caderninho com Lápis" laranja (para se destacar dos ícones de campos individuais azuis) foi posicionado lado a lado com os títulos principais das seções:
   - Identificação do Imóvel (dentro da sanfona)
   - Avaliação do Imóvel
   - Ocupação
   - Riscos e Restrições

2. **O Novo Modal Dinâmico:**
   Quando acionado, esse ícone abre o recém-criado `modalSecao`. Esse modal é focado em liberdade de escrita e argumentação. Ele possui:
   - Um campo indicando qual seção está sendo contestada (ex: `Avaliação do Imóvel (RIP: 0000000)`).
   - Uma área de texto **"Solicitação de Alterações"**, feita para acomodar parágrafos descrevendo o que precisa ser ajustado globalmente naquela seção.
   - Uma área de texto **"Justificativa / Fundamentação"**, para o analista fundamentar a lei ou documento comprobatório.

3. **Independência no Salvamento:**
   Assim como as edições campo-a-campo vão para uma lista JSON de rascunhos (`solicitacoes_cadastrais`), as edições por seção vão para uma lista JSON paralela (`solicitacoes_secao`). Assim, o relatório final poderá processar as duas fontes de forma harmônica (ou adotar apenas a vencedora após a validação do protótipo).

## Como Testar
- Pesquise um RIP qualquer na interface.
- Localize os títulos principais com o ícone ✏️ na cor laranja (ex: **Avaliação do Imóvel**).
- Clique no ícone. O novo modal de seção se abrirá com os dois campos livres que projetamos!
