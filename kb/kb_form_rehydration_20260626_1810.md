# Knowledge Base: Reidratação de Formulários Dinâmicos

**Data:** 26/06/2026
**Contexto:** Ao salvar um formulário que contém blocos HTML gerados dinamicamente (como a lista de Imóveis/RIPs), o nosso motor de sincronização (`sync.js`) empacota os dados de forma "achatada" (flat), transformando campos aninhados em chaves de texto plano (Ex: `imoveis[1][area_total] = "100"`).

## O Desafio (Bug Resolvido)
Ao recarregar a página, o sistema recuperava o identificador principal (o número do RIP) e mandava renderizar o bloco HTML novamente. Porém, a função construtora do bloco (`criarBlocoImovel`) recebia apenas o ID, nascendo "vazia". 
Embora o `sync.js` passasse depois populando os valores (`value`), a estrutura visual já havia sido renderizada assumindo que os dados eram inexistentes (gerando falsos-positivos visuais de "DADOS FALTANTES").

## A Solução Arquitetural
Para componentes dinâmicos, não podemos depender apenas da injeção assíncrona de valores (`sync.js`). Precisamos **reconstruir (reidratar) o objeto completo** em memória ANTES de solicitar a renderização do HTML.

### Padrão de Reidratação Implementado:
1. Identificar a chave raiz no dicionário achatado (Ex: buscar o índice `X` onde `imoveis[X][rip] == "2026001"`).
2. Fazer uma varredura (Regex) em todas as chaves do estado (banco de dados) buscando tudo que pertence a esse índice (Ex: `/^imoveis\[1\]\[(.*?)\]$/`).
3. Montar um objeto JSON rico e tridimensional em memória.
4. Passar esse objeto rico (e não apenas o ID) para a função de renderização UI, permitindo que ela tome decisões estruturais no momento do *paint* (Ex: decidir se aplica a classe `readonly` ou não com base na presença de `flags_manuais`).

> [!TIP]
> **Lição Aprendida:** Componentes visuais cujas regras de CSS e layout dependem de dados do banco devem ser renderizados de forma "Data-Driven" (orientada aos dados hidratados) no exato momento da montagem do DOM, e não através de mutação posterior de valores em inputs já renderizados.
