# Correção: Carga de Arquivos em todos os Requerimentos (tabela_requerimentos)

**Data:** 07 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Contexto
O usuário esclareceu que a tabela a receber a carga de documentos anexados reais era a `tabela_requerimentos` (processos/requerimentos) e não a `tabela_spu` (imóveis/rips).

## Ações Realizadas
1. **Atualização da Lógica do Visualizador de Documentos:**
   - No arquivo [foco-01.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.js), atualizei a função `renderDocumentos` e o vinculador de eventos DOM para capturar o atributo `data-url` dos botões `👁️ Visualizar`.
   - Se o link for válido (ou seja, diferente de `#`), o arquivo agora abre em uma nova aba (`window.open(url, '_blank')`). Caso contrário, ele cai de volta na simulação padrão ("Isso é uma simulação").

2. **Migração e Atualização da Carga de Dados no Banco:**
   - Desenvolvi e executei o script [patch_requerimentos.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/scratch/patch_requerimentos.js) que mapeia os documentos de todos os 20 requerimentos para os PDFs mockados presentes no projeto:
     - *Requerimento inicial* -> `PDF_1_Nononononononono.pdf`
     - *Contrato social / Estatuto* -> `PDF_2_Nononononononono.pdf`
     - *Identificação do representante* -> `PDF_3_Nononononononono.pdf`
     - *Procuração* -> `PDF_4_Nononononononono.pdf`
     - *Comprovante de situação cadastral* -> `PDF_5_Nononononononono.pdf`
   - O script executou com sucesso e atualizou todas as linhas correspondentes no Supabase.

3. **Atualização de Scripts de Seed:**
   - Modifiquei o arquivo [seed_20_foco11_v4.sql](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/seed_20_foco11_v4.sql) para refletir estes novos URLs em vez de `#`.
   - Modifiquei o arquivo [seed-supabase.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/seed-supabase.js) para apontar para `PDF_1...` e `PDF_2...`.
