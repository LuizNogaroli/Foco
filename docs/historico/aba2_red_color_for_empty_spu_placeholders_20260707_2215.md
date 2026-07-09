# Estilização em Vermelho para Campos Vazios do SPU (Aba 2)

**Data:** 07 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
1. **Diferenciação por Classe CSS:**
   - No arquivo [foco-02.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.js), implementei o controle da classe `.empty-spu-field`.
   - Se o campo vier **com dados** da tabela SPU, a classe é explicitamente removida.
   - Se o campo vier **vazio / nulo**, a classe `.empty-spu-field` é adicionada ao elemento.

2. **Estilização Seletiva em Vermelho:**
   - No arquivo [foco-02.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.html), inseri regras CSS específicas utilizando o seletor `.empty-spu-field`.
   - Isso garante que apenas os campos vazios tenham a cor do placeholder e o valor selecionado (nos selects desabilitados) pintados em **vermelho chamativo (`#dc2626`)**.
   - Os campos normais que possuem dados válidos mantêm o visual escuro padrão, sem interferências.
