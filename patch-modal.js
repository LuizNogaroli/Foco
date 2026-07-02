const fs = require('fs');
let html = fs.readFileSync('foco-02.html', 'utf8');

// 1. Injetar o CSS do Modal no <style>
const cssModal = `
      /* MODAL GEO */
      .geo-modal-overlay {
          display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 100000;
          align-items: center; justify-content: center;
      }
      .geo-modal-content {
          background: #fff; width: 90%; max-width: 900px; border-radius: 12px;
          display: flex; flex-direction: column; overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      }
      .geo-modal-header {
          padding: 15px 20px; background: #1e3a5f; color: white;
          display: flex; justify-content: space-between; align-items: center;
      }
      .geo-modal-header h3 { margin: 0; font-size: 1.1em; }
      .geo-modal-close {
          background: none; border: none; color: white; font-size: 1.5em; cursor: pointer;
      }
      .geo-modal-body { padding: 20px; flex: 1; }
      .geo-modal-footer {
          padding: 15px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0;
          display: flex; justify-content: flex-end; gap: 10px;
      }
      #modal-map { height: 500px; width: 100%; border: 1px solid #ddd; border-radius: 8px; }
`;
if (!html.includes('.geo-modal-overlay')) {
    html = html.replace('</style>', cssModal + '\n  </style>');
}

// 2. Substituir o `<div id="map">` original pelo botão e a estrutura do Modal
const targetMapSection = `              <div class="form-group" style="grid-column: 1 / -1;">
                  <div id="map"></div>
              </div>`;
              
const modalHtml = `              <div class="form-group" style="grid-column: 1 / -1; display: flex; justify-content: center; margin-top: 10px;">
                  <button type="button" id="btn-open-geo-modal" class="btn-primary" style="padding: 12px 24px; font-size: 1em; width: auto;">
                      🗺️ Abrir Mapa Interativo e Demarcar
                  </button>
              </div>

              <!-- MODAL GEO -->
              <div id="geoModal" class="geo-modal-overlay">
                  <div class="geo-modal-content">
                      <div class="geo-modal-header">
                          <h3>Demarcação Geográfica</h3>
                          <button type="button" class="geo-modal-close" onclick="fecharGeoModal()">×</button>
                      </div>
                      <div class="geo-modal-body">
                          <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                              <input type="text" id="modal-search-input" placeholder="Buscar endereço ou CEP..." style="flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px;">
                              <button type="button" class="btn-secondary" onclick="buscarNoModal()">🔍 Buscar no Mapa</button>
                          </div>
                          <div id="modal-map"></div>
                          <div style="margin-top: 10px; font-size: 0.85em; color: #64748b;">
                              💡 Dica: Utilize as ferramentas de desenho no canto superior direito do mapa para marcar o ponto ou a área exata.
                          </div>
                      </div>
                      <div class="geo-modal-footer">
                          <button type="button" class="btn-secondary" onclick="fecharGeoModal()">Cancelar</button>
                          <button type="button" class="btn-primary" onclick="salvarGeoModal()">Salvar Coordenadas</button>
                      </div>
                  </div>
              </div>`;

if (html.includes('<div id="map"></div>')) {
    html = html.replace(targetMapSection, modalHtml);
}

// 3. Substituir a lógica do mapa no final do arquivo pela lógica robusta com JSONP e Modal
const scriptStartStr = "// Leaflet Map Logic";
const scriptEndStr = "// Removido listener inline para submit, pois já está no foco-02.js";

const startIdx = html.indexOf(scriptStartStr);
const endIdx = html.indexOf(scriptEndStr);

if (startIdx > -1 && endIdx > -1) {
    const newScript = `// Leaflet Map Logic Modal
      let map = null;
      let drawnItems = null;
      let mapMarker = null;

      function inicializarMapa() {
          if (map) {
              setTimeout(() => { map.invalidateSize(); }, 300);
              return;
          }
          
          map = L.map('modal-map').setView([-15.793889, -47.882778], 4);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          
          drawnItems = new L.FeatureGroup();
          map.addLayer(drawnItems);

          var drawControl = new L.Control.Draw({
              position: 'topright',
              draw: {
                  polygon: true,
                  polyline: false,
                  marker: true,
                  circle: false,
                  rectangle: true,
                  circlemarker: false
              },
              edit: { featureGroup: drawnItems }
          });
          map.addControl(drawControl);

          map.on(L.Draw.Event.CREATED, function (e) {
              drawnItems.clearLayers(); // Permite apenas 1 demarcação ativa para simplificar
              drawnItems.addLayer(e.layer);
          });
      }

      function abrirGeoModal() {
          document.getElementById('geoModal').style.display = 'flex';
          inicializarMapa();
          
          // Se o CEP já estiver preenchido, usa ele para dar um zoom inicial
          const cepStr = document.getElementById('cep').value;
          if (cepStr && (!drawnItems || drawnItems.getLayers().length === 0)) {
              document.getElementById('modal-search-input').value = cepStr;
              buscarNoModal();
          }
      }

      function fecharGeoModal() {
          document.getElementById('geoModal').style.display = 'none';
      }

      // Função de callback global para o JSONP do Nominatim
      window.nominatimCallback = function(geo) {
          if (geo && geo.length > 0) {
              const lat = parseFloat(geo[0].lat);
              const lon = parseFloat(geo[0].lon);
              map.setView([lat, lon], 15);
          } else {
              // Tenta fallback se falhou
              tentaProximaBusca();
          }
      };

      let queriesToTry = [];
      let queryIndex = 0;

      function tentaProximaBusca() {
          if (queryIndex >= queriesToTry.length) {
              console.warn("Busca Nominatim esgotada.");
              return; // Acabaram as tentativas
          }
          
          const scriptId = 'nominatim-jsonp';
          let oldScript = document.getElementById(scriptId);
          if (oldScript) oldScript.remove();
          
          let script = document.createElement('script');
          script.id = scriptId;
          script.src = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(queriesToTry[queryIndex]) + '&json_callback=nominatimCallback';
          document.body.appendChild(script);
          
          queryIndex++;
      }

      function buscarNoModal() {
          const val = document.getElementById('modal-search-input').value.trim();
          if (!val) return;
          
          const cepLimpo = val.replace(/\\D/g, '');
          if (cepLimpo.length === 8) {
              fetch('https://viacep.com.br/ws/' + cepLimpo + '/json/')
                  .then(r => r.json())
                  .then(data => {
                      if (!data.erro) {
                          queriesToTry = [];
                          if (data.logradouro) queriesToTry.push(\`\${data.logradouro}, \${data.localidade}, \${data.uf}, Brasil\`);
                          queriesToTry.push(\`\${data.localidade}, \${data.uf}, Brasil\`);
                          queriesToTry.push(\`\${cepLimpo}, Brasil\`);
                          queryIndex = 0;
                          tentaProximaBusca();
                      }
                  })
                  .catch(err => console.error('Erro ViaCEP:', err));
          } else {
              queriesToTry = [val];
              queryIndex = 0;
              tentaProximaBusca();
          }
      }

      function obterCentroDasGeometrias() {
          if (!drawnItems || drawnItems.getLayers().length === 0) return null;
          let layer = drawnItems.getLayers()[0];
          if (layer instanceof L.Marker) {
              return layer.getLatLng();
          }
          if (layer.getBounds) {
              return layer.getBounds().getCenter();
          }
          return null;
      }

      function salvarGeoModal() {
          const centro = obterCentroDasGeometrias();
          if (centro) {
              const latInput = document.getElementById('latitude');
              const lonInput = document.getElementById('longitude');
              if (latInput) {
                  latInput.value = centro.lat.toFixed(6);
                  latInput.readOnly = true;
                  latInput.style.backgroundColor = '#e9ecef';
                  latInput.style.cursor = 'not-allowed';
                  latInput.dispatchEvent(new Event('input', {bubbles: true}));
              }
              if (lonInput) {
                  lonInput.value = centro.lng.toFixed(6);
                  lonInput.readOnly = true;
                  lonInput.style.backgroundColor = '#e9ecef';
                  lonInput.style.cursor = 'not-allowed';
                  lonInput.dispatchEvent(new Event('input', {bubbles: true}));
              }
              fecharGeoModal();
          } else {
              alert('Por favor, desenhe uma área (polígono/retângulo) ou marque um ponto no mapa usando as ferramentas no canto superior direito antes de salvar.');
          }
      }

      // Adiciona o listener para o botão de abrir Modal
      document.addEventListener('DOMContentLoaded', () => {
          const btnOpen = document.getElementById('btn-open-geo-modal');
          if (btnOpen) {
              btnOpen.addEventListener('click', abrirGeoModal);
          }
      });
      
      `;
      
    html = html.substring(0, startIdx) + newScript + html.substring(endIdx);
    
    // Bump version cache
    html = html.replace(/v=1782355314001/g, 'v=1782355314002');
    
    fs.writeFileSync('foco-02.html', html, 'utf8');
    console.log('Patched modal successfully!');
} else {
    console.log('Script map markers not found!');
}
