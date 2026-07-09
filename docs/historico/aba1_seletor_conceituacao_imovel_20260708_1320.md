# Unificação da Conceituação do Imóvel (Aba 1)

**Data:** 08 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
1. **Remoção da Pergunta Sim/Não (foco-01.html):**
   - No arquivo [foco-01.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.html), removi a pergunta *"O imóvel possui RIP(s) relacionado(s)?"* e as caixas de seleção de Sim e Não.
   - Deixei o seletor `"Selecione a conceituação do imóvel"` visível por padrão, carregando as 7 opções disponíveis diretamente no HTML (sendo as 3 primeiras relativas a imóvel com RIP e as 4 últimas relativas a imóvel sem RIP).

2. **Refatoração da Lógica de Exibição e Sincronização (foco-01.js):**
   - Atualizei o arquivo [foco-01.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.js) para detectar o tipo de conceituação escolhida:
     - Se for uma das 3 primeiras (*Terreno de Marinha*, *Terreno Marginal*, *Nacional Interior*), exibe o botão `+ Inserir RIP` e oculta o de `Cadastro Mínimo`. Internamente define `possui_rip` como `"Sim"`.
     - Se for uma das 4 posteriores (*Espelho d'água*, *Cavidades*, *Manguezal*, *Praias*), exibe o botão `+ Inserir Cadastro Mínimo` e oculta o de `RIP`. Internamente define `possui_rip` como `"Não"`.
   - Adaptei as rotinas de carga de dados e salvamento no banco de dados para computar dinamicamente o valor de `possui_rip`, garantindo 100% de compatibilidade reversa com o banco de dados e fluxos das demais abas.
