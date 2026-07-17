# Histórico de Correção - Depuração de Botões e Layout Aba 2 - 20260714_0940

## Descrição
Reordenação dos botões do rodapé nas Abas 1 e 2 para que os botões principais (Salvar / Manifestar / Avançar) apareçam antes (acima) das ações secundárias (Limpar / Imprimir) conforme solicitado pelo usuário. Adição de um interceptador de erros global (`window.onerror`) no cabeçalho de `foco-02.html` para depuração de eventuais erros silenciosos no carregamento do iframe e atualização do query parameter de cache de `foco-02.js`, `foco-01.js` e `sync.js`.

## Estado Anterior (Antes)
Os botões de Limpar e Imprimir ficavam declarados antes dos botões de Salvar/Manifestação no HTML de ambas as abas, renderizando-os acima. Não havia captura ativa de erros em tela.

```html
      <!-- Ações Extras (Limpar/Imprimir) -->
      <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px;">
          ...
      </div>

      <!-- Botões Principais Empilhados -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%; max-width: 50%; margin: 30px auto 0 auto; border-top: 1px solid #ccc; padding-top: 30px;">
          ...
      </div>
```

E no `<head>` de `foco-02.html` não havia interceptador global de erros.

## Estado Novo (Depois)
Os botões principais empilhados agora vêm antes das ações secundárias no HTML de ambas as abas, renderizando-os no topo do rodapé. Um popup de alerta interceptará e mostrará erros de script em `foco-02.html`.

```html
      <!-- Botões Principais Empilhados -->
      <div style="display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%; max-width: 50%; margin: 30px auto 0 auto; border-top: 1px solid #ccc; padding-top: 30px;">
          ...
      </div>

      <!-- Ações Extras (Limpar/Imprimir) -->
      <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
          ...
      </div>
```

E no `<head>` de `foco-02.html`:
```html
    <script>
        window.onerror = function(msg, url, line, col, error) {
            alert("Erro na Aba 2: " + msg + "\nLinha: " + line + "\nArquivo: " + url);
            return false;
        };
    </script>
```

## Plano de Rollback / Desfazer
1. Abra os arquivos `foco-01.html` e `foco-02.html`.
2. Mova de volta a `div` com id/estilo contendo "Ações Extras (Limpar/Imprimir)" para ficar antes da `div` "Botões Principais Empilhados" / "Fluxo Principal".
3. No arquivo `foco-02.html`, remova o bloco `<script>window.onerror = ...</script>` do `<head>`.
4. Reverta as tags de versão dos scripts no final do HTML para as versões anteriores se necessário.
