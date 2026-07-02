# Log de Problemas e Soluções (Troubleshooting)

Este documento registra problemas de desenvolvimento, testes e regras de negócio que foram identificados e corrigidos durante o ciclo de vida do projeto Admissibilidade Foco-09. Ele serve como base de conhecimento para evitar regressões futuras.

---

### 1. "Rascunhos Fantasmas" (Dados Errados ou Vazios ao Abrir um Requerimento)
**Sintoma:** Ao clicar na lupa de um requerimento no painel gerencial (ex: `PR2026001`), o formulário da Aba 1 carrega dados que pertencem a outro processo (ex: `DF04401`) ou traz campos de tabelas base totalmente vazios, ignorando o que existe no banco principal (`portal_servicos`).
**Causa:** A arquitetura do sistema no arquivo `db.js` busca primeiramente a tabela de rascunhos (`foco_drafts`). Se um rascunho existir para aquele `process_id`, ele **ignora** a base do portal de serviços. Se no passado houve testes no ambiente utilizando aquele mesmo ID e gerando um rascunho com dados mockados antigos ou vazios, este "rascunho fantasma" assume a prioridade.
**Solução:** Excluir fisicamente o registro conflitante (rascunho obsoleto) na tabela `foco_drafts` (via Supabase ou API). Ao entrar na página novamente, o sistema não encontrará o rascunho e fará o preenchimento correto usando a origem primária em `portal_servicos`, gerando em seguida um rascunho atualizado.

---

### 2. Blocos Condicionais Ocultos no Recarregamento da Página
**Sintoma:** Uma seção que depende de um checkbox estar marcado (ex: Cadastro Mínimo sem RIP que depende de "Manguezal", "Praia" etc.) fica oculta (display none) ao recarregar a página, mesmo com o checkbox aparecendo visivelmente marcado. Só volta a aparecer se o usuário desmarcar e remarcar o checkbox manualmente.
**Causa:** Condição de corrida no ciclo de vida do Front-End. A função responsável por exibir as seções baseada nos checkboxes (`verificarConceituacao()`) era chamada em `foco-01.js` logo ao receber o evento de estado (`DATABASE_LOADED`), **antes** do motor de sincronização assíncrono (`sync.js -> populateForm`) conseguir preencher fisicamente as tags no HTML. A função avaliava a tela "vazia", ocultava os blocos, e em seguida os checkboxes ganhavam o check sem disparar a verificação de novo.
**Solução:** Inclusão de uma chamada explícita para `window.verificarConceituacao()` no fim do escopo da função `populateForm` em `sync.js`. Isso garante que a visibilidade seja reavaliada baseando-se no DOM hidratado com o estado final dos checkboxes.

---

### 3. Campos Auto-Carregados Perdendo Proteção (Fundo Branco em vez de Cinza)
**Sintoma:** Campos que deveriam vir bloqueados pela base de dados (ex: `obs_geral_01` no cadastro mínimo) começam a renderizar com fundo branco, perdendo a classe `.auto-loaded-field` e a propriedade `readOnly`.
**Causa:** Geralmente atrelado ao problema dos "Rascunhos Fantasmas". A trava de proteção em `foco-01.js` (array `minFields`) só aplica as propriedades de bloqueio se detectar que o campo possui valor prévio (`dbState[id] !== ''`). Como o rascunho antigo carregava vazio, o Front-End entendia que o campo precisava ser preenchido do zero, removendo as travas visuais e funcionais.
**Solução:** Idêntica ao problema 1 (limpeza da base de rascunhos para o processo). Ao carregar corretamente os valores preenchidos na base, o Front-End volta a injetar a classe `auto-loaded-field`.

---

### 4. Conflito UTF-8 em Scripts de Automação Windows (PowerShell)
**Sintoma:** Caracteres especiais na interface (`Avançando`, `Brasília`) viram símbolos corrompidos como `AvanÃ§ando` no código após a injeção ou salvamento de arquivos via terminal.
**Causa:** Os comandos nativos do PowerShell (`Set-Content`, `Out-File`) muitas vezes utilizam encondings legado do sistema (`Windows-1252` ou `UTF-16LE`) em vez de UTF-8 sem BOM.
**Solução:** Quando houver necessidade de edições não-manuais no projeto (agentes IA ou scripts), preferir a execução através do ambiente Node.js utilizando os módulos `fs.readFileSync(path, 'utf8')` e `fs.writeFileSync(path, txt, 'utf8')`, garantindo integridade de acentuação nos códigos e HTMLs.


### 5. Corrupção Global de Caracteres Especiais (Acentos)
**Sintoma:** Textos na interface do usuário (como alertas "Avançando para a próxima etapa" e títulos como "Identificação do Imóvel") passaram a exibir o caractere de interrogação ou apresentar as palavras faltando letras (ex: `Imvel`, `prxima`).
**Causa:** Como detalhado no item 4, manipulações feitas por scripts no terminal (PowerShell) utilizando codificações legadas gravaram bytes inválidos nos arquivos UTF-8. Ao serem lidos posteriormente, o sistema converteu esses bytes corrompidos permanentemente no *Unicode Replacement Character* (código `\uFFFD`). Além do texto visível, isso afetou comentários e cabeçalhos de arquivos (BOM UTF-8).
**Solução Aplicada:** Como a corrupção estava espalhada por dezenas de arquivos `.js` e `.html`, a solução manual seria inviável. Foi desenvolvido um script em Node.js (`fix.js`) que realizou uma varredura recursiva em todo o projeto. O script:
1. Detectou arquivos contendo o caractere `\uFFFD`.
2. Utilizou um dicionário de mapeamento para substituir as palavras fragmentadas por suas versões originais (ex: `Identifica\uFFFDo` -> `Identificação`, `Avan\uFFFDando` -> `Avançando`).
3. Limpou cabeçalhos BOM (Byte Order Mark) corrompidos no topo de arquivos como `foco-02.js` e `foco-06.js`.
4. Salvou os arquivos corrigidos forçando o *encoding* estrutural correto (`utf8`).
Após rodar o script, os arquivos foram restaurados com sucesso.
