# Histórico de Alterações - Reformulação dos Blocos de Deliberação por Perfil na Aba 7

## Resumo da Mudança
O bloco genérico único `#bloco-deliberacao` que havia sido criado na etapa anterior foi substituído por 3 blocos HTML específicos (`#bloco-deliberacao-chefia`, `#bloco-deliberacao-coord`, `#bloco-deliberacao-super`), cada um com regras, textos e opções de aprovação e devolução próprias de acordo com as definições de hierarquia (Chefia, Coordenação e Superintendência). O JavaScript também foi ajustado para mostrar o bloco correto dependendo da permissão.

## 1. Estado Anterior (Antes)
Existia apenas um bloco chamado `<div id="bloco-deliberacao">...</div>` e no array de permissões ele estava listado para várias pessoas:
```javascript
    const profilePermissions = {
      'ALL': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao'],
      'SPU_CARACTERIZACAO': ['acc_aba1', 'acc_aba2'], // Exemplo: vê apenas aba 1 e 2
      'SPU_DESTINACAO': ['acc_aba1', 'acc_aba2', 'acc_aba3'],
      'CHEFIA_SPU': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao'],
      'COORDENACAO_SPU': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao'],
      'SUPERINTENDENCIA': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao'],
      'EQUIPE_CG': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao'],
      'COORDENACAO_GERAL': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao'],
      'DIRETORIA': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao'],
      'CDE': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao'] // Exemplo: CDE vê deliberação
    };
```

## 2. Estado Novo (Depois)
No lugar do `#bloco-deliberacao`, foram criados 3 blocos distintos, separados por IDs (Chefia, Coordenação, Superintendência). No script, a permissão reflete quem tem acesso a cada tela:
```javascript
    const profilePermissions = {
      'ALL': ['acc_aba1', 'acc_aba2', 'acc_aba3'],
      'SPU_CARACTERIZACAO': ['acc_aba1', 'acc_aba2'],
      'SPU_DESTINACAO': ['acc_aba1', 'acc_aba2', 'acc_aba3'],
      'CHEFIA_SPU': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao-chefia'],
      'COORDENACAO_SPU': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao-coord'],
      'SUPERINTENDENCIA': ['acc_aba1', 'acc_aba2', 'acc_aba3', 'bloco-deliberacao-super'],
      'EQUIPE_CG': ['acc_aba1', 'acc_aba2', 'acc_aba3'],
      'COORDENACAO_GERAL': ['acc_aba1', 'acc_aba2', 'acc_aba3'],
      'DIRETORIA': ['acc_aba1', 'acc_aba2', 'acc_aba3'],
      'CDE': ['acc_aba1', 'acc_aba2', 'acc_aba3']
    };
```

## 3. Plano de Rollback / Desfazer
Para reverter a mudança e restaurar o bloco único:
1. Abra `aba7.html`.
2. Remova os três blocos `<div id="bloco-deliberacao-chefia">...`, `<div id="bloco-deliberacao-coord">...` e `<div id="bloco-deliberacao-super">...` juntamente com a tag `<script>` adjacente.
3. Volte a colocar o HTML do `<div id="bloco-deliberacao">...</div>` antigo.
4. No script de permissões (`profilePermissions`), troque os blocos específicos pelo ID único `'bloco-deliberacao'` em todas as listas de permissões necessárias.
