# Evolução Arquitetural: Roteamento Inteligente via Lupa (Dashboard)

## 1. O Problema Atual (Foco-13)
Atualmente, ao clicar na "Lupa" (Ação) no Painel de Requerimentos (`index.html`), o sistema abre o arquivo `processo.html` sempre na estaca zero (Aba 1). O usuário precisa saber, com base no status, que ele deve clicar no menu lateral para ir para a Aba 2, ou para o Painel de Manifestações (Aba 7). Isso exige que o usuário tenha um mapa mental do sistema, aumentando a fricção cognitiva e o risco de erros.

## 2. A Solução Proposta (Roteamento Inteligente)
A Lupa passará a agir como um **Roteador Inteligente**. O sistema assumirá o protagonismo e conduzirá o usuário diretamente para a tela onde a ação dele é exigida, baseando-se na Matriz de Workflow (`tabela_status_fluxo`) e no Perfil do Usuário Logado (`CURRENT_USER_PROFILE`).

## 3. Estratégia de Implementação (Passo a Passo)

### Passo A: Mapeamento Dinâmico no `openProcess` (`index.html`)
A função `openProcess` será expandida para ler a `instancia` atual do processo e mapeá-la para o arquivo HTML correspondente:
- Instância "Painel de Requerimentos" / "Admissibilidade" ➔ `foco-01.html`
- Instância "Caracterização" ➔ `foco-02-v2.html`
- Instância "Destinação" ➔ `foco-03.html`
- Instâncias de Deliberação (Chefia, Coordenação, Superintendência, etc.) ➔ `aba7.html`

O redirecionamento injetará um novo parâmetro na URL: `processo.html?process_id=123&target_tab=foco-03.html`.

### Passo B: Recepção e Roteamento no `processo.html`
O arquivo `processo.html` será modificado para ler o parâmetro `target_tab` da URL. Ao invés de carregar o `foco-01.html` no `<iframe>` por padrão, ele carregará imediatamente a aba alvo.

### Passo C: Contexto Histórico vs Foco (Menu Lateral)
Como um deliberador (Aba 7) precisa ler a Caracterização (Aba 2) para tomar uma decisão, o menu lateral no `processo.html` será reativo:
- **Abas Passadas:** Ficam visíveis e clicáveis, mas carregam em modo *Somente Leitura* (apenas para consulta).
- **Aba Atual (Target):** Fica destacada visualmente. É a única que o perfil autorizado pode editar.
- **Abas Futuras:** Ficam ocultas ou desabilitadas, limpando a interface de caminhos irrelevantes.

### Passo D: Acesso de Espectador (Somente Leitura Global)
Se o perfil do usuário logado for diferente do perfil exigido pela etapa atual na Máquina de Estados, a Lupa continuará enviando o usuário para a aba atual, porém injetando o parâmetro `&readonly=true`. A trava de segurança em `sync.js` (já implementada no Foco-13) garantirá que nenhum botão de envio seja clicável.

### Passo E: Limpeza da UI
Como a navegação passa a ser controlada pelo Dashboard e pelo Menu Lateral Inteligente, os botões *hard-coded* dentro dos iframes (ex: "Avançar para Aba 2" ou "Ir para Painel de Manifestações") poderão ser removidos, deixando os formulários mais limpos e modulares.

## 4. Benefícios Esperados
- **Onboarding mais rápido:** Novos usuários não precisam ser treinados sobre "onde clicar para aprovar". O sistema abre na cara deles.
- **Isolamento de Componentes:** As abas deixam de se preocupar com navegação e passam a focar apenas em coletar/exibir dados.
- **Segurança Reforçada:** Uma camada extra visual que reflete o controle de acesso por papel (RBAC) já consolidado no `workflow.js`.
