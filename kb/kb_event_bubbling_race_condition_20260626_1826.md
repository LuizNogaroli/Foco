# Knowledge Base: Race Condition no Event Bubbling de Iframes (Destruição Prematura de Contexto)

**Data:** 26/06/2026
**Contexto:** Arquitetura de micro-frontends baseada em iframes (Painel Pai controlando a navegação entre Módulos Filhos). O motor de persistência de dados (sync.js) escuta eventos de submissão de formulários em nível de documento (global) para coletar e salvar os dados.

## O Desafio (O "Assassinato" do Motor de Sincronização)
Ao clicar em "Salvar e Avançar", dois *listeners* de evento competiam de forma desleal:
1. O *listener* atrelado diretamente ao formulário HTML (orm.addEventListener).
2. O *listener* global do motor atrelado ao documento HTML (document.addEventListener).

**O fluxo do problema:**
- O JavaScript lida com eventos através do processo de *Bubbling* (Borbulhamento). O evento dispara no elemento alvo (o form) e sobe a árvore do DOM até chegar ao document.
- O *listener* local do form executava a validação, chamava e.preventDefault() (bloqueando a navegação nativa) e executava tnTabNext.click() na janela pai para avançar de aba.
- A janela pai alterava o atributo src do iframe IMEDIATAMENTE.
- Mudar o src do iframe causava o descarregamento (unload) do documento atual.
- Resultado: O evento submit morria antes de atingir o *listener* do document. O motor sync.js nunca era executado, impedindo a coleta e o salvamento dos dados ocultos e não auto-salvos.

## A Solução Arquitetural
Quando a navegação do SPA (Single Page Application) implica na destruição do contexto atual do DOM e existem processos pendentes no topo da árvore de eventos, a navegação não pode ser instantânea.

### Padrão de Atraso Estratégico (Micro-Delay):
Introduzir um *timeout* não perceptível ao usuário, porém suficiente para limpar a pilha de execução (Call Stack) e permitir a conclusão do *Event Bubbling*.

``javascript
// Ruim: Destruição imediata
btnTabNext.click();

// Bom: Permite o bubbling e o encerramento do call stack atual
setTimeout(() => {
    btnTabNext.click();
}, 100);
``

> [!CAUTION]
> **Lição Aprendida:** Em arquiteturas baseadas em iframes onde a troca de view resulta em destruição de DOM (unload), qualquer instrução que altere o src a partir de um evento de formulário deve ocorrer *após* garantir que todos os *listeners* de delegação global (Event Delegation) tenham sido totalmente executados.