# Exibição Condicional de Observações para CPF/CNPJ Irregular na Aba 3

## Estado Anterior (Antes)
No arquivo [foco-03.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-03.html), ao selecionar a opção "Não" para o campo de regularidade do CPF/CNPJ, nenhum campo adicional de observações ou detalhamento era exibido.

## Estado Novo (Depois)
1. Adicionamos a div `#bloco-cpf-cnpj-irregular-obs` contendo uma textarea abaixo do rádio para detalhamento da irregularidade:
```html
          <!-- Campo de Observações exibido se "Não" -->
          <div id="bloco-cpf-cnpj-irregular-obs" style="display: none; flex-direction: column; gap: 6px; margin-top: 8px;">
              <label for="obs_cpf_cnpj_irregular">Observações (CPF/CNPJ irregular):</label>
              <textarea id="obs_cpf_cnpj_irregular" name="obs_cpf_cnpj_irregular" placeholder="Descreva as irregularidades identificadas no CPF/CNPJ..."></textarea>
          </div>
```

2. Implementamos a lógica correspondente no script para monitorar o rádio e exibir/esconder o bloco dinamicamente, além de redefinir o campo caso mude para "Sim":
```javascript
  // Lógica de exibição das observações de CPF/CNPJ irregular
  function checkCpfCnpjRegular() {
    const checked = document.querySelector('input[name="cpf_cnpj_regular"]:checked');
    const bloco = document.getElementById('bloco-cpf-cnpj-irregular-obs');
    if (bloco) {
      const exibir = checked && checked.value === 'Não';
      bloco.style.display = exibir ? 'flex' : 'none';
      if (!exibir) {
        const txt = document.getElementById('obs_cpf_cnpj_irregular');
        if (txt) txt.value = '';
      }
    }
  }
  document.querySelectorAll('input[name="cpf_cnpj_regular"]').forEach(radio=>{
    radio.addEventListener('change', checkCpfCnpjRegular);
  });
  setTimeout(checkCpfCnpjRegular, 500);
```

## Plano de Rollback / Desfazer
Para reverter as alterações:
1. Abra o arquivo [foco-03.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-03.html).
2. Exclua o bloco HTML `<div id="bloco-cpf-cnpj-irregular-obs" ...>...</div>`.
3. No script de inicialização, remova a função `checkCpfCnpjRegular` e seus respectivos event listeners anexados à `cpf_cnpj_regular`.
