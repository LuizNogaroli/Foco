# Atualização Dinâmica do Título da Aba 1 (Tipo de Requerimento)

**Data:** 08 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
1. **Atribuição de ID no Título (foco-01.html):**
   - Modifiquei a tag `<h2>Requerimento</h2>` para `<h2 id="titulo-pagina-requerimento">Requerimento</h2>` no topo da página.

2. **Lógica de Atualização Dinâmica (foco-01.js):**
   - Alterei o listener de mensagem e o intervalo de verificação para ler a propriedade `procedimento` (que contém a descrição do Tipo de Requerimento) de dentro do estado global do processo.
   - Assim que os dados são carregados do Supabase, o elemento é atualizado para exibir o formato: `"Requerimento: [Nome do Tipo de Requerimento]"`, mantendo os mesmos estilos, alinhamentos e cores originais.
