# Alteração da Seção "Conceituação do Imóvel" (Aba 1)

**Data:** 07 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
1. **Alteração do Título da Seção:**
   - No arquivo [foco-01.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.html), alterei o cabeçalho `<h3>` de `"Conceituação do imóvel a ser destinado (selecione uma ou mais opções):"` para `"Conceituação do Imóvel:"`.

2. **Substituição de Checkboxes por Dropdown:**
   - Removi as duas colunas de checkboxes ("Exige RIP" e "Dispensado") e as substituí por um único campo `<select>` com ID e name `conceituacao_imovel`.
   - As opções incluídas foram:
     - `Terreno/acrescido de marinha`
     - `Terreno/acrescido marginal`
     - `Nacional interior`
     - `Espelho d'água`
     - `Cavidades naturais subterrâneas`
     - `Manguezal`
     - `Praias`

3. **Exibição Condicional de Botões (foco-01.js):**
   - Atualizei a lógica em [foco-01.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.js) para escutar o evento `change` no select `conceituacao_imovel`.
   - Se a opção selecionada for `"Terreno/acrescido de marinha"`, `"Terreno/acrescido marginal"` ou `"Nacional interior"`, exibe o botão `+ Inserir RIP` e esconde o botão `+ Inserir Cadastro Mínimo`.
   - Se a opção selecionada for `"Espelho d'água"`, `"Cavidades naturais subterrâneas"`, `"Manguezal"` ou `"Praias"`, exibe o botão `+ Inserir Cadastro Mínimo` e esconde o botão `+ Inserir RIP`.
   - Caso nenhuma opção esteja selecionada, esconde ambos os botões.

4. **Sincronização de Estado e Retrocompatibilidade:**
   - O sincronizador universal (`sync.js`) escuta automaticamente a mudança no select e persiste o valor `conceituacao_imovel` no estado central (`window.parent.formDataState`).
   - No carregamento inicial, o script lê as informações salvas no banco. Caso o registro seja legado (formato antigo de checkboxes), ele realiza o parsing automático dos arrays `conceituacao_rip` e `conceituacao_dispensado` para definir a opção correta no select.
   - Ao submeter o formulário (botão Salvar e Avançar), o script grava o valor `conceituacao_imovel` no JSON da `tabela_indicacao` e também popula os arrays `conceituacao_rip` e `conceituacao_dispensado` correspondentes para manter 100% de retrocompatibilidade com outras telas ou relatórios que possam ler estas propriedades.
