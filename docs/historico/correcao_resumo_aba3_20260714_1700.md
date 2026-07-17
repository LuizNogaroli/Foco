# Histórico de Interações - Correção do Resumo da Aba 3

**Data/Hora:** 14 de Julho de 2026, 17:00  
**Objetivo:** Sincronizar o relatório de resumo (`foco-03-resumo.html`) e a rotina de salvamento (`foco-03.html`) para contemplar a totalidade de campos respondidos no formulário da Aba 3.

---

## 1. Estado Anterior (Antes)

### foco-03.html (Mapeamento de dados de Aba 3)
```javascript
            ultimoRelatorioSalvoAba3 = {
              natureza_destinacao: document.getElementById("campo16")?.value || "",
              modalidade: document.getElementById("campo51")?.value || "",
              destinacao_obs: document.getElementById("campo51_obs")?.value || "",

              cessao_onerosa: document.getElementById("campo511")?.value || "",
              cessao_obs: document.getElementById("campo511_obs")?.value || "",

              ha_pendencias_contratuais: document.querySelector('input[name="ha_pendencias_contratuais"]:checked')?.value || "",
              pendencias: Array.from(document.querySelectorAll('input[name="pendencias[]"]:checked')).map(el => el.value),
              pendencias_obs: document.getElementById("obs_pendencias")?.value || "",

              ha_debitos: formDataState["ha_debitos"] || "",
              debitos: formDataState["debitos[]"] || formDataState["debitos"] || [],
              debitos_obs: formDataState["obs_debitos"] || "",

              observacoes_aba3: document.getElementById("observacoes_aba3")?.value || "",
            };
```

### foco-03-resumo.html (Interface e Mapeamento JS)
O HTML continha apenas seções de **Dados da Proposta de Destinação**, **Regime de Destinação**, e **Análise Contratual e Financeira**, omitindo os novos blocos de CPF/CNPJ, capacidade financeira, NUP/SEI de processos, comparações de áreas e valores, e todos os demais impactos/vinculações de políticas públicas e ambientais.

---

## 2. Estado Novo (Depois)

### foco-03.html (Mapeamento Completo de Aba 3)
```javascript
            ultimoRelatorioSalvoAba3 = {
              // 1. Análise do Destinatário
              cpf_cnpj_regular: document.querySelector('input[name="cpf_cnpj_regular"]:checked')?.value || "",
              obs_cpf_cnpj_irregular: document.getElementById("obs_cpf_cnpj_irregular")?.value || "",
              natureza_destinacao: document.getElementById("campo16")?.value || "",
              ha_pendencias_contratuais: document.querySelector('input[name="ha_pendencias_contratuais"]:checked')?.value || "",
              pendencias: Array.from(document.querySelectorAll('input[name="pendencias[]"]:checked')).map(el => el.value),
              pendencias_obs: document.getElementById("obs_pendencias")?.value || "",

              // 2. Capacidade Financeira
              capacidade_fin: document.getElementById("capacidade_fin")?.value || "",

              // 3. Ações judiciais ou órgãos de controle
              nup_sei: document.getElementById("nup_sei")?.value || "",
              tipo_processo: document.getElementById("tipo_processo")?.value || "",
              resumo_acao: document.getElementById("resumo_acao")?.value || "",
              descricao_acao: document.getElementById("descricao_acao")?.value || "",

              // 4. Dados de Comparação de Área e Valor
              area_total_imovel: document.getElementById("area_total_imovel")?.value || "",
              valor_total_imovel: document.getElementById("valor_total_imovel")?.value || "",
              area_terreno_destinada: document.getElementById("area_terreno_destinada")?.value || "",
              area_construida_destinada: document.getElementById("area_construida_destinada")?.value || "",
              valor_area_destinada: document.getElementById("valor_area_destinada")?.value || "",

              // 5. Custos de Manutenção para a SPU
              custos_manutencao: document.querySelector('input[name="custos_manutencao"]:checked')?.value || "",
              custos_valor: document.getElementById("custos_valor")?.value || "",

              // 6. Outros Interessados
              outros_interessados: document.querySelector('input[name="outros_interessados"]:checked')?.value || "",
              obs_outros_interessados: document.getElementById("obs_outros_interessados")?.value || "",

              // 7. Proposta de Destinação e Impactos
              modalidade: document.getElementById("campo51")?.value || "", // Tipo de procedimento
              destinacao_obs: document.getElementById("campo51_obs")?.value || "",
              tipo_uso_imobiliario: document.getElementById("campo52")?.value || "",
              tipo_uso_especifico: document.getElementById("campo53")?.value || "",
              previsao_modificacao: document.querySelector('input[name="campo54"]:checked')?.value || "",
              previsao_modificacao_desc: document.getElementById("campo54_desc")?.value || "",
              compatibilidade_urbanistica: document.getElementById("campo55")?.value || "",
              compatibilidade_urbanistica_obs: document.getElementById("campo55_obs")?.value || "",
              
              vinculacao_programas_radio: document.querySelector('input[name="campo56_radio"]:checked')?.value || "",
              vinculacao_programas: Array.from(document.querySelectorAll('input[name="campo56[]"]:checked')).map(el => el.value),
              vinculacao_programas_obs: document.getElementById("campo56_obs")?.value || "",
              
              vinculacao_politicas_radio: document.querySelector('input[name="campo57_radio"]:checked')?.value || "",
              vinculacao_politicas: Array.from(document.querySelectorAll('input[name="campo57[]"]:checked')).map(el => el.value),
              vinculacao_politicas_obs: document.getElementById("campo57_obs")?.value || "",
              
              expectativa_impacto_social: document.querySelector('input[name="campo58_radio"]:checked')?.value || "",
              impacto_social: document.getElementById("campo58")?.value || "",
              impacto_social_obs: document.getElementById("campo58_obs")?.value || "",
              num_beneficiarios: document.getElementById("campo59")?.value || "",
              
              expectativa_impacto_ambiental: document.querySelector('input[name="campo510_radio"]:checked')?.value || "",
              impacto_ambiental: document.getElementById("campo510")?.value || "",
              impacto_ambiental_obs: document.getElementById("campo510_obs")?.value || "",
              
              cessao_onerosa: document.getElementById("campo511")?.value || "", // Regime de destinação
              cessao_obs: document.getElementById("campo511_obs")?.value || "",
              
              obs_geral_destinacao: document.getElementById("obs224_0")?.value || "",

              // 8. Despacho e Ação Final
              despacho_final: document.querySelector('input[name="despacho_final"]:checked')?.value || "",
              motivo_devolucao: document.getElementById("motivo_devolucao")?.value || "",

              // Legados/Metadados extras
              ha_debitos: formDataState["ha_debitos"] || "",
              debitos: formDataState["debitos[]"] || formDataState["debitos"] || [],
              debitos_obs: formDataState["obs_debitos"] || "",
              observacoes_aba3: document.getElementById("observacoes_aba3")?.value || "",
            };
```

### foco-03-resumo.html (Mapeamento Completo de Aba 3)
A estrutura HTML e o bloco JS agora mapeiam todos os seletores e chaves correspondentes acima para renderização organizada.

---

## 3. Plano de Rollback / Desfazer

Se for necessário reverter as alterações e restaurar os arquivos ao estado simplificado original:

1. **Reverter `foco-03.html`**:
   - Abra o arquivo `foco-03.html`.
   - Localize o bloco de código que inicia o objeto `ultimoRelatorioSalvoAba3`.
   - Substitua o objeto completo pelas chaves do **Estado Anterior (Antes)** descritas na Seção 1 deste log.
   - Salve o arquivo.

2. **Reverter `foco-03-resumo.html`**:
   - Faça git checkout ou restaure a versão do arquivo antes desta correção:
     `git checkout HEAD -- foco-03-resumo.html`
   - Ou restaure manualmente as tags HTML do grid e o script simplificado de atribuição usando a Seção 1 deste log.
