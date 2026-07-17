# Ciclo de Devolutiva e Resposta em Fluxos de Processos

## 1. O Desafio (Problema Proposto)
Em fluxos de processos sequenciais (Ex: Indicação ➡ Caracterização ➡ Destinação), muitas vezes a etapa final encontra inconsistências ou ausência de dados fornecidos pelas etapas anteriores.
O desafio consistia em permitir a **devolução do processo (rollback estruturado)** de uma aba avançada para uma aba anterior, garantindo que:
1. A equipe recebedora soubesse exatamente **o motivo** da devolução.
2. A equipe emissora fosse forçada a registrar uma **resposta justificando as alterações/correções** realizadas.
3. Todo esse histórico do "ping-pong" integrasse a versão final do relatório, sem perder dados ou poluir o banco de dados principal.

## 2. A Solução Arquitetural
Para resolver isso sem criar complexas tabelas relacionais de mensagens de chat, adotamos uma abordagem guiada por estado condicional (dentro do `formDataState` e dos Snapshots JSON):

### A) Despacho e Motivo (Origem da Devolução)
Na aba final (ex: Aba 3), o botão de conclusão único foi substituído por um bloco de **Ação Final / Despacho**, oferecendo as opções:
- Aprovar
- Devolver para Aba 2
- Devolver para Aba 1

Se a opção for de devolução, um campo "Motivo da Devolução" torna-se obrigatório. Ao assinar a manifestação, o sistema grava `status_devolucao` (indicando o alvo) e `motivo_devolucao` no JSON do rascunho, e joga o processo para o status "Devolvido para Complementação" no Painel Gerencial.

### B) Recepção e Resposta (Alvo da Devolução)
Ao carregar as Abas 1 ou 2, o JavaScript intercepta o evento de carregamento do banco de dados e verifica se a variável `status_devolucao` é direcionada àquela aba. Se for:
- Aciona a exibição de um **Banner de Alerta (Vermelho)** no topo da página expondo o "Motivo da Devolução".
- Destrava um **Bloco Obrigatório de Resposta** ao final do formulário (`resposta_devolucao`).

### C) Fechamento do Ciclo e Registro Histórico
Ao concluir a correção e enviar novamente para a frente:
1. O sistema "Tira uma foto" (JSON Snapshot) do processo contendo a queixa original (`motivo_devolucao`), a correção (`resposta_devolucao`) e os dados recém atualizados.
2. Limpa a flag `status_devolucao` para que a próxima aba não ache que está devolvida.
3. O Resumo/Relatório em HTML/PDF foi configurado para renderizar o bloco condicional **"Histórico de Devolução e Retificação"**, eternizando na "capa do processo" o diálogo formal e as assinaturas de quem devolveu e quem corrigiu.
