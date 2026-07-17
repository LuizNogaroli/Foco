# Botão "Inserir RIP criado" e Modal na Aba 2

## Estado Anterior (Antes)
Na aba 2, caso houvesse uma solicitação de criação de RIP em andamento, o sistema exibia apenas a caixa de informações `"🔔 Solicitação de Criação de RIP"` contendo a justificativa. Não havia um meio direto para que o analista informasse que o RIP já havia sido gerado pela equipe de cadastro e adicionasse o imóvel ao processo a partir da própria aba 2.

## Estado Novo (Depois)
1. Inserimos o botão `+ Inserir RIP criado` alinhado à direita logo abaixo do box de solicitação de criação de RIP no arquivo [foco-02.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.html):
```html
      <!-- Container para o botão Inserir RIP Criado -->
      <div id="container-btn-inserir-rip-criado" style="display: none; justify-content: flex-end; margin-bottom: 16px; width: 100%;">
          <button type="button" id="btnInserirRipCriado" class="btn-action" style="padding: 8px 16px; background-color: #0284c7; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; width: fit-content;">+ Inserir RIP criado</button>
      </div>
```

2. Adicionamos o `modalInserirRip` no final do arquivo [foco-02.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.html), idêntico ao da aba 1 (sem o botão "Mais").
3. Desenvolvemos em [foco-02.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.js) a lógica que:
   - Exibe o botão de inserção de RIP quando o box de solicitação de criação de RIP for ativado.
   - Abre o modal de digitação de RIP.
   - Valida o número do RIP contra a tabela do banco de dados `tabela_spu`.
   - Cria o card detalhado do RIP (`criarBlocoImovel`) carregando as informações reais ou caindo em fallback inteligente se necessário.
   - Esconde o box de solicitação de criação de RIP, esconde o botão de inserção de RIP criado.
   - Atualiza e persiste o estado no parent (`window.parent.updateField('solicitacao_criacao_rip', '')`) limpando a solicitação antiga.

## Plano de Rollback / Desfazer
Para reverter essas alterações:
1. Abra o arquivo [foco-02.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.html):
   - Remova o contêiner `container-btn-inserir-rip-criado` e o botão contido nele.
   - Remova o contêiner `modalInserirRip` do rodapé da página.
2. Abra o arquivo [foco-02.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.js):
   - Remova a linha `const btnContainer = document.getElementById('container-btn-inserir-rip-criado'); if (btnContainer) btnContainer.style.display = "flex";` de dentro da função `criarBlocoSolicitacaoCriacao`.
   - Exclua o bloco de binding de eventos do modalInserirRip localizado ao final do escopo de `DOMContentLoaded`.
