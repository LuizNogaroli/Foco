# Atualização dos Documentos do RIP 2026001 na tabela_spu

**Data:** 07 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Contexto
O usuário solicitou que fosse inserido ao menos um documento de exemplo para o RIP `2026001` dentro de `tabela_spu` (similar aos demais RIPs) para garantir que a seção/box de documentos anexados não ficasse vazia.

## Ações Realizadas
1. **Investigação do Banco:**
   - Verificou-se que o banco de dados SPUnet armazena dados de imóveis livres na tabela `tabela_spu` dentro da coluna `dados_json`.
   - Outros RIPs usam a chave `docs_custom_links_aba2_1` para apontar para a Certidão de Matrícula (ex: `https://extranet.spunet.gov.br/documentos/2026003_certidao_matricula.pdf`).

2. **Atualização Direta no Supabase:**
   - Foi criado e executado um script temporário Node.js (`scratch/patch_spu_2026001.js`) que atualizou o registro de RIP `2026001` na `tabela_spu`.
   - Adicionou-se com sucesso as chaves de documentos customizados (`docs_custom_files_aba2_1` e `docs_custom_links_aba2_1`) juntamente com uma entrada no array `documentos_anexados` para robustez:
     ```json
     {
       "docs_custom_files_aba2_1": "",
       "docs_custom_links_aba2_1": "https://extranet.spunet.gov.br/documentos/2026001_certidao_matricula.pdf",
       "documentos_anexados": [
         {
           "nome": "Certidão de Matrícula",
           "url": "https://extranet.spunet.gov.br/documentos/2026001_certidao_matricula.pdf"
         }
       ]
     }
     ```

3. **Garantia de Persistência em Seeders:**
   - Atualizou-se o seeder principal `seed_tabela_spu.js` para garantir que, caso o banco precise ser repovoado no futuro, os campos de documentos sejam criados automaticamente para todos os 20 RIPs de teste.
   - Atualizou-se o script específico `scripts/update_spu_2026001.js` com os mesmos campos.
