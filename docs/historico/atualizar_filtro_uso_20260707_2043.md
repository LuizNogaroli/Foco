# Atualização das Opções do Filtro "Uso Imobiliário"

Este documento registra a substituição das opções antigas do dropdown "Uso Imobiliário" em `index.html` por novos termos voltados à caracterização/natureza física e jurídica das áreas sob gestão da SPU.

## Detalhes da Alteração

### 1. Novo Conjunto de Opções (HTML):
Substituídos os tipos de usos urbanísticos/sociais (Habitacional, Regularização Fundiária, etc.) pelas seguintes opções de caracterização:
- Terreno/acrescido de marinha
- Terreno/acrescido marginal
- Nacional interior
- Espelho d'água
- Cavidades naturais subterrâneas
- Manguezal
- Praias

### 2. Atualização da Regra de Filtragem (JavaScript):
Ajustado o método `applyFilters()` no script interno do `index.html` para buscar correspondências case-insensitive e por substrings associadas no campo `uso` (mapeado de `regime_requerido`):
```javascript
const matchUso = !uso || proc.procUso.includes(uso) || 
                 (uso === 'terreno/acrescido de marinha' && (procUso.includes('marinha') || procUso.includes('acrescido'))) ||
                 (uso === 'terreno/acrescido marginal' && procUso.includes('marginal')) ||
                 (uso === 'nacional interior' && procUso.includes('interior')) ||
                 (uso === 'espelho d\'água' && procUso.includes('espelho')) ||
                 (uso === 'cavidades naturais subterrâneas' && procUso.includes('cavidade')) ||
                 (uso === 'manguezal' && procUso.includes('mangue')) ||
                 (uso === 'praias' && procUso.includes('praia'));
```

---

*Log gerado automaticamente para preservação do histórico de desenvolvimento do projeto.*
