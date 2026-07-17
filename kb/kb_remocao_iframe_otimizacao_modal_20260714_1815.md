# Knowledge Base: Otimização de Modais - Remoção de Iframes e Estratégias de Renderização Dinâmica (JSON)

## Contexto e Desafio
Nos fluxos de trabalho de "Conferência e Aprovação" das Abas 1, 2 e 3, existiam modais que exibiam um relatório de síntese dos dados cadastrados antes de colher a assinatura da manifestação.
Para renderizar esses resumos, os modais utilizavam tags `<iframe>` apontando para páginas secundárias (`foco-XX-resumo.html?t=timestamp`).

Essa abordagem trazia os seguintes problemas técnicos:
- **Desempenho (Latency):** O navegador precisava iniciar uma nova requisição HTTP inteira para baixar o documento HTML, processar o head, carregar dependências e inicializar os scripts internos de cada iframe.
- **Sobrecarga de Memória (Memory Footprint):** Iframes criam contextos de navegação separados (*browsing contexts*) na memória do browser, aumentando consideravelmente o consumo de RAM.
- **Complexidade de Estilo:** Dificuldade em manter a consistência visual devido ao isolamento natural do iframe.
- **Barreiras de Escopo:** Para colher observações do modal ou fechar a janela, era necessário fazer cruzamento de dados complexos entre o `window` do iframe e o `window.parent`.

## Soluções Adotadas (Menos é Mais)
Substituímos todos os iframes por **renderizações locais e assíncronas** que consome diretamente os registros do Supabase. Para acomodar a complexidade dos diferentes relatórios, aplicamos duas abordagens distintas de injeção dinâmica de conteúdo:

### Abordagem A: Geração de Layout em JS via Template Literals (Aba 1 e Aba 2)
Ideal para resumos com menor quantidade de campos.
1. **Estrutura HTML do Modal:** Substituímos a tag iframe por uma div de loading e uma div de conteúdo (`#conteudoRelatorioAprovacao`).
2. **Importação Segura de CSS:** Vinculamos o `report.css` no formulário principal e inserimos um reset de body para neutralizar regras globais do relatório que afetariam o formulário de preenchimento.
3. **Injeção via JS:** Ao abrir o modal, os arquivos `foco-01.js` e `foco-02-v2.js` buscam os dados no Supabase e utilizam template literals para reconstruir o HTML com as variáveis injetadas em tempo real.

### Abordagem B: Carregamento Assíncrono do Template + Parsing DOM (Aba 3)
A Aba 3 possui um resumo massivo contendo dezenas de campos complexos de análises orçamentárias, ambientais e regimes de destinação. Recriar essa estrutura HTML manualmente em variáveis JavaScript seria propenso a erros, redundante e de difícil manutenção.

Adotamos a seguinte estratégia de **AJAX Template Parsing**:
1. **Requisição do Template:** Quando o modal é acionado, o JavaScript faz um `fetch` do próprio arquivo de resumo original (`foco-03-resumo.html`) como texto plano:
   ```javascript
   const htmlRes = await fetch("foco-03-resumo.html?t=" + new Date().getTime());
   const rawHtml = await htmlRes.text();
   ```
2. **Parsing do DOM na Memória:** Usamos a API nativa `DOMParser` para interpretar a string HTML como um documento DOM virtual:
   ```javascript
   const parser = new DOMParser();
   const doc = parser.parseFromString(rawHtml, "text/html");
   const reportContainer = doc.getElementById("content");
   ```
3. **Extração e Injeção do Fragmento:** Extraímos apenas o nó da div contendo o relatório (`#content`) e o injetamos no modal local:
   ```javascript
   conteudoRel.innerHTML = reportContainer.innerHTML;
   ```
4. **Preenchimento dos Campos:** Com o HTML injetado na página principal, o JavaScript simplesmente busca os elementos por seletores e atualiza os valores com base no JSON obtido da base de dados:
   ```javascript
   conteudoRel.querySelector("#val_natureza").textContent = rel.natureza_destinacao || '-';
   ```

## Vantagens Alcançadas
- **Velocidade de Renderização:** O carregamento do resumo passou de ~1.5 segundos para milissegundos, já que o navegador não precisa inicializar um novo contexto.
- **Não-Duplicação de Código (DRY):** A Abordagem B permitiu manter o arquivo `foco-03-resumo.html` como a única "fonte da verdade" do layout do relatório, sem precisar replicar o código HTML gigantesco dentro do JS.
- **Acessibilidade de Escopo:** Eliminou-se a necessidade de usar `window.parent` para controlar os botões de ação e variáveis globais dentro do modal.
- **Sem Memory Leaks:** A abertura e fechamento de modais não deixa instâncias de iframe penduradas na memória do navegador.

## Recomendações de Padrão de Projeto
Para qualquer modal futuro que exiba dados estruturados pré-existentes, prefira a **Abordagem B** (AJAX Template Parsing). Ela garante o desacoplamento entre a marcação visual (HTML) e a lógica de controle (JavaScript), permitindo que designers editem os templates de relatórios livremente sem quebrar os arquivos de código JS principais do projeto.
