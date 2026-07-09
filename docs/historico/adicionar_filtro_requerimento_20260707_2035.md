# Adição do Filtro "Tipo de Requerimento"

Este documento registra a implementação de um novo filtro por tipo de requerimento na página principal (`index.html`) para permitir filtrar os processos de acordo com o serviço/regime solicitado.

## Detalhes da Implementação

1. **Estrutura HTML (`index.html`):**
   - Inserido o elemento `<select id="filterTipoRequerimento">` no painel de filtros, ao final da segunda linha (ao lado de *Uso Imobiliário*).
   - As opções foram ordenadas de forma crescente (alfabética) com a opção inicial "Todos" para redefinir o filtro:
     - Adquirir Imóvel Aforado da União por Remição
     - Alterar Regime ou Contrato de Utilização de Imóvel da União
     - Autorização de passagem em imóveis da União
     - Entrega para Aquicultura
     - Enviar Proposta de Aquisição de Imóvel da União
     - Obter a Gestão Municipal de Praias Marítimas
     - Obter Autorização de Obras em Imóvel da União
     - Obter Cessão de Uso de Espaço Físico em Águas Públicas
     - Obter Permissão de Uso para Eventos em Imóvel da União
     - Regularizar Utilização de Imóvel da União
     - Solicitar Adesão ao Projeto Orla
     - Solicitar imóvel para uso da Administração Pública e Entidades sem Fins Lucrativos

2. **Lógica de Filtro em Javascript (`index.html`):**
   - Captura do valor selecionado no dropdown através da constante `tipoReq` no método `applyFilters()`.
   - Inclusão da regra condicional `matchTipo` na filtragem do array local `allProcesses`:
     ```javascript
     const matchTipo = !tipoReq || proc.procedimento === tipoReq;
     ```
   - Atualização do retorno da função de filtro para incluir `matchTipo`.

---

*Log gerado automaticamente para preservação do histórico de desenvolvimento do projeto.*
