# Ajuste na Largura e Quebra de Linha das Badges de Status

## Problema Relatado
O usuário solicitou que as novas caixas (badges) de status no Painel Gerencial possuíssem uma largura padrão fixa com quebra automática de linha para o texto, mantendo as células da tabela do painel simétricas e alinhadas.

## Soluções Implementadas
* **Alteração no CSS (`dashboard.css`):**
  * Definimos uma largura fixa (`width: 170px`) para a classe `.badge-status-foco`.
  * Removemos a propriedade `white-space: nowrap` para que os status longos (como "Aguardando Diagnóstico de Imóvel") quebrem linha automaticamente dentro do box.
  * Adicionamos `text-align: center` e ajustamos `line-height: 1.3` para garantir uma leitura agradável do texto quando quebrado em múltiplas linhas.
  * Ajustamos levemente o padding vertical para `6px` para acomodar melhor a quebra de linha.

---

## Estado Anterior (Antes)

### Em `dashboard.css`:
```css
.badge-status-foco {
    background-color: #f0f9ff;
    color: #0369a1;
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
    padding: 6px 12px;
    font-size: 11px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 170px;              /* largura padrão fixa */
    text-align: center;
    line-height: 1.3;
}
```

---

## Plano de Rollback / Desfazer
1. Reverter o arquivo `dashboard.css` na classe `.badge-status-foco` para o estado sem o `width` fixo e recolocando `white-space: nowrap`.
