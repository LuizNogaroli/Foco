# Correção do Mapeamento do Valor de Avaliação (Aba 2)

**Data:** 07 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
1. **Correção de Divergência de Nomenclatura:**
   - No arquivo [foco-02.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.js), identifiquei que a chave de mapeamento `valor_avaliado` estava apontando incorretamente para o DOM field-key `valor_avaliado`.
   - O campo correspondente na interface (gerado pela função `buildField`) possui a chave `valor_avaliacao` (e não `valor_avaliado`).
   - Alterei o mapeamento no objeto `MAPA_CAMPOS` para:
     `'valor_avaliado': 'valor_avaliacao'`

2. **Efeito Imediato:**
   - Ao corrigir esse mapeamento, o campo `"Valor da Avaliação (R$)"` passa a ser reconhecido pelo script de carregamento e travamento do SPU. 
   - Caso venha em branco no Datalake SPU, o campo agora ficará corretamente travado como cinza e exibirá o placeholder vermelho de dado ausente.
