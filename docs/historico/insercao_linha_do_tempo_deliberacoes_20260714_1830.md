# Histórico de Alterações - Linha do Tempo e Fila Dinâmica na Aba 7

## Resumo da Mudança
Implementamos um histórico visual de decisões em formato de Linha do Tempo (Timeline) na Aba 7 (`aba7.html`). Agora, manifestações anteriores da Chefia SPU/UF, Coordenação SPU/UF e Superintendência são carregadas da `tabela_deliberacoes` do Supabase e expostas em cards ordenados por data. Além disso, introduzimos o controle de fila por checkpoint, permitindo que os formulários de deliberação fiquem visíveis apenas quando o processo estiver sob a responsabilidade do respectivo perfil (com base na `tabela_status_fluxo`).

## 1. Estado Anterior (Antes)
- Ao registrar uma deliberação na Aba 7, os dados eram inseridos no Supabase e atualizavam o status do fluxo, porém não eram refletidos na tela de forma cumulativa.
- A exibição dos formulários de preenchimento (`bloco-deliberacao-chefia`, `bloco-deliberacao-coord`, `bloco-deliberacao-super`) dependia apenas de controle de perfil estático (RBAC no carregamento inicial da página). Qualquer chefe logado via formulário de equipe/coordenação visualizava os blocos de ação abertos para re-escrita, mesmo se o processo estivesse em outra etapa.

## 2. Estado Novo (Depois)
- Adicionado container `#historico-deliberacoes-container` estilizado com CSS personalizado de timeline (círculos de status verde para aprovado/favorável e vermelho para devolvido).
- Criada a função assíncrona `carregarDeliberacoesETimeline` que busca o histórico no Supabase, monta a linha do tempo dinâmica e busca o `checkpoint` do fluxo.
- A função de RBAC `applyProfileView` foi reescrita para receber o `currentCheckpoint`. Os blocos de ação agora são exibidos de forma mutuamente exclusiva:
  - Chefia: Vê o formulário apenas se `checkpoint` for `Aguardando Chefia...` ou `Devolvido para Chefia...`.
  - Coordenação: Apenas se for `Aguardando Coordenação...` ou `Devolvido para Coordenação...`.
  - Superintendência: Apenas se for `Aguardando Superintendência`.
  - Caso contrário (ex: processo ainda em análise de equipe), os formulários são ocultados e a linha do tempo histórica é a única exibida.
- Os listeners de salvamento das deliberações recarregam a linha do tempo instantaneamente após a resposta bem sucedida da API.

## 3. Plano de Rollback / Desfazer
Para desfazer:
1. **No `aba7.html` (CSS)**:
   - Remova o bloco CSS `.delib-card` e subclasses inseridos ao final da tag de estilos principal.
2. **No `aba7.html` (HTML)**:
   - Exclua o container `#historico-deliberacoes-container` inserido logo acima do comentário da Chefia.
3. **No `aba7.html` (JS)**:
   - Remova as chamadas `carregarDeliberacoesETimeline()` nas funções de salvamento.
   - Restaure a função `applyProfileView(profile)` original que aceitava apenas o argumento `profile` e exibia o bloco baseando-se unicamente nas permissões estáticas do `profilePermissions`.
   - Remova a função `carregarDeliberacoesETimeline()` e retorne o listener `DOMContentLoaded` para disparar apenas `applyProfileView(savedProfile)`.
