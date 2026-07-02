# Solução de Geolocalização Interativa (Geo Modal)

Este documento registra a experiência e os desafios encontrados durante a implementação da ferramenta de mapa (Geolocalização) no formulário do SPUnet (Aba 2 - Caracterização), servindo como guia prático para reaproveitamento em outros projetos.

## 1. O Problema Inicial
Ao tentar incorporar o mapa interativo (`Leaflet`) e a busca automática de endereços por CEP via Nominatim (OpenStreetMap) diretamente no meio de um formulário longo e complexo, deparamo-nos com três problemas críticos:

1. **Bug de Renderização do Leaflet (Tela Cinza):** 
   - *Causa:* Quando o mapa é carregado em uma seção colapsada ou muito abaixo no scroll (sem estar visível no DOM inicial), ele não consegue calcular seu próprio tamanho matemático (`width/height`), renderizando tiles em branco ou blocos cinzas quebrados.
2. **Bloqueio de CORS/Access Denied no Geocoder (Nominatim):** 
   - *Causa:* O Nominatim frequentemente recusa chamadas via `fetch()` vindas de origens cruzadas sem `User-Agent` explícito. Requisições falhavam silenciosamente em ambiente local ou de homologação, deixando a Latitude/Longitude congeladas em dados de cache sujos (como `"ASas"`).
3. **Limitação de Precisão da API:** 
   - *Causa:* Muitos logradouros brasileiros não estão mapeados no nível da rua, e depender apenas do retorno numérico da API para posicionar o "alvo" no imóvel causava frustração no usuário.

## 2. A Solução Arquitetural (Modal + JSONP + Leaflet.Draw)

### 2.1 Isolamento Visual via Janela Focal (Modal)
Para resolver os bugs de *layout* e preservar o espaço na tela principal:
- Substituiu-se a `<div>` do mapa embutido por um botão de gatilho: **"🗺️ Abrir Mapa Interativo e Demarcar"**.
- O mapa passou a residir em um Modal (Overlay) em tela cheia que fica em `display: none`.
- Ao abrir o Modal, força-se a re-renderização (`map.invalidateSize()`), garantindo que o mapa carregue perfeitamente com as dimensões já computadas.

### 2.2 Bypassing de CORS com JSONP
Para evitar os bloqueios do Nominatim via `fetch`:
- Foi abandonada a requisição AJAX clássica e implementado um injetor de Script (Técnica **JSONP**).
- O script anexa dinamicamente ao DOM a tag: 
  `<script src="https://nominatim.openstreetmap.org/search?format=json&q=...&json_callback=nominatimCallback"></script>`
- Isso é visto pelo navegador como o carregamento de uma biblioteca externa normal, pulando inteiramente as políticas rígidas de CORS e retornando os dados para a função global `nominatimCallback`.

### 2.3 Tolerância a Falhas na Busca (Fallback Cascade)
- Como primeira etapa de busca, tentamos o **ViaCEP** para obter Cidade/Rua e passar um endereço polido para o Nominatim.
- **Lição Aprendida:** O ViaCEP retorna um JSON com `{"erro": true}` para CEPs genéricos de município (ex: `70001-000` em Brasília). O código falhava silenciosamente nesse ponto.
- **Solução:** Foi adicionada uma regra de *Fallback* agressivo. Se o ViaCEP falhar, o código repassa a string "suja" (o CEP puro que o usuário digitou) diretamente para o Nominatim, que incrivelmente consegue achar a cidade, centralizando o mapa sem travar.

### 2.4 Ferramentas de Desenho (Leaflet.Draw)
Para resolver a limitação da API (Onde a API não alcança, o humano vai lá e clica):
- Importou-se a suíte `Leaflet.Draw` (solução resgatada do antigo *Foco-08*).
- Foram ativadas as opções de **Marcador (Pino)** e **Polígono (Desenho da área)**.
- Adicionou-se uma lógica de *cálculo de centroide geométrico*: 
  - `obterCentroDasGeometrias()` varre as camadas desenhadas pelo usuário. Se for um *pino*, retorna a coordenada; se for um polígono, chama `getBounds().getCenter()` para achar o meio matemático do imóvel.

### 2.5 Fluxo de Salvamento e Data Binding (Eventos)
- Enquanto o usuário mexe no mapa, o formulário real (abaixo do Modal) permanece inalterado.
- Somente ao clicar em **"Salvar Coordenadas"**, o Modal se fecha e a transferência de dados ocorre.
- **Lição Aprendida:** Alterar o `.value` de um campo via JavaScript (`latInput.value = ...`) não avisa aos scripts de auto-save (`sync.js`) que houve mudança, fazendo com que dados antigos de cache prevaleçam ao salvar no banco.
- **Solução:** Imediatamente após alterar os valores, o código força o disparo de eventos de DOM nativos:
  `latInput.dispatchEvent(new Event('input', {bubbles: true}));`
  `latInput.dispatchEvent(new Event('change', {bubbles: true}));`
  `latInput.dispatchEvent(new Event('blur', {bubbles: true}));`
- Isso ativa todas as reatividades do sistema, simulando uma digitação humana, o que apaga de vez qualquer lixo de memória e salva as novas coordenadas oficialmente.

## 3. Resumo de Ferramentas para Outros Projetos
Sempre que o SPU precisar de um componente GEO no futuro, recomenda-se:
1. **Nunca use mapas `inline`** em formulários extensos. O formato *Popup/Modal* é infinitamente mais robusto.
2. **Use JSONP** ou um proxy reverso para lidar com geocoders públicos e crie fallbacks para CEPs genéricos.
3. **Despache Eventos Nativos** (`input`, `change`) sempre que popular dados de formulário via scripts customizados.
4. **Use o `Leaflet.Draw`** como interface primária. O ser humano desenhando no mapa é o melhor e mais assertivo banco de dados possível para o Patrimônio da União.
