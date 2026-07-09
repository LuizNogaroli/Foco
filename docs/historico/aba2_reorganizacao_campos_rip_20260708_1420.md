# Reorganização das Seções de Campos do RIP (Aba 2)

**Data:** 08 de julho de 2026  
**Autor:** Antigravity (AI Developer)

## Modificações Realizadas
- **Reorganização Estrutural dos Campos do RIP (foco-02.js):**
  - Ajustei o HTML gerado dinamicamente pela função `criarBlocoImovel` para dividir os campos em subseções identificadas de forma organizada:
    1. **Localização**: CEP, UF, Município, Endereço.
    2. **Tipologia**: Conceituação do Imóvel, Condição de Urbanização, Natureza do Imóvel, Tipo de Imóvel.
    3. **Características**: Área total (m²), Área da União (m²), Área construída total (m²), Área construída disponível (m²), Área de terreno disponível (m²), Há benfeitorias?.
    4. **Condições da incorporação**: Situação da Incorporação, LPM/1831 ou LMEO homologadas?, Processo de incorporação: (com os subcampos condicionais de Número do Processo, Cartório e Matrícula).
    5. **Condições da Avaliação**: Seção de avaliação contendo o Valor da Avaliação (R$), Data da Avaliação, Instrumento de Avaliação, e botão de anexo de documento de avaliação.
  - Mantive a Certidão de Matrícula e a seção de Inconsistências Cadastrais por RIP ordenadas sequencialmente logo após as Condições da Avaliação.
- **Cache Buster:**
  - Atualizei a string de versão do script `foco-02.js` em `foco-02.html` para `v=99999_34`.
