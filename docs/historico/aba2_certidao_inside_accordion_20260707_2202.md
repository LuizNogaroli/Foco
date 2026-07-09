# Vinculação da Certidão de Matrícula ao Acordeão do RIP (Aba 2)

**Data:** 07 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
1. **Remoção da Seção Global:**
   - No arquivo [foco-02.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.html), removi a seção estática e global de upload da `"Certidão atualizada da matrícula"`.

2. **Criação da Seção Dinâmica no RIP:**
   - No arquivo [foco-02.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.js), incorporei a seção de upload da `"Certidão atualizada da matrícula"` diretamente na função `criarBlocoImovel(rip, dados)`.
   - Isso garante que cada RIP tenha o seu próprio input e histórico de arquivos da matrícula independentes.
   - O id e names dos inputs de upload foram parametrizados dinamicamente com base no número de RIP do imóvel (ex: `file_anexo_matricula_${rip}`).

3. **Sincronização Visual de Carregamento:**
   - Adicionei uma chamada de inicialização rápida com `window.updateDocUI` ao final da criação do bloco no JavaScript para que, ao carregar a página com dados pré-existentes do Supabase, o nome do arquivo anexado e os botões de visualizar/excluir sejam atualizados e renderizados imediatamente dentro do acordeão de cada RIP.
