# Knowledge Base: Linha do Tempo de Deliberações e Controle de Fila por Checkpoints (Aba 7)

## Contexto e Desafio
Na Aba 7 (Deliberações), o processo transita em um fluxo hierárquico: **Chefia SPU/UF** ➔ **Coordenação SPU/UF** ➔ **Superintendência**.

O desafio consistia em resolver duas fragilidades na interface original:
1. **Falta de Cumulatividade Visual:** Quando a Chefia aprovava e enviava para a Coordenação, a deliberação era salva na base, mas a Coordenação entrava e não via o parecer físico da Chefia de forma explícita no painel. O mesmo ocorria para a Superintendência.
2. **Conflito de Concorrência e Ações Fora de Fila:** Usuários com perfis elevados (ex: Chefia ou Superintendência) podiam interagir e salvar novas deliberações a qualquer momento, independente de o processo estar na sua vez de análise ou estar com a equipe técnica. Isso causava sobrescritas e inconsistência nos status gerais do fluxo.

## Solução Adotada (Linha do Tempo + Fila Dinâmica)

### 1. Linha do Tempo Histórica (Timeline)
Adicionamos uma seção `#historico-deliberacoes-container` no topo da deliberação. Toda vez que a Aba 7 é exibida, uma rotina JS faz o `fetch` completo na `tabela_deliberacoes` buscando todas as decisões passadas para aquele ID de processo, ordenadas por data de criação (`created_at.asc`).

A interface desenha cards específicos com estilos baseados na decisão:
- **Cards Verdes (Aprovado / Favorável):** Sinalizam aprovação hierárquica e transição de avanço no fluxo.
- **Cards Vermelhos (Devolvido / Cancelado):** Destacam a recusa, especificando exatamente a aba de destino e o motivo (justificativa da complementação) que forçou o retorno.
- **Checklist da Superintendência:** Caso o card seja da Superintendência, o sistema renderiza um detalhamento visual dos 4 critérios de análise (Interesse Público, Destinatário, Impactos e Regime).

### 2. Controle de Fila Baseado em Fila Dinâmica (Checkpoints)
Integramos a visibilidade dos blocos de decisão a uma validação conjunta de **Perfil** + **Etapa Atual do Fluxo**:

1. A página consulta o status na `tabela_status_fluxo` para extrair o `checkpoint` ativo daquele processo.
2. Reescrevemos a função `applyProfileView` para avaliar o `currentCheckpoint`:
   - O formulário de decisão da **Chefia** só aparece se o checkpoint for `"Aguardando Chefia SPU/UF"` ou `"Devolvido para Chefia SPU/UF"`.
   - O formulário da **Coordenação** só aparece se o checkpoint for `"Aguardando Coordenação SPU/UF"` ou `"Devolvido para Coordenação"`.
   - O formulário da **Superintendência** só aparece se o checkpoint for `"Aguardando Superintendência"`.
   - Se o processo estiver em qualquer outro status (como preenchimento inicial da Equipe Técnica), **todos os formulários de deliberação são bloqueados/ocultados**, exibindo apenas a linha do tempo cumulativa em modo somente leitura.

3. **Atualização Instantânea:** Quando um usuário conclui uma deliberação, o retorno da API dispara imediatamente a recarga da timeline e a chamada de reavaliação de fila. O formulário de ação que ele acabou de preencher desaparece de sua tela na mesma hora e vira o novo card no topo do histórico.

## Vantagens
- **Integridade da Informação:** Impede que analistas deliberem fora de sua vez de fila de trabalho.
- **Transparência Hierárquica:** A Coordenação e Superintendência agora baseiam suas decisões no histórico de pareceres visuais anteriores, que ficam consolidados na mesma página.
- **Interface Reativa:** Fornece um feedback imediato de transição ao usuário após o salvamento de suas deliberações.
