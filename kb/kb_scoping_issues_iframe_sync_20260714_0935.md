# KB - Problemas de Escopo de Inicialização de Eventos no JavaScript Dinâmico de Formulários Multi-Aba

## Contexto
Em projetos com múltiplos iframes que se comunicam através de um estado global sincronizado (como o `formDataState`), a inicialização e escuta dos eventos do DOM devem ocorrer imediatamente após o carregamento da página (`DOMContentLoaded` ou no escopo global do script).

## Desafio
Durante a reestruturação e inserção de lógicas assíncronas no arquivo `foco-02.js`, uma chave de fechamento (`};`) da função global `window.abrirGeoModal` foi removida acidentalmente. Como o JavaScript tolera sintaticamente agrupamentos aninhados complexos se a chave no final do arquivo for mantida, o código não gerou erro de sintaxe imediato na compilação básica.
No entanto, isso fez com que toda a rotina subsequente — incluindo a associação de escutadores de eventos (`addEventListener`) dos botões de rodapé (`btnSalvarRelatorio`, `btnManifestacao`, etc.) — ficasse presa dentro do escopo da função `abrirGeoModal`.

### Sintoma
Os botões do formulário de salvamento não respondiam ao clique e pareciam inativos, pois os listeners de eventos só eram registrados caso o usuário clicasse no botão do mapa primeiro (o que dispararia a execução da função `abrirGeoModal` e registraria tardiamente os eventos subsequentes).

## Soluções e Lições Aprendidas
1. **Isolamento de Escopo Global:** Garantir que funções de utilidades globais (como modais) fechem seus blocos estritamente antes de inicializações gerais do DOM.
2. **Utilizar Formatadores Robustos:** A aplicação de formatadores de código (como o Prettier) expõe problemas de aninhamento imediatamente através da indentação incorreta e deslocada.
3. **Verificação de Chaves:** Em edições manuais que reordenam ou modificam trechos do arquivo, sempre validar o número total de chaves abertas vs. fechadas e a sintaxe via interpretador (`node -c`).
