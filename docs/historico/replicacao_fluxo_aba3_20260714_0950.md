# Histórico de Alteração - Replicação do Fluxo de Botões na Aba 3 - 20260714_0950

## Descrição
Replicação do fluxo de botões sequenciais progressivos empilhados (Salvar -> Manifestar -> Avançar) da Aba 1 e Aba 2 para a **Aba 3 (Destinação)**. Ajuste das validações de formulário para rolar até o campo inválido e alertar explicitamente o usuário, reposicionando também os botões de Limpar e Imprimir para ficarem abaixo do fluxo principal.

## Estado Anterior (Antes)
Os botões de rodapé na Aba 3 estavam dispostos horizontalmente no bloco `.button-group`, com o botão "Salvar" e "Manifestação" visíveis desde o início. A validação do formulário interrompia a submissão silenciosamente caso algum campo obrigatório não estivesse preenchido.

```html
      <!-- Botões -->
      <div class="button-group" style="margin-top: 40px; display: flex; justify-content: flex-end; gap: 15px; border-top: 1px solid #ccc; padding-top: 20px;">
          <button type="button" class="btn-secondary" id="btnLimpar" style="font-size: 1.1em; padding: 12px 24px; border-radius: 6px;">🗑️ Limpar</button>
          <button type="button" id="btnImprimir" style="font-size: 1.1em; padding: 12px 24px; background-color: #0284c7; color: white; border: none; cursor: pointer;" onclick="window.print()">🖨️ Imprimir</button>
          <button type="button" id="btnSalvarRelatorio" class="btn-action" style="font-size: 1.1em; padding: 12px 24px; background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; color: #334155; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-right: 10px;">💾 Salvar</button>
          <button type="button" id="btnManifestacao" class="btn-action" style="font-size: 1.1em; padding: 12px 24px; background-color: #28a745; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Manifestação ➡</button>
      </div>
```

E no script JS inline da página:
```javascript
async function executarSalvamentoAba3() {
    if (formReq3 && !formReq3.checkValidity()) {
        formReq3.reportValidity();
        return false;
    }
    ...
```

## Estado Novo (Depois)
Os botões principais agora estão empilhados e centralizados (ocupando 50% de largura), aparecendo sequencialmente. Validação de formulário aprimorada com rolagem automática e alerta.

```html
      <!-- Botões Principais Empilhados -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%; max-width: 50%; margin: 30px auto 0 auto; border-top: 1px solid #ccc; padding-top: 30px;">
          <button type="button" id="btnSalvarRelatorio" class="btn-action" style="width: 100%; font-size: 1.1em; padding: 12px 24px; background-color: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 6px; color: #334155; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">💾 Salvar Formulário</button>
          <button type="button" id="btnManifestacao" class="btn-action" style="display: none; width: 100%; font-size: 1.1em; padding: 12px 24px; background-color: #f59e0b; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">📝 Registrar Manifestação</button>
          <button type="button" id="btnEnviarPainel" class="btn-action" style="display: none; width: 100%; font-size: 1.1em; padding: 12px 24px; background-color: #28a745; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">Concluir Processo e ir para Painel Gerencial ➡</button>
      </div>

      <!-- Ações Extras (Limpar/Imprimir) -->
      <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
          <button type="button" class="btn-secondary" id="btnLimpar" style="font-size: 0.9em; padding: 8px 16px; border-radius: 6px;">🗑️ Limpar Formulário</button>
          <button type="button" id="btnImprimir" style="font-size: 0.9em; padding: 8px 16px; border-radius: 6px; background-color: #0284c7; color: white; border: none; cursor: pointer;" onclick="window.print()">🖨️ Imprimir</button>
      </div>
```

E no script JS inline:
```javascript
async function executarSalvamentoAba3() {
    if (formReq3 && !formReq3.checkValidity()) {
        formReq3.reportValidity();
        const invalidField = formReq3.querySelector(':invalid');
        if (invalidField) {
            invalidField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        alert("Atenção: Existem campos obrigatórios não preenchidos. Por favor, revise o formulário e preencha-os antes de salvar.");
        return false;
    }
    ...
```

## Plano de Rollback / Desfazer
Para reverter estas alterações na Aba 3:
1. Abra o arquivo `foco-03.html`.
2. Delete o bloco `div` com id/classe contendo "Botões Principais Empilhados".
3. Delete o bloco `div` "Ações Extras (Limpar/Imprimir)".
4. Adicione novamente o bloco original do `.button-group` com os botões dispostos lado a lado.
5. No script JS inline da página, localize a função `executarSalvamentoAba3` e remova a lógica de `invalidField.scrollIntoView` e o `alert()`.
6. Altere a lógica dos listeners para não manipularem a exibição do botão de manifestação (`btnManifestacao3.style.display = 'block'`) nem o botão de enviar ao painel.
7. Salve o arquivo.
