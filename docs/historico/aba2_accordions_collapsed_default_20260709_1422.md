# Configuração dos Accordions Colapsados por Padrão na Aba 2

## Estado Anterior (Antes)
No arquivo [foco-02.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.js), os templates HTML dos accordions de RIP e Cadastro Mínimo eram renderizados com o ícone de seta para cima (`▲`) e estilo de exibição visível (`display: block`):

*Para RIP:*
```javascript
        <div class="accordion-header type-rip" ...>
            ...
            <span class="accordion-icon" ...>▲</span>
        </div>
        <div class="accordion-content" style="display: block; padding: 16px;">
```

*Para Cadastro Mínimo:*
```javascript
        <div class="accordion-header type-cadastro" ...>
            ...
            <span class="accordion-icon" ...>▲</span>
        </div>
        <div class="accordion-content" style="display: block; padding: 16px;">
```

## Estado Novo (Depois)
Alteramos os templates para usarem a seta indicadora para baixo (`▼`) e o estilo oculto (`display: none`):

*Para RIP:*
```javascript
        <div class="accordion-header type-rip" ...>
            ...
            <span class="accordion-icon" ...>▼</span>
        </div>
        <div class="accordion-content" style="display: none; padding: 16px;">
```

*Para Cadastro Mínimo:*
```javascript
        <div class="accordion-header type-cadastro" ...>
            ...
            <span class="accordion-icon" ...>▼</span>
        </div>
        <div class="accordion-content" style="display: none; padding: 16px;">
```

## Plano de Rollback / Desfazer
Para reverter essa alteração e fazer com que os accordions voltem a abrir expandidos por padrão:
1. Abra o arquivo [foco-02.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-02.js).
2. Vá até as linhas correspondentes aos templates de RIP e de Cadastro Mínimo.
3. Altere o caractere do ícone de `▼` de volta para `▲`.
4. Altere a propriedade CSS inline `display: none;` para `display: block;` na div `.accordion-content` correspondente aos dois templates.
