# Remoção da opção "Não se aplica" no campo CPF/CNPJ na Aba 3

## Estado Anterior (Antes)
No arquivo [foco-03.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-03.html), o campo de triagem de regularidade do CPF/CNPJ do destinatário possuía três opções ("Sim", "Não" e "Não se aplica"):
```html
      <div class="form-group editavel">
          <label>CPF/CNPJ regular?</label>
          <div class="radio-group">
              <label class="radio-option"><input type="radio" name="cpf_cnpj_regular" value="Sim" required> Sim</label>
              <label class="radio-option"><input type="radio" name="cpf_cnpj_regular" value="Não"> Não</label>
              <label class="radio-option"><input type="radio" name="cpf_cnpj_regular" value="Não se aplica"> Não se aplica</label>
          </div>
      </div>
```

## Estado Novo (Depois)
Removemos a opção "Não se aplica", deixando apenas as alternativas binárias ("Sim" ou "Não"):
```html
      <div class="form-group editavel">
          <label>CPF/CNPJ regular?</label>
          <div class="radio-group">
              <label class="radio-option"><input type="radio" name="cpf_cnpj_regular" value="Sim" required> Sim</label>
              <label class="radio-option"><input type="radio" name="cpf_cnpj_regular" value="Não"> Não</label>
          </div>
      </div>
```

## Plano de Rollback / Desfazer
Para restaurar a opção "Não se aplica":
1. Abra o arquivo [foco-03.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-03.html).
2. Localize o elemento `<div class="radio-group">` contido dentro do campo com a pergunta `CPF/CNPJ regular?`.
3. Reinsira a linha `<label class="radio-option"><input type="radio" name="cpf_cnpj_regular" value="Não se aplica"> Não se aplica</label>` logo abaixo da opção "Não".
