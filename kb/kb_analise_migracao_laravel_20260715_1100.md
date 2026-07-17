# Análise de Migração: Supabase/JS → Laravel/PostgreSQL

**Data:** 15 de Julho de 2026
**Contexto:** Discussão sobre viabilidade e vantagens de migrar o Foco-13 para uma stack mais robusta para produção.

---

## 1. Situação Atual

- **Stack atual:** HTML/CSS/JS vanilla + Supabase (PostgreSQL via REST API)
- **Status:** Protótipo funcional com fluxo de aprovação completo (6 níveis), devoluções, versionamento de dados e geração de PDF
- **Ponto forte:** Validou regras de negócio, UX e fluxo administrativo

---

## 2. O Que o Protótipo Atual Resolve Bem

| Aspecto | Avaliação |
|---|---|
| Validação de UX | ✅ Excelente — interface testada com usuários |
| Regras de negócio | ✅ Fluxo de aprovação mapeado e funcionando |
| Prototipagem rápida | ✅ Entregou funcionalidade em pouco tempo |
| Custo inicial | ✅ Baixo — sem servidor, sem infraestrutura |

---

## 3. Limitações do Protótipo para Produção

### 3.1 Segurança

- **Chaves de API expostas no frontend:** Qualquer pessoa com F12 visualiza as credenciais do Supabase
- **Sem autenticação server-side:** O controle de perfil é feito via `localStorage` (manipulável pelo usuário)
- **Sem validação de permissões no servidor:** Um usuário malicioso pode fazer chamadas diretas à API

### 3.2 Controle de Fluxo (Workflow)

- **Checkpoint manual:** Cada nível de aprovação requer código JS específico para salvar o próximo checkpoint
- **Sem máquina de estados formal:** O fluxo é "hardcoded" nas funções `salvarChefia()`, `salvarCoord()`, etc.
- **Dificuldade para adicionar novos níveis:** Cada novo nível exige criar bloco HTML + função JS + atualizar `applyProfileView`

### 3.3 Auditoria e Rastreabilidade

- **Sem log de ações:** Não sabemos quem fez o quê e quando (além da deliberação)
- **Sem trilha de alterações:** Se alguém editar um campo da Aba 1, não há registro de quem editou
- **Versionamento implementado ontem:** Funcional, mas manual e suscetível a falhas

### 3.4 Manutenibilidade

- **Código duplicado:** Funções de salvamento repetidas em cada aba (foco-01.js, foco-02-v2.js, foco-03.html)
- **Sem tipagem:** JavaScript puro, sem validação de tipos
- **Sem testes automatizados:** Qualquer alteração pode quebrar algo em outro lugar
- **Acoplamento forte entre frontend e banco:** Mudanças no schema do Supabase quebram múltiplos arquivos

---

## 4. Vantagens da Migração para Laravel + PostgreSQL

### 4.1 Segurança (Crítico para Sistema Governamental)

| Recurso | Supabase/JS | Laravel |
|---|---|---|
| Credenciais | Expostas no HTML | Protegidas no servidor |
| Autenticação | localStorage (manipulável) | Session/JWT com hash de senha |
| Autorização | Select HTML + JS | Middleware + Policies + Gates |
| Validação de dados | Frontend apenas | Backend + Frontend (dupla validação) |
| Proteção contra SQL Injection | Dependente do Supabase | Eloquent ORM (proteção nativa) |
| Proteção CSRF | Não aplicável | Token CSRF em todos os formulários |

### 4.2 Workflow Engine (Máquina de Estados)

Laravel permite implementar um fluxo de aprovação formal:

```php
// Exemplo com State Machine
enum StatusProcesso: string
{
    case AguardandoChefia = 'aguardando_chefia';
    case AguardandoCoordenacao = 'aguardando_coordenacao';
    case AguardandoSuperintendencia = 'aguardando_superintendencia';
    case AguardandoEquipeCG = 'aguardando_equipe_cg';
    case AguardandoCoordenacaoGeral = 'aguardando_coordenacao_geral';
    case AguardandoDirecao = 'aguardando_direcao';
    case Aprovado = 'aprovado';
    case Devolvido = 'devolvido';
}
```

**Ganhos:**
- Fluxo centralizado em um único lugar (não espalhado em 6 funções JS)
- Fácil de adicionar novos níveis (configurar na enum + transition)
- Transições validadas automaticamente (não é possível pular etapas)
- Histórico de transições automático

### 4.3 Versionamento e Auditoria

```php
// Laravel Activity Log (pronto)
Activity::log([
    'subject' => $processo,
    'action' => 'checkpoint_avancado',
    'user' => auth()->user(),
    'properties' => [
        'de' => 'aguardando_chefia',
        'para' => 'aguardando_coordenacao',
    ]
]);
```

**Ganhos:**
- Log automático de toda ação (quem, o quê, quando)
- Versionamento de dados nativo com Eloquent
- Trilha de auditoria completa para órgãos de controle

### 4.4 Geração de PDF

| Abordagem | Supabase/JS | Laravel |
|---|---|---|
| Método | html2pdf.js (client-side) | DomPDF ou wkhtmltopdf (server-side) |
| Confiabilidade | Depende do browser do usuário | Consistente em todos os ambientes |
| Layout | Limitado ao que o browser renderiza | Totalmente controlável |
| Logo/Marca d'água | Difícil | Nativo |
| Numeração de páginas | Manual | Automático |

### 4.5 Escalabilidade e Manutenção

| Aspecto | Supabase/JS | Laravel |
|---|---|---|
| Adicionar novo nível de aprovação | Criar bloco HTML + JS + atualizar 3 arquivos | Configurar enum + migration |
| Adicionar campo ao formulário | Alterar HTML + JS + Supabase + 3 abas | Migration + Model + View |
| Testes automatizados | Não implementável facilmente | PHPUnit nativo |
| Documentação da API | Manual | Automática com OpenAPI/Swagger |
| Deploy | Upload de arquivos | Comando `php artisan migrate` |

---

## 5. Roteiro de Migração Sugerido

### Fase 1 — Validação do Protótipo (Atual)
- ✅ Validar todos os fluxos de aprovação e devolução
- ✅ Confirmar regras de negócio com usuários
- ✅ Mapear todos os campos de cada aba
- ✅ Documentar comportamentos esperados

### Fase 2 — Arquitetura Laravel
- Criar estrutura do projeto Laravel
- Definir models: `Processo`, `VersaoFormulario`, `Deliberacao`, `Transicao`
- Implementar State Machine para fluxo de aprovação
- Configurar autenticação e RBAC

### Fase 3 — Migração dos Dados
- Script de migração do Supabase para PostgreSQL
- Mapeamento de `tabela_foco` → `versoes_formulario`
- Mapeamento de `tabela_deliberacoes` → `deliberacoes`

### Fase 4 — Desenvolvimento das Views
- Replicar formulários das abas (Blade templates)
- Implementar Painel Gerencial (Aba 7)
- Geração de PDF server-side

### Fase 5 — Testes e Deploy
- Testes automatizados de fluxo
- Testes de segurança
- Deploy em ambiente governamental

---

## 6. Conclusão

| Critério | Supabase/JS | Laravel/PostgreSQL |
|---|---|---|
| Prototipagem | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Segurança | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Workflow | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Auditoria | ⭐ | ⭐⭐⭐⭐⭐ |
| Manutenção | ⭐⭐ | ⭐⭐⭐⭐ |
| Produção governamental | ⭐⭐ | ⭐⭐⭐⭐⭐ |

**Recomendação:** O protótipo atual é uma **excelente especificação viva**. Ele validou o que precisa ser construído. A migração para Laravel não é um "recomeço" — é a **consolidação** do que já foi aprendido em uma stack adequada para produção.

---

*Documento gerado em 15/07/2026 — Sessão de discussão arquitetural.*
