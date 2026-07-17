# Base de Conhecimento: Padrão de Manifestação e Snapshots por Aba

**Data:** 13 de Julho de 2026
**Assunto:** Fluxo de Assinatura Digital e Geração de Snapshots
**Escopo:** Abas 1 (Indicação), 2 (Caracterização) e 3 (Destinação)

## 1. Problema Encontrado
A arquitetura original do Foco-13 baseava-se em um salvamento automático global (`sync.js`) que gravava tudo em uma única coluna JSON `dados_foco`. Isso dificultava o congelamento dos dados (Snapshot) quando um formulário passava por validação hierárquica (ex: Técnico preencheu, Chefia precisa aprovar os dados exatamente como estavam no momento da conclusão).

## 2. Solução Adotada (Arquitetura)

### 2.1 Separação de Ações na UI
Desmembramos o botão final de cada Aba em dois componentes lógicos:
1. **Botão "Salvar"**: Interage com o `sync.js`, salva rascunhos normalmente e aciona a API para persistir o JSON de forma isolada na nova `tabela_relatorios`.
2. **Botão "Manifestação"**: Engatilha o mesmo salvamento, mas adicionalmente carrega um **Modal de Aprovação**.

### 2.2 Tabela de Relatórios (Snapshots)
Foi criada a `tabela_relatorios` no Supabase com a seguinte estrutura:
- `process_id` (Chave Primária composta)
- `aba` (Chave Primária composta - ex: 'aba1', 'aba2', 'aba3')
- `dados_relatorio` (JSONB - Snapshot completo dos campos da aba no momento do salvamento)
- `updated_at` (Timestamp)

*Vantagem:* Mesmo que o usuário continue preenchendo o rascunho global do processo, o documento de visualização do Gestor sempre buscará o Snapshot congelado em `dados_relatorio` da respectiva aba.

### 2.3 Resumos Dinâmicos (`foco-XX-resumo.html`)
Cada aba possui seu relatório de espelho. Estes arquivos HTML (ex: `foco-01-resumo.html`) rodam de forma autônoma (isolada do `formDataState` global), consumindo diretamente a `tabela_relatorios` via `fetch`.
- Eles alimentam um `iFrame` dentro do Modal de Aprovação.
- Eles também comporão o conteúdo da Aba 7 (Painel Gerencial).

### 2.4 Assinatura e PATCH
Ao clicar no botão "Concluir Manifestação", o sistema realiza um método `PATCH` para injetar o bloco de aprovação dentro do JSONB de `dados_relatorio`:
```javascript
ultimoRelatorioSalvo.aprovacao = {
    status: true,
    data: new Date().toISOString(),
    perfil: localStorage.getItem('CURRENT_USER_PROFILE'),
    observacoes: observacoesPreenchidasNoModal
};
```
O documento `foco-XX-resumo.html` ao carregar identifica que `rel.aprovacao.status == true` e instantaneamente renderiza o selo verde de **"Aprovado e Assinado Digitalmente"**.
