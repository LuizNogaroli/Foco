# Carregamento de Cadastro Mínimo e Acordeão Expandido/Recolhível (Aba 2)

**Data:** 07 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
1. **Ativação e Correção do Acordeão do RIP:**
   - No arquivo [foco-02.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.js), implementei a função global `window.toggleAccordion(header)` que estava ausente na página.
   - A função alterna a exibição (`display: block` ou `none`) do conteúdo adjacente, altera o símbolo indicador (`▲` / `▼`) e gerencia a classe `active` para que o efeito visual do CSS funcione corretamente.
   - Atualizei o cabeçalho do acordeão de RIP para utilizar a classe `.accordion-header.type-rip` (azul) padronizada no CSS da página.

2. **Inclusão do Bloco de Cadastro Mínimo (Aba 2):**
   - Criei a função global `window.criarBlocoCadastroMinimo(dados, idx)` que renderiza dinamicamente as informações obtidas da etapa 1: CEP, UF, Município, Logradouro, Número, Área a ser destinada e Observações.
   - Esse bloco é exibido no formato de acordeão utilizando a classe `.accordion-header.type-cadastro` (verde), com suporte completo para expansão e recolhimento através do ouvinte de clique.
   - Por padrão, o acordeão é carregado expandido (`display: block`).

3. **Carregamento Automático:**
   - Adicionei uma rotina com `setTimeout` que, ao carregar a Aba 2, busca os cadastros mínimos da `tabela_indicacao` através do método `carregarIndicacoes` do frame pai (Supabase) e os envia para a renderização visual na tela.
