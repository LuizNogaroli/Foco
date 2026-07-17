# Histórico de Correção - Aba 2 (Escopo do abrirGeoModal e Botões) - 20260714_0935

## Descrição
Correção de um erro de escopo de chaves no arquivo `foco-02.js`. A função `window.abrirGeoModal` não estava sendo fechada corretamente, fazendo com que toda a lógica de inicialização de Rips, cadastros da Aba 1, e escutas dos botões de salvamento (`btnSalvarRelatorio`, `btnManifestacao`, etc.) fossem declarados dentro de seu escopo. Isso impedia a execução e amarração dos eventos aos botões quando a página era carregada, a menos que o mapa de geolocalização fosse aberto primeiro.

## Estado Anterior (Antes)
```javascript
// Abertura do Modal de Geolocalização (Global)
window.abrirGeoModal = function () {
  const geoModal = document.getElementById("geoModal");
  if (geoModal) {
    geoModal.style.display = "flex";
  }
  if (typeof window.inicializarMapa === "function") {
    window.inicializarMapa();
  }

  const latInput = document.getElementById("latitude")?.value || "";
  const lonInput = document.getElementById("longitude")?.value || "";
  const lat = parseFloat(latInput);
  const lon = parseFloat(lonInput);

  if (!isNaN(lat) && !isNaN(lon)) {
    if (window.drawnItems) {
      window.drawnItems.clearLayers();
      const marker = L.marker([lat, lon]);
      window.drawnItems.addLayer(marker);
      setTimeout(() => {
        if (window.map) window.map.setView([lat, lon], 16);
      }, 400);
    }
  } else {
    const cepStr = document.getElementById("cep")?.value || "";
    if (
      cepStr &&
      (!window.drawnItems || window.drawnItems.getLayers().length === 0)
    ) {
      const modalSearchInput = document.getElementById("modal-search-input");
      if (modalSearchInput) {
        modalSearchInput.value = cepStr;
        if (typeof window.buscarNoModal === "function") {
          window.buscarNoModal();
        }
      }
    }
  }
  // =========================================================================
  // INICIALIZAÇÃO DE RIPS E CADASTROS DA ABA 1
  // =========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    ...
```

E no fim do arquivo existia um `};` sobressalente:
```javascript
  if (btnEnviarCaracterizacao) {
      btnEnviarCaracterizacao.addEventListener("click", () => {
          // ...
      });
  }
};
```

## Estado Novo (Depois)
```javascript
// Abertura do Modal de Geolocalização (Global)
window.abrirGeoModal = function () {
  const geoModal = document.getElementById("geoModal");
  if (geoModal) {
    geoModal.style.display = "flex";
  }
  if (typeof window.inicializarMapa === "function") {
    window.inicializarMapa();
  }

  const latInput = document.getElementById("latitude")?.value || "";
  const lonInput = document.getElementById("longitude")?.value || "";
  const lat = parseFloat(latInput);
  const lon = parseFloat(lonInput);

  if (!isNaN(lat) && !isNaN(lon)) {
    if (window.drawnItems) {
      window.drawnItems.clearLayers();
      const marker = L.marker([lat, lon]);
      window.drawnItems.addLayer(marker);
      setTimeout(() => {
        if (window.map) window.map.setView([lat, lon], 16);
      }, 400);
    }
  } else {
    const cepStr = document.getElementById("cep")?.value || "";
    if (
      cepStr &&
      (!window.drawnItems || window.drawnItems.getLayers().length === 0)
    ) {
      const modalSearchInput = document.getElementById("modal-search-input");
      if (modalSearchInput) {
        modalSearchInput.value = cepStr;
        if (typeof window.buscarNoModal === "function") {
          window.buscarNoModal();
        }
      }
    }
  }
}; // Fechado corretamente!

  // =========================================================================
  // INICIALIZAÇÃO DE RIPS E CADASTROS DA ABA 1
  // =========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    ...
```

E no fim do arquivo a chave extra foi removida/corrigida para `}` ordinário fechando a lógica principal:
```javascript
  if (btnEnviarCaracterizacao) {
      btnEnviarCaracterizacao.addEventListener("click", () => {
          // ...
      });
  }
}
```

## Plano de Rollback / Desfazer
Para desfazer esta correção:
1. Abra o arquivo `foco-02.js`.
2. Localize a linha de fechamento de `window.abrirGeoModal` (que possui `};` logo após a verificação do CEP no modal) e remova o `};`.
3. Vá até a última linha do arquivo `foco-02.js` e adicione `};` ao invés de apenas `}`.
4. Salve o arquivo e verifique com `node -c foco-02.js` se a estrutura continua sem erros de sintaxe (embora o erro lógico de escopo volte a existir).
