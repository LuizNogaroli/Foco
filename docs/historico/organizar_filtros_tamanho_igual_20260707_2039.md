# Organização dos Filtros por Tamanho Igual (4x2)

Este documento registra a padronização dimensional dos filtros de pesquisa em `index.html` para garantir que todos tenham a mesma largura e altura (tamanho igual) ocupando o layout de 4 colunas por 2 linhas perfeitamente.

## Detalhes da Alteração

Anteriormente, apesar da distribuição em 4 colunas do grid, os elementos de entrada (`<input>` e `<select>`) não possuíam largura total de preenchimento (`100%`) nem modelo de dimensionamento uniforme (`box-sizing`). Adicionalmente, as diferenças nativas de renderização de altura entre selects e inputs textuais causavam desalinhamento vertical.

### Alterações Realizadas

1. **Unificação de Tamanho (`dashboard.css`):**
   - Adicionada a propriedade `width: 100%;` para forçar todos os filtros a ocuparem a largura total da coluna do grid correspondente.
   - Adicionado `height: 42px;` para fixar a altura idêntica para todos os inputs e dropdowns de seleção, independente do tipo de campo ou do navegador utilizado.
   - Adicionado `box-sizing: border-box;` na regra `.filter-group select, .filter-group input` para incluir preenchimento (`padding`) e borda no cálculo da largura e altura totais do elemento.

---

*Log gerado automaticamente para preservação do histórico de desenvolvimento do projeto.*
