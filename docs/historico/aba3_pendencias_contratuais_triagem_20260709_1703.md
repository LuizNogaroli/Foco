# Triagem e Exibição Condicional de Pendências Contratuais na Aba 3

## Estado Anterior (Antes)
No arquivo [foco-03.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-03.html), o campo de pendências contratuais exibia diretamente um grupo de checkboxes, incluindo a opção "Nenhuma identificada", e controlava a exibição do bloco de observações usando a função inline `toggleNenhumaPendencia(this)`:
```html
          <label>Pendências contratuais identificadas (Ativas ou não):</label>
          <div class="checkbox-group" ...>
              <label class="checkbox-option"><input type="checkbox" name="pendencias[]" value="Nenhuma identificada" onchange="toggleNenhumaPendencia(this)"> Nenhuma identificada</label>
              ...
          </div>
```

## Estado Novo (Depois)
1. Substituímos a exibição direta por uma pergunta de rádio (Sim/Não) `"Há pendências contratuais identificadas?"`:
```html
          <label>Há pendências contratuais identificadas?</label>
          <div class="radio-group" style="display: flex; gap: 32px; margin-bottom: 10px;">
              <label class="radio-option"><input type="radio" name="ha_pendencias_contratuais" value="Sim"> Sim</label>
              <label class="radio-option"><input type="radio" name="ha_pendencias_contratuais" value="Não"> Não</label>
          </div>
```

2. Agrupamos os checkboxes na div oculta `#bloco-pendencias-itens` excluindo a opção "Nenhuma identificada":
```html
          <div id="bloco-pendencias-itens" style="display: none; margin-top: 10px;">
              ...
          </div>
```

3. Implementamos no JavaScript a função `checkPendenciasContratuais` que gerencia de forma integrada a visibilidade:
   - Se "Sim" for selecionado, mostra as opções de pendências.
   - Se "Não" for selecionado, desmarca todas as pendências, limpa a textarea e esconde os blocos secundários.
   - Se pelo menos uma pendência for selecionada (multiseleção), exibe a textarea `#bloco-obs-pendencias`.

## Plano de Rollback / Desfazer
Para reverter esta alteração e retornar ao modelo de checkboxes diretos anterior:
1. Abra o arquivo [foco-03.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-03.html).
2. Substitua o bloco HTML de pendências contratuais pelo modelo original (conforme a seção "Estado Anterior"), incluindo o `onchange="toggleNenhumaPendencia(this)"` nas opções e a alternativa "Nenhuma identificada".
3. No bloco de scripts do arquivo, reverta a função `checkPendenciasContratuais` e os event listeners correspondentes pela declaração antiga da função `toggleNenhumaPendencia(checkbox)`.
