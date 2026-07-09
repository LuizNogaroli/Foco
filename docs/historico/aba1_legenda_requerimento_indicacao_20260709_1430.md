# Ajuste de Legenda e Casing do Requerimento/Indicação de Imóvel

## Estado Anterior (Antes)
1. No arquivo [foco-01.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.html), o título superior "Requerimento" era forçado para caixa alta (REQUERIMENTO) via CSS inline:
```html
<div id="label-titulo-requerimento" style="text-align: center; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; font-weight: 700; margin-bottom: 4px;">Requerimento</div>
```

2. No arquivo [processo.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/processo.html), o botão "1" do menu superior continha a legenda "Requerimento":
```html
        <div class="button-wrapper">
            <button class="circle-btn" data-url="foco-01.html">1</button>
            <span class="legend">Requerimento</span>
        </div>
```

## Estado Novo (Depois)
1. Removida a propriedade `text-transform: uppercase` do título superior no arquivo [foco-01.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.html):
```html
<div id="label-titulo-requerimento" style="text-align: center; font-size: 0.85rem; letter-spacing: 0.05em; color: #6b7280; font-weight: 700; margin-bottom: 4px;">Requerimento</div>
```

2. Alterada a legenda do botão 1 para "Indicação de Imóvel" no arquivo [processo.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/processo.html):
```html
        <div class="button-wrapper">
            <button class="circle-btn" data-url="foco-01.html">1</button>
            <span class="legend">Indicação de Imóvel</span>
        </div>
```

## Plano de Rollback / Desfazer
Para reverter as alterações e restaurar as legendas anteriores:
1. No arquivo [foco-01.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.html), adicione novamente a propriedade CSS `text-transform: uppercase;` dentro do atributo `style` da div com id `label-titulo-requerimento`.
2. No arquivo [processo.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/processo.html), localize a tag `<span class="legend">Indicação de Imóvel</span>` do primeiro botão e altere o texto interno de volta para "Requerimento".
