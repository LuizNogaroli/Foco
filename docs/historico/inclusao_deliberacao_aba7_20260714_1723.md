# Histórico de Alterações - Inclusão de Deliberação na Aba 7 e Banners de Devolução

## Resumo da Mudança
Foi incluída uma nova caixa de "Deliberação / Aprovações" na Aba 7 (`aba7.html`) que permite à Chefia dar sequência ao processo ou devolvê-lo, indicando o motivo e a aba de destino. Também foram adicionados "Banners de Devolução" nos formulários `foco-02.html` e `foco-03.html` para exibir a justificativa do retorno, conforme regra de negócio.

## 1. Estado Anterior (Antes)

**Em `aba7.html`:**
O arquivo não possuía nenhum bloco para deliberação, os accordeons terminavam no fechamento da div e a configuração de perfis era:
```html
      </div>

    </section>

<!-- ... -->
    const profilePermissions = {
      'ALL': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'acc_aba4', 'acc_aba5', 'acc_aba6', 'acc_aba7', 'acc_aba8'],
      'SPU_CARACTERIZACAO': ['acc_aba1', 'acc_aba2'], // Exemplo: vê apenas aba 1 e 2
      'SPU_DESTINACAO': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'acc_aba4', 'acc_aba5', 'acc_aba6'],
      'CHEFIA_SPU': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'acc_aba4', 'acc_aba5', 'acc_aba6', 'acc_aba7'],
      // ... demais perfis
    };
```

**Em `foco-02.html` e `foco-03.html`:**
A estrutura começava o form sem nenhum banner:
```html
  <div class="form-container">
    <h2>Análise - Setor de Caracterização</h2>
    <form id="form02" novalidate>
```

## 2. Estado Novo (Depois)

**Em `aba7.html`:**
Foi inserido o bloco `#bloco-deliberacao` e alterado o `profilePermissions`:
```html
      </div>

        <!-- BLOCO DE DELIBERAÇÃO / APROVAÇÕES -->
        <div id="bloco-deliberacao" style="...">
          <!-- Rádios de aprovação/devolução, textareas e seletores -->
        </div>

    </section>

<!-- ... -->
    const profilePermissions = {
      'ALL': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao'],
      'SPU_CARACTERIZACAO': ['acc_aba1', 'acc_aba2'],
      'SPU_DESTINACAO': ['acc_aba1', 'acc_aba2', 'acc_aba3'],
      'CHEFIA_SPU': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao'],
      // ... adicionado 'bloco-deliberacao' aos perfis de liderança
    };
```

**Em `foco-02.html` e `foco-03.html`:**
Foi adicionado o banner de alerta, que inicialmente fica oculto:
```html
  <div class="form-container">
        <!-- Banner de Devolução (Condicional) -->
        <div id="bannerDevolucaoAba..." style="display: none; background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
            <!-- ... -->
        </div>
```

## 3. Plano de Rollback / Desfazer
Para reverter a mudança e restaurar o estado original:

1. **Reverter `aba7.html`**:
   - Abra `aba7.html`.
   - Remova todo o HTML da `div id="bloco-deliberacao"` até a sua tag de fechamento (logo antes de `</section>`).
   - Volte no array `profilePermissions` no final do arquivo e remova o item `'bloco-deliberacao'` de todos os arrays. Mude `allElements` de volta para `allAccs` se desejar consistência total.

2. **Reverter `foco-02.html` e `foco-03.html`**:
   - Abra os arquivos.
   - Encontre `<div class="form-container">`.
   - Remova toda a `div` com `id="bannerDevolucaoAba..."` imediatamente abaixo dela.
