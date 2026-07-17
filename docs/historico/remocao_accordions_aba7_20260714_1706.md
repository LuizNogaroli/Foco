# Histórico de Alterações - Remoção de Accordions na Aba 7

## Resumo da Mudança
O usuário solicitou que na Aba 7 (`aba7.html`), que é a tela de manifestação, fossem mantidos apenas os accordeons das abas 1, 2 e 3, removendo as visualizações de etapas superiores (4, 5, 6, 7 e 8).

## 1. Estado Anterior (Antes)
Os seguintes blocos de HTML existiam no arquivo `aba7.html` entre o accordion da Aba 3 e o fechamento da div principal:
```html
        <!-- ABA 04 - ANÁLISE DO DESTINATÁRIO -->
        <div class="accordion-item" id="acc_aba4">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            <span>📋 Análise do Destinatário</span>
            <span class="arrow">▼</span>
          </div>

          <div class="accordion-content">
            <iframe
              class="accordion-iframe"
              src="./foco-04.html"
              title="Análise do Destinatário"
            ></iframe>
          </div>
        </div>

        <!-- ABA 05 - PROPOSTA DE DESTINAÇÃO -->
        <div class="accordion-item" id="acc_aba5">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            <span>📋 Proposta de Destinação</span>
            <span class="arrow">▼</span>
          </div>

          <div class="accordion-content">
            <iframe
              class="accordion-iframe"
              src="./foco-05.html"
              title="Proposta de Destinação"
            ></iframe>
          </div>
        </div>

        <!-- ABA 06 - MANIFESTAÇÃO SPU/UF -->
        <div class="accordion-item" id="acc_aba6">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            <span>📋 Deliberação - SPU/UF</span>
            <span class="arrow">▼</span>
          </div>

          <div class="accordion-content">
            <iframe
              class="accordion-iframe"
              src="./foco-06.html"
              title="Manifestação SPU/UF"
            ></iframe>
          </div>
        </div>

        <!-- ABA 07 - MANIFESTAÇÃO SPU/UC -->
        <div class="accordion-item" id="acc_aba7">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            <span>📋 Deliberação - SPU/UC</span>
            <span class="arrow">▼</span>
          </div>

          <div class="accordion-content">
            <iframe
              class="accordion-iframe"
              src="./foco-07.html"
              title="Manifestação SPU/UC"
            ></iframe>
          </div>
        </div>
      </div>

        <!-- ABA 08 - Resumo - Destinação -->
        <div class="accordion-item" id="acc_aba8">
          <div class="accordion-header" onclick="toggleAccordion(this)">
            <span>📋 Deliberação CDE</span>
            <span class="arrow">▼</span>
          </div>

          <div class="accordion-content">
            <iframe
              class="accordion-iframe"
              src="./foco-10.html"
              title="Manifestação SPU/UC"
            ></iframe>
          </div>
        </div>
```

## 2. Estado Novo (Depois)
O arquivo `aba7.html` agora termina o bloco de accordions assim, finalizando imediatamente após o fechamento da Aba 3:
```html
      </div>

    </section>
```

## 3. Plano de Rollback / Desfazer
Para reverter a mudança e restaurar o estado original:
1. Abra o arquivo `aba7.html`.
2. Localize as linhas:
   ```html
      </div>

    </section>
   ```
3. Substitua esse bloco de volta incluindo os `<div class="accordion-item">` com os IDs de `acc_aba4` a `acc_aba8` originais listados em **Estado Anterior**.
