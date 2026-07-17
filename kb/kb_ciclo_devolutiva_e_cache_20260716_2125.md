# Knowledge Base - Sincronização de Fluxos de Devolução e Controle de Cache em Arquiteturas Iframe

## 1. Contexto Geral e Desafio Técnico

O sistema utiliza uma arquitetura baseada em **iFrames** para renderizar os formulários de cada aba (`foco-01.html`, `foco-02.html`, `foco-03.html`, etc.) de forma isolada dentro do contexto principal (`processo.html` e `index.html`).

O fluxo de trabalho (workflow) e a comunicação com o banco de dados (Supabase) dependem de scripts compartilhados:
1. `workflow.js`: Define o dicionário estático contendo as fases, status e instâncias.
2. `db.js`: Executa as transições de status no Supabase a partir de funções expostas para o escopo global do `window.parent`.

Três falhas críticas ocorriam nesta estrutura quando um processo era devolvido a partir de uma aba avançada:
- **Ausência de Colunas no Banco (Erro 400)**: A tabela `tabela_status_fluxo` do Supabase **não possui** colunas como `tag_fluxo`, `status` ou `instancia` a nível raiz; ela armazena todas essas informações encapsuladas dentro do campo `dados_json`. Qualquer tentativa de efetuar um `PATCH` ou `POST` enviando chaves de nível raiz causa um erro `400 Bad Request` no PostgREST, abortando a atualização inteira de forma silenciosa.
- **Divergência na Conclusão Final**: O box de conclusão da manifestação no final da página da Aba 3 (`foco-03.html`) forçava status estáticos e legados (como `"Devolvido"`), que sobrescreviam as configurações padronizadas de fluxo e quebravam a nomenclatura de KPIs.
- **Problema Silencioso de Caching**: O navegador armazenava em cache os arquivos `workflow.js?v=1` e `db.js?v=...` e ignorava atualizações lógicas mesmo após comandos manuais de recarregamento (`Ctrl + F5`), pois os parâmetros de versão (`?v=`) não eram alterados nas páginas parentes (`index.html` e `processo.html`).

---

## 2. Soluções e Lições Aprendidas

### A) Tratamento de Cache-Busting
Sempre que arquivos de lógica mestre (`workflow.js`, `db.js`, `sync.js`) forem alterados, a assinatura de versão de suas importações deve ser atualizada de forma coordenada em todos os arquivos HTML que os declaram:
```html
<!-- index.html e processo.html -->
<script src="workflow.js?v=YYYYMMDDHHMM"></script>
<script src="db.js?v=YYYYMMDDHHMM"></script>
```
Isso força o navegador a descartar cópias antigas e carregar a lógica atualizada.

### B) Sincronização Segura via dados_json
Para evitar erros de esquema e abortamento de requisições, o payload enviado ao Supabase deve atualizar exclusivamente o campo `dados_json`, onde toda a hierarquia de status, checkpoints e instâncias do fluxo reside. O painel inicial (`index.html`) deve continuar mapeando o campo `dados_json` para a extração do status e renderização das badges:
```javascript
body: JSON.stringify({ dados_json: json })
```

### C) Alinhamento da Lógica de Conclusão Final
Qualquer fluxo que execute modificações no status de tramitação (seja o box de "Devolução Rápida / Retorno Imediato" ou o box de "Manifestação e Despacho Final" na base da aba) deve ler os mesmos dicionários centralizados e atualizar os campos usando a mesma nomenclatura. Isso impede a colisão de termos (ex: um fluxo gravando `"Devolvido"` e o outro gravando `"Aguardando Indicação de Imóvel"`).
