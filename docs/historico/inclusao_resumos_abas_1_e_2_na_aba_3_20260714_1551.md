# Histórico de Alteração - Inclusão de Resumos Abas 1 e 2 na Aba 3 - 20260714_1551

## Descrição
Adicionados dois *accordions* logo abaixo do título principal do formulário da **Aba 3 (Destinação)** para carregar as versões "somente leitura" da **Aba 1 (Indicação do Imóvel)** e da **Aba 2 (Caracterização)**. Os painéis começam recolhidos (*collapsed*) por padrão, permitindo que a equipe de Destinação consulte os preenchimentos anteriores e as respectivas manifestações antes de iniciar a sua própria etapa.

## Estado Anterior (Antes)
Na Aba 3 (`foco-03.html`), logo abaixo da tag `<form id="form03">`, iniciava-se diretamente a seção de "Análise do Destinatário".
```html
      <h2>Análise e Proposta de Destinação</h2>
      <form id="form03" novalidate>
        <!-- Dados do Destinatário -->
        <h4 class="section-title">Análise do Destinatário</h4>
```

## Estado Novo (Depois)
Foram inseridos dois blocos *accordion* (Aba 1 e Aba 2) com iframes apontando para seus respectivos arquivos de resumo:
```html
      <h2>Análise e Proposta de Destinação</h2>
      <form id="form03" novalidate>
        
        <!-- ========== ACCORDIONS DE REVISÃO (ABAS 1 E 2) ========== -->
        <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px;">
          <!-- ABA 1 -->
          ... iframe foco-01-resumo.html ...
          <!-- ABA 2 -->
          ... iframe foco-02-resumo.html ...
        </div>
        <!-- ========================================================= -->

        <!-- Dados do Destinatário -->
        <h4 class="section-title">Análise do Destinatário</h4>
```

## Plano de Rollback / Desfazer
1. Abra o arquivo `foco-03.html`.
2. Localize a tag `<form id="form03" novalidate>` (próximo à linha 251).
3. Remova todo o bloco de código HTML delimitado pelos comentários `<!-- ========== ACCORDIONS DE REVISÃO (ABAS 1 E 2) ========== -->` até `<!-- ========================================================= -->`.
4. Salve o arquivo.
