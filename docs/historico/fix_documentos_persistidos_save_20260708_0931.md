# Correção na Persistência de Documentos Anexados (Aba 1)

**Data:** 08 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Diagnóstico do Bug
- **Sintoma:** Os documentos anexados ao requerimento `PR2026001` (e outros) desapareciam do banco de dados após ações de salvamento automático ou transições de abas que acionavam persistência de rascunhos.
- **Causa:** No arquivo [db.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/db.js), a função `executeSaveDraft()` monta o payload `reqPayload` para atualizar o registro correspondente em `tabela_requerimentos`. No entanto, a propriedade `documentos_anexados` não havia sido mapeada dentro deste objeto, fazendo com que a API PATCH sobrescrevesse a coluna `dados_json` sem a chave de arquivos anexados (removendo-a silenciosamente).

## Correção Aplicada
1. **Preservação de Documentos no Payload:**
   - Adicionei a chave `documentos_anexados: payload.documentos_anexados || []` no mapeamento de `reqPayload` em [db.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/db.js).
   - Agora, qualquer atualização na Aba 1 ou transição de tela preservará integralmente a lista de documentos já cadastrados.

2. **Restauração do Requerimento PR2026001:**
   - Reexecutei o script de saneamento para devolver o arquivo `PDF_1_Nononononononono.pdf` ao requerimento `PR2026001`, que agora não sumirá em refreshes subsequentes.
