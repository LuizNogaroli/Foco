# Encapsulamento do Status em Badges no Painel Gerencial

## Problema Relatado
O usuário solicitou que a coluna "Status" na tabela de processos do painel principal (`index.html`) fosse encapsulada dentro de um box (badge) para melhorar o alinhamento visual e a consistência do layout. Ele sugeriu usar uma cor padrão para todos os status por enquanto.

## Soluções Implementadas
* **Criação do Estilo do Badge (`dashboard.css`):** Criamos a classe `.badge-status-foco` que define uma caixa com bordas arredondadas, fundo azul claro e borda delicada, mantendo o estilo visual da SPUnet:
  * Cor de fundo: `#f0f9ff` (azul sutil)
  * Cor do texto: `#0369a1` (azul escuro para alta legibilidade)
  * Borda: `1px solid #bae6fd`
* **Renderização na Tabela (`index.html`):** Alteramos a linha de renderização da coluna "Status" de texto puro para uma tag `<span>` utilizando a classe `.badge-status-foco`.

---

## Estado Anterior (Antes)

### Em `index.html` (Linha 517):
```html
<td style="font-size: 11px; font-weight: 500;">${proc.status.replace(' para complementação', '')}</td>
```

---

## Estado Novo (Depois)

### Em `dashboard.css`:
```css
.badge-status-foco {
    background-color: #f0f9ff; /* azul bem sutil */
    color: #0369a1;            /* azul escuro para leitura */
    border: 1px solid #bae6fd;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
    border-radius: 6px;
    padding: 5px 12px;
    font-size: 11px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
}
```

### Em `index.html` (Linha 517):
```html
<td><span class="badge badge-status-foco">${proc.status.replace(' para complementação', '')}</span></td>
```

---

## Plano de Rollback / Desfazer
1. Reverter o arquivo `index.html` voltando a coluna de status para o texto original sem a tag `<span>`.
2. Remover a classe `.badge-status-foco` de `dashboard.css`.
