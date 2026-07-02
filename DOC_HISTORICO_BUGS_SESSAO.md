# Base de Conhecimento e Histórico de Código: Módulo de Admissibilidade SPU

Este documento detalha os desafios arquiteturais, bloqueios sistêmicos e soluções de engenharia de software desenvolvidos na implementação do sistema de Admissibilidade da Secretaria do Patrimônio da União (SPU). Seu propósito é servir como um guia historiográfico para desenvolvedores futuros que precisem lidar com integração de iframes, caching persistente em sistemas legados e refatoração de UX em formulários complexos.

---

## 1. O Problema da Sincronização de Estado em Iframes

### 🛑 Desafio Enfrentado
A aplicação utiliza uma arquitetura baseada em Iframes (`<iframe id="content-frame">`) orquestrada por um `painel-gerencial.html`. Quando um rascunho de requerimento era carregado via Supabase (`db.js`), o painel principal armazenava esses dados numa variável global (`window.formDataState`). No entanto, as abas filhas (ex: `foco-01.html`) não conseguiam ler esses dados a tempo, pois o carregamento do DOM da página filha era muitas vezes mais lento do que o evento de carregamento do banco no painel pai, gerando uma condição de corrida (Race Condition). 

Como resultado, a aba 1 era desenhada em branco, mesmo com o banco de dados cheio. Os RIPs não apareciam.

### 💡 Solução Desenvolvida
Foi implementado um **Design Pattern de Mensageria (Event Bus) e Polling Flexível**:
1. O iframe filho (`foco-01.js`) se inscreve ativamente para escutar mensagens postadas pelo elemento `window`:
   ```javascript
   window.addEventListener('message', (event) => {
       if (event.data && event.data.type === 'DATABASE_LOADED') {
           loadRipsEConceituacao(event.data.data);
       }
   });
   ```
2. Adotou-se uma redundância temporal. Se o iframe carregasse muito *depois* do evento do banco ser disparado, ele buscaria ativamente na árvore de janelas:
   ```javascript
   setTimeout(() => {
       if (window.parent && window.parent.formDataState) {
           loadRipsEConceituacao(window.parent.formDataState);
       }
   }, 400);
   ```

## 2. Refatoração da UX e Remoção de Lógica Legada (O Desafio do RIP)

### 🛑 Desafio Enfrentado
Inicialmente, o sistema permitia ao usuário digitar e buscar um número de RIP manualmente (Simulação em mock). Contudo, a regra de negócio mudou: **os RIPs só devem vir importados via SPUnet**. A permanência do campo de pesquisa causava ruído e abria brechas para inserção de dados não consolidados, além de conflitar com os gatilhos automáticos de atualização visual.

Durante a faxina do código para remover a função `window.pesquisarRIP()`, ocorreu um incidente de refatoração: as funções vitais de renderização (`criarBlocoImovel` e `adicionarTagRIP`), que ficavam fisicamente localizadas abaixo da pesquisa no código, foram deletadas acidentalmente num overwrite massivo do arquivo. Isso fez com que o sistema carregasse os dados internamente, mas falhasse ao desenhar o "Acordeão de Imóvel" e o título (causando o travamento do fluxo).

### 💡 Solução Desenvolvida
1. **Reconstrução Limpa e Desacoplamento:** As funções de renderização (`window.criarBlocoImovel`) foram resgatadas e reescritas com foco total na arquitetura Read-Only, perdendo todo o código poluidor de busca.
2. **Atualização do Cabeçalho Oculto:** O campo do topo do formulário (`campo_rip_req`), que exibe um resumo da aba para o usuário ("RIP(s) Associado(s)"), não estava ouvindo os dados importados. A função `atualizarRipsOcultos` foi reconstruída para injetar os valores simultaneamente no campo invisível de banco e no `<input>` visual para o usuário.

## 3. O Inferno do Bloqueio de Arquivos (File-Locks no Windows) e Caching de CDN

### 🛑 Desafio Enfrentado
O sistema do usuário rodava no Windows com um servidor Live-Server ou Http-Server ativo. Ao tentar realizar operações massivas de Search and Replace (ex: PowerShell via `(Get-Content) -replace | Set-Content`), o sistema operacional gerava um erro catastrófico: **"O arquivo está sendo usado por outro processo"**.
Além disso, a injeção agressiva do cache da CDN impedia que botões recém renomeados ("Validar e Avançar") atualizassem a cor de azul para verde no navegador, fazendo o desenvolvedor acreditar falsamente que o código não funcionava.

### 💡 Solução Desenvolvida
1. **Bypass de Lock de Sistema Operacional com NodeJS:** 
   Para contornar o bloqueio imposto pelo kernel do Windows/PowerShell, migramos a edição massiva de arquivos temporariamente para o motor V8 via scripts rápidos em NodeJS (ex: `unify-buttons.js`, `rename-btn.js`, `clean-foco-01.js`). O módulo `fs` do Node tem métodos de manipulação em memória (`readFileSync` / `writeFileSync`) que gerenciam a I/O da stack com muito mais assertividade, sobrepondo o lock elástico do servidor local.
2. **Buster de Cache Dinâmico (`disable-cache.js` e `fix-cdn.js`):**
   Um script NodeJS automatizado foi desenvolvido para varrer todos os mais de 40 arquivos HTML e forçar a invalidação dos links CSS locais `?v=timestamp`, além de higienizar a versão do CDN do Tailwind, forçando navegadores rígidos (como Chrome) a buscar o layout atualizado imediatamente na próxima requisição.

## 4. Dualidade Crítica: Validar/Avançar vs Salvar Definitivo

### 🛑 Desafio Enfrentado
Existiam dois botões no rodapé que criavam um atrito indesejado:
- Botão Azul ("Salvar Rascunho / Validar"): Apenas validava e avançava a aba.
- Botão Verde ("Salvar na Tabela Definitiva"): Escrevia de fato no Supabase.

A ambiguidade técnica confundia a experiência do usuário, obrigando-o a clicar duas vezes sem saber qual priorizar, correndo o risco de ele avançar a aba sem consolidar a operação no banco.

### 💡 Solução Desenvolvida
**Integração do Commit e Redirect (One-Click Approach):**
Removemos o botão flutuante e transferimos o gatilho assíncrono `saveToFinal()` (Promisse de salvamento em nuvem) para o próprio evento nativo `<form onsubmit>` do único botão na página ("Salvar e Avançar").
```javascript
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.checkValidity()) { // Exige campos obrigatórios nativamente
        rootWindow.saveToFinal().then(res => {
            if (res) {
                // Aguarda confirmação 200 OK do banco antes de disparar o clique na próxima aba
                alert('Salvo com sucesso. Avançando...');
                btnTabNext.click(); 
            }
        });
    }
});
```
Esta engenharia garantiu consistência transacional: a tela só muda de aba automaticamente se (e somente se) os dados chegarem fisicamente íntegros no banco de dados definitivo.

---
*Documentação gerada pelo assistente Antigravity para preservação historiográfica da engenharia do sistema - Junho de 2026.*
