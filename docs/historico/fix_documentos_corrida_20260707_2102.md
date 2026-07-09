# Correção de Race Condition no Carregamento de Documentos (Aba 1)

**Data:** 07 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Sintoma / Causa Raiz
Os arquivos (documentos anexados) não estavam renderizando no iframe da Aba 1 (`foco-01.html`) para alguns usuários/requerimentos.
* **Causa Raiz:** O evento `DATABASE_LOADED` era enviado via `postMessage` a partir do `db.js` na página-mãe. Porém, devido ao carregamento assíncrono das páginas, o iframe da Aba 1 às vezes terminava de carregar e registrar o listener de mensagens *depois* que o banco de dados já havia carregado e emitido o `postMessage`. O evento era então perdido e a tabela permanecia com o placeholder vazio ("Nenhum documento anexado encontrado.").

## Correções Aplicadas
1. **Mapeamento no Banco de Dados:**
   - Confirmou-se via script de verificação que as chaves de documentos no banco estavam corretas após a carga.

2. **Poler e Fallback no Iframe (foco-01.js):**
   - Adicionou-se uma rotina de checagem/polling (`setInterval`) que busca no estado global da página parent (`window.parent.formDataState.documentos_anexados`) a cada 200ms.
   - Assim que detecta a presença da lista de documentos (caso ela já tenha sido carregada anteriormente e o `postMessage` tenha sido perdido), a lista é renderizada imediatamente.
   - O listener de `message` foi mantido por segurança e atualizado com um flag `docsRendered` para evitar dupla renderização ou conflitos.
