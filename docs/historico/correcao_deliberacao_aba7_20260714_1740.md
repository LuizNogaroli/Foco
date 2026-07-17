# Histórico de Correção: Salvamento de Deliberação e RBAC na Aba 7

## Contexto
O usuário relatou que ao logar como Chefia SPU, encaminhar e concluir a manifestação (enviando para a coordenação), o registro não ficava gravado em lugar nenhum. Além disso, os blocos de deliberação não apareciam ao logar com o perfil Chefia ou Coordenação SPU/UF.

Foram identificados 3 problemas críticos:
1. `updateStatusFluxo` em `db.js` estava usando `PATCH` para atualizar a tabela `tabela_status_fluxo`. Quando um processo novo não possuía registro na tabela, o `PATCH` falhava silenciosamente e o status não avançava no banco de dados. Tentamos primeiro usar a flag do Supabase de UPSERT (`Prefer: resolution=merge-duplicates`), mas a tabela `tabela_status_fluxo` não contava com uma *constraint UNIQUE* formal no campo `numero_requerimento` (que não era chave primária), o que invalidava o UPSERT nativo. Refatoramos para realizar um `GET` verificador: se a linha existir, ele aciona o `PATCH`; se não existir, ele faz um `POST` limpo.
2. A lista de permissões (`profilePermissions`) em `aba7.html` possuía as chaves em formato interno (`CHEFIA_SPU`), mas o sistema passava a string visual do perfil (`Chefia SPU/UF`), resultando na ocultação dos blocos.
3. A função `enviarDeliberacaoSupabase` em `aba7.html` não lia o `processId` do `localStorage` (como a função de busca fazia), o que impedia o salvamento caso a URL estivesse sem os parâmetros.

## 1. Estado Anterior (Antes)

### Em `db.js`
```javascript
            // Atualiza
            await fetch(`${SUPABASE_URL}/rest/v1/tabela_status_fluxo?numero_requerimento=eq.${processId}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dados_json: json, updated_at: new Date().toISOString() })
            });
```

### Em `aba7.html` (profilePermissions)
```javascript
    const profilePermissions = {
      'ALL': ['acc_aba1', 'acc_aba2', 'acc_aba3'],
      'SPU_CARACTERIZACAO': ['acc_aba1', 'acc_aba2'],
      'SPU_DESTINACAO': ['acc_aba1', 'acc_aba2', 'acc_aba3'],
      'CHEFIA_SPU': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao-chefia'],
      'COORDENACAO_SPU': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao-coord'],
      'SUPERINTENDENCIA': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao-super'],
      // ...
    };
```

### Em `aba7.html` (enviarDeliberacaoSupabase)
```javascript
            const processId = new URLSearchParams(window.location.search).get('processo') || 
                              (window.parent && new URLSearchParams(window.parent.location.search).get('processo'));
```

## 2. Estado Novo (Depois)

### Em `db.js`
```javascript
        let json = {};
        let existe = false;
        if (resGet.ok) {
            const data = await resGet.json();
            if (data.length > 0) {
                existe = true;
                json = data[0].dados_json ? data[0].dados_json : {};
            }
        }
        
        json.checkpoint = novoCheckpoint;
        json.status_geral = novoStatus || 'Em análise';
        
        if (existe) {
            // Atualiza
            await fetch(`${SUPABASE_URL}/rest/v1/tabela_status_fluxo?numero_requerimento=eq.${processId}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ dados_json: json, updated_at: new Date().toISOString() })
            });
        } else {
            // Cria
            await fetch(`${SUPABASE_URL}/rest/v1/tabela_status_fluxo`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    numero_requerimento: processId, 
                    dados_json: json, 
                    updated_at: new Date().toISOString() 
                })
            });
        }
```

### Em `aba7.html` (profilePermissions)
```javascript
    const profilePermissions = {
      'ALL': ['acc_aba1', 'acc_aba2', 'acc_aba3'],
      'SPU_CARACTERIZACAO': ['acc_aba1', 'acc_aba2'],
      'SPU_DESTINACAO': ['acc_aba1', 'acc_aba2', 'acc_aba3'],
      'CHEFIA_SPU': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao-chefia'],
      'Chefia SPU/UF': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao-chefia'],
      'COORDENACAO_SPU': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao-coord'],
      'Coordenação SPU/UF': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao-coord'],
      'SUPERINTENDENCIA': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao-super'],
      'Superintendência': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao-super'],
      // ...
    };
```

### Em `aba7.html` (enviarDeliberacaoSupabase)
```javascript
            const processId = new URLSearchParams(window.location.search).get('processo') || 
                              (window.parent && new URLSearchParams(window.parent.location.search).get('processo')) ||
                              localStorage.getItem('CURRENT_PROCESS_ID');
```

## 3. Plano de Rollback / Desfazer
Para reverter essas alterações:
1. Abra o arquivo `db.js`. Encontre a função `updateStatusFluxo`. Troque a requisição `POST` com a opção `'Prefer': 'resolution=merge-duplicates'` de volta para uma requisição `PATCH` em `tabela_status_fluxo?numero_requerimento=eq.${processId}`.
2. Abra o arquivo `aba7.html`. Na definição de `profilePermissions`, apague as três chaves com os nomes por extenso (`'Chefia SPU/UF'`, `'Coordenação SPU/UF'`, `'Superintendência'`).
3. Ainda no arquivo `aba7.html`, na função `enviarDeliberacaoSupabase`, remova a checagem no localStorage `|| localStorage.getItem('CURRENT_PROCESS_ID')` da declaração da constante `processId`.
