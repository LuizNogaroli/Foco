# Pergunta Relacional de RIP e Validação do Botão Enviar (Aba 1)

**Data:** 07 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
1. **Pergunta Inicial "O imóvel possui RIP(s) relacionado(s)?":**
   - Inseri na interface [foco-01.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.html), logo acima do dropdown, a pergunta com as opções de caixa de seleção ("Sim" ou "Não").
   - Nomes de name dos inputs: `possui_rip`.

2. **Lógica de Mutua Exclusão e População Dinâmica (foco-01.js):**
   - Adicionei um ouvinte para que, ao marcar uma opção, a outra seja automaticamente desmarcada.
   - O dropdown de conceituação (`conceituacao_imovel`) agora é carregado dinamicamente com base na resposta da pergunta:
     - **Sim:** Apresenta apenas as opções *Terreno/acrescido de marinha*, *Terreno/acrescido marginal* e *Nacional interior* (as quais exigem a associação de RIPs e consequentemente ativam o botão `+ Inserir RIP`).
     - **Não:** Apresenta apenas as opções *Espelho d'água*, *Cavidades naturais subterrâneas*, *Manguezal* e *Praias* (as quais são dispensadas de RIP e ativam o botão `+ Inserir Cadastro Mínimo`).
     - **Sem resposta (inicial):** O dropdown é mantido oculto (`display: none`).

3. **Validação do Botão "Salvar e Avançar":**
   - Se nenhuma das opções ("Sim" ou "Não") estiver selecionada, o botão `btnEnviar` é definido como desabilitado (`disabled = true`) com estilização de opacidade reduzida (`opacity: 0.4`), cursor de bloqueio (`cursor: not-allowed`) e ações de clique desativadas.
   - Ao marcar qualquer uma das respostas ("Sim" ou "Não"), o botão torna-se 100% ativo com sua cor verde padrão.

4. **Sincronização e Restauração:**
   - Adicionada a propriedade `possui_rip` no salvamento e leitura da `tabela_indicacao`.
   - Lógica de carregamento inicial analisa a conceituação restaurada para marcar preventivamente a opção "Sim" ou "Não" correspondente, garantindo o funcionamento imediato da tela sem precisar re-inserir dados.
