# Criação da Seção "Incidência ambiental" na Aba 2

## Estado Anterior (Antes)
No arquivo [foco-02.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.html), o campo "Há incidência ambiental identificada?" e seus elementos filhos estavam embutidos diretamente no contêiner `<div id="secao-ocupacao">` e não possuíam uma seção própria:

```html
              <!-- Uso específico atual -->
              <div class="form-group editavel">
                <label for="campo33">Uso específico atual:</label>
                <select id="campo33" name="tipo_uso_especifico_atual" disabled>
                  <option value="">Selecione primeiro o uso imobiliário atual...</option>
                </select>
              </div>
            </div>

            <!-- ==================== INCIDÊNCIA AMBIENTAL ==================== -->
            <div class="form-group editavel">
              <label>Há incidência ambiental identificada?</label>
              ...
            </div>
        </div>
```

## Estado Novo (Depois)
Fechamos o contêiner `<div id="secao-ocupacao">` logo após a div do uso atual e criamos a nova seção `<div id="secao-incidencia-ambiental">` com o título correspondente:

```html
              <!-- Uso específico atual -->
              <div class="form-group editavel">
                <label for="campo33">Uso específico atual:</label>
                <select id="campo33" name="tipo_uso_especifico_atual" disabled>
                  <option value="">Selecione primeiro o uso imobiliário atual...</option>
                </select>
              </div>
            </div>
        </div>

        <!-- ==================== INCIDÊNCIA AMBIENTAL ==================== -->
        <div id="secao-incidencia-ambiental">
            <h4 style="margin: 24px 0 16px 0; color: #0056b3; border-bottom: 2px solid #ddd; padding-bottom: 8px;">
              Incidência ambiental
            </h4>

            <div class="form-group editavel">
              <label>Há incidência ambiental identificada?</label>
              ...
            </div>
        </div>
```

## Plano de Rollback / Desfazer
Para reverter essa alteração e retornar o campo "Há incidência ambiental identificada?" para dentro da seção de Ocupação:
1. Abra o arquivo [foco-02.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.html).
2. Localize a tag de abertura `<div id="secao-incidencia-ambiental">` e seu respectivo cabeçalho `<h4>Incidência ambiental</h4>`.
3. Remova a tag de fechamento `</div>` correspondente de `secao-ocupacao` que foi adicionada acima dela.
4. Delete a estrutura do contêiner `<div id="secao-incidencia-ambiental">` e o título `<h4>`.
5. Garanta que o campo `form-group` de incidência ambiental volte a ficar dentro da div `secao-ocupacao` e remova a div extra que fechava a ocupação prematuramente.
