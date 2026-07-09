# Bloqueio de Campos Vazios do Datalake SPU (Aba 2)

**Data:** 07 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
1. **Bloqueio de Campos sem Dados no SPU:**
   - No arquivo [foco-02.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.js), alterei a lógica do bloco `else` (quando o valor retornado do banco SPU está em branco/nulo).
   - Ao invés de deixar os campos habilitados para edição (fundo branco), os campos agora são **desabilitados / travados** (`readonly` / `disabled`) e estilizados com o fundo cinza (`#f1f5f9`) e cursor bloqueado (`not-allowed`), da mesma forma que os campos que possuem dados.

2. **Placeholder Condicional:**
   - **Inputs / Textareas:** É adicionado o placeholder `"Não há este dado no cadastro do imóvel"` e o valor do campo é resetado para vazio.
   - **Selects:** É criada (ou ajustada) a opção com valor vazio (`""`) para conter o texto `"Não há este dado no cadastro do imóvel"`, definindo-a como selecionada e desabilitando o seletor.

3. **Prevalência sobre Outras Regras:**
   - Essa nova regra de bloqueio se aplica diretamente no retorno da consulta do RIP, sobrepondo-se a qualquer regra de preenchimento condicional pré-existente (como as contidas em arquivos `.md`).
