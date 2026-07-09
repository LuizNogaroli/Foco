# Alerta de Exigência de Cadastro Mínimo na Aba 1

## Estado Anterior (Antes)
Ao selecionar uma das últimas 4 opções de conceituação do imóvel (que não exigem RIP mas sim Cadastro Mínimo), era exibido diretamente o botão verde "+ Inserir Cadastro Mínimo" sem o texto informativo padronizado.

No arquivo [foco-01.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.html):
```html
                    <!-- Botão Inserir Cadastro Mínimo -->
                    <button type="button" id="btnInserirCadastroMinimo" class="btn-action" style="display: none; padding: 8px 16px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; width: fit-content; margin-top: 5px;">+ Inserir Cadastro Mínimo</button>
```

No arquivo [foco-01.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.js):
```javascript
        const blocoInfo = document.getElementById('bloco-info-exige-rip');
        const spanConceituacao = document.getElementById('info-conceituacao-selecionada');
        const btnCadastro = document.getElementById('btnInserirCadastroMinimo');

        let selecionado = "";
        if (val && exigeRip.includes(val)) {
            selecionado = "Sim";
            if (blocoInfo) blocoInfo.style.display = "block";
            if (spanConceituacao) spanConceituacao.textContent = val;
            if (btnCadastro) btnCadastro.style.display = "none";
        } else if (val && exigeCadastro.includes(val)) {
            selecionado = "Não";
            if (blocoInfo) blocoInfo.style.display = "none";
            if (btnCadastro) btnCadastro.style.display = "block";
        } else {
            if (blocoInfo) blocoInfo.style.display = "none";
            if (btnCadastro) btnCadastro.style.display = "none";
        }
```

## Estado Novo (Depois)
Criamos um bloco informativo estilizado com a mesma estrutura visual da exigência de RIP para a exigência de Cadastro Mínimo, e ajustamos o controle dele no JavaScript:

No arquivo [foco-01.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.html):
```html
                    <!-- Bloco Info Exige Cadastro Mínimo -->
                    <div id="bloco-info-exige-cadastro-minimo" style="display: none; margin-top: 12px; padding: 12px; background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; width: 100%;">
                        <div style="font-weight: 600; color: #1e3a5f; margin-bottom: 8px;">
                            Conceituação selecionada: <span id="info-conceituacao-selecionada-cadastro" style="font-weight: 700; color: #0056b3;"></span>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
                            <span style="font-size: 0.95em; color: #374151; font-weight: 500;">⚠️ A conceituação do imóvel exige um CADASTRO MÍNIMO.</span>
                            <button type="button" id="btnInserirCadastroMinimo" class="btn-action" style="padding: 8px 16px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; font-weight: bold; width: fit-content;">+ Inserir Cadastro Mínimo</button>
                        </div>
                    </div>
```

No arquivo [foco-01.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.js):
```javascript
        const blocoInfo = document.getElementById('bloco-info-exige-rip');
        const spanConceituacao = document.getElementById('info-conceituacao-selecionada');
        const blocoCadastro = document.getElementById('bloco-info-exige-cadastro-minimo');
        const spanConceituacaoCadastro = document.getElementById('info-conceituacao-selecionada-cadastro');

        let selecionado = "";
        if (val && exigeRip.includes(val)) {
            selecionado = "Sim";
            if (blocoInfo) blocoInfo.style.display = "block";
            if (spanConceituacao) spanConceituacao.textContent = val;
            if (blocoCadastro) blocoCadastro.style.display = "none";
        } else if (val && exigeCadastro.includes(val)) {
            selecionado = "Não";
            if (blocoInfo) blocoInfo.style.display = "none";
            if (blocoCadastro) blocoCadastro.style.display = "block";
            if (spanConceituacaoCadastro) spanConceituacaoCadastro.textContent = val;
        } else {
            if (blocoInfo) blocoInfo.style.display = "none";
            if (blocoCadastro) blocoCadastro.style.display = "none";
        }
```

## Plano de Rollback / Desfazer
Para reverter essa alteração:
1. Abra o arquivo [foco-01.html](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.html).
2. Remova a div contêiner `<div id="bloco-info-exige-cadastro-minimo">` inteira e reposicione o botão `<button type="button" id="btnInserirCadastroMinimo" ...>` fora dela, adicionando `display: none;` nas suas propriedades de estilo inline originais.
3. Abra o arquivo [foco-01.js](file:///c:/Users/luizn/Documents/1-PROGRAMAS/Foco-12/foco-01.js) e reverta a lógica de `atualizarLayoutConceituacao` para a descrita na seção de "Estado Anterior".
