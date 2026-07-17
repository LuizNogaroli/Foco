# Substituição de Tipo de Requerimento por Regime de Destinação no Painel Principal

## Estado Anterior (Antes)
No arquivo [index.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/index.html), o filtro de consulta e o cabeçalho da tabela do dashboard exibiam o termo "Tipo de Requerimento". As opções disponíveis no dropdown continham a lista genérica de requerimentos/serviços:

```html
                <div class="filter-group">
                    <label for="filterTipoRequerimento">Tipo de Requerimento</label>
                    <select id="filterTipoRequerimento" onchange="applyFilters()">
                        <option value="">Todos</option>
                        <option value="Adquirir Imóvel Aforado da União por Remição">Adquirir Imóvel Aforado da União por Remição</option>
                        ...
                    </select>
                </div>
```

E no JavaScript de filtragem:
```javascript
            const tipoReq = document.getElementById('filterTipoRequerimento').value;
            // ...
            const matchTipo = !tipoReq || proc.procedimento === tipoReq;
```

## Estado Novo (Depois)
Substituímos o filtro e a coluna por "Regime de Destinação", populando as opções com a lista completa dos 43 regimes de destinação mapeados no projeto:

```html
                <div class="filter-group">
                    <label for="filterRegimeDestinacao">Regime de Destinação</label>
                    <select id="filterRegimeDestinacao" onchange="applyFilters()">
                        <option value="">Todos</option>
                        <option value="Acordo de Cooperação Técnica para Regularização Fundiária Urbana (ACT-Reurb)">Acordo de Cooperação Técnica para Regularização Fundiária Urbana (ACT-Reurb)</option>
                        ...
                    </select>
                </div>
```

E atualizamos o JavaScript de filtragem para associar ao elemento correspondente:
```javascript
            const regimeDest = document.getElementById('filterRegimeDestinacao').value;
            // ...
            const matchRegime = !regimeDest || proc.procedimento === regimeDest;
```

## Plano de Rollback / Desfazer
Para reverter e retornar ao filtro original de "Tipo de Requerimento":
1. Abra o arquivo [index.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/index.html).
2. Substitua o elemento `<select id="filterRegimeDestinacao">` e suas opções pelo select `<select id="filterTipoRequerimento">` antigo.
3. No cabeçalho da tabela, altere o valor da tag `<th>` de "Regime de Destinação" de volta para "Tipo de Requerimento".
4. Reabasteça o método `applyFilters()` no script para utilizar `filterTipoRequerimento` e restaurar o filtro `matchTipo` original.
