const fs = require('fs');
let html = fs.readFileSync('foco-02.html', 'utf8');

const targetMapSection = `      <div class="form-group" style="background: transparent; border: none; padding: 0;">
          <div id="map"></div>
          <div style="text-align: right; margin-top: -5px;">
              <button type="button" id="expand-map" class="btn-secondary" style="padding: 5px 15px; font-size: 12px;">↔ Expandir Mapa</button>
          </div>
      </div>`;

const modalHtml = `      <div class="form-group" style="background: transparent; border: none; padding: 0; display: flex; justify-content: center; margin-top: 10px;">
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
    html = html.replace(/v=1782355314002/g, 'v=1782355314003');
    fs.writeFileSync('foco-02.html', html, 'utf8');
    console.log('Patched map DOM successfully!');
} else {
    console.log('Map DOM not found or already replaced.');
}
