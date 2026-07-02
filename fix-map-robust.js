const fs = require('fs');
let text = fs.readFileSync('foco-02.html', 'utf8');

const targetStr = `      // Escuta blur no CEP para buscar coordenadas e mover mapa
      const inputCep = document.getElementById('cep');
      if (inputCep) {
          inputCep.addEventListener('blur', function() {
              const cepVal = this.value.replace(/\\D/g, '');
              if (cepVal.length === 8) {
                  // Busca endereço via viaCEP primeiro para pegar logradouro/cidade, 
                  // mas para o mapa, buscamos no Nominatim pelo CEP ou Cidade
                  fetch('https://viacep.com.br/ws/' + cepVal + '/json/')
                      .then(r => r.json())
                      .then(data => {
                          if (!data.erro) {
                              const query = data.logradouro ? 
                                  \`\${data.logradouro}, \${data.localidade}, \${data.uf}, Brasil\` : 
                                  \`\${data.localidade}, \${data.uf}, Brasil\`;
                              
                              fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query))
                                  .then(r => r.json())
                                  .then(geo => {
                                      if (geo && geo.length > 0) {
                                          const lat = parseFloat(geo[0].lat);
                                          const lon = parseFloat(geo[0].lon);
                                          map.setView([lat, lon], 15);
                                          
                                          if (mapMarker) map.removeLayer(mapMarker);
                                          mapMarker = L.marker([lat, lon]).addTo(map);
                                          
                                          // Preenche Latitude e Longitude se vier do auto-fill
                                          const latInput = document.getElementById('latitude');
                                          const lonInput = document.getElementById('longitude');
                                          if (latInput) {
                                              latInput.value = lat;
                                              latInput.readOnly = true;
                                              latInput.style.backgroundColor = '#e9ecef';
                                              latInput.style.cursor = 'not-allowed';
                                          }
                                          if (lonInput) {
                                              lonInput.value = lon;
                                              lonInput.readOnly = true;
                                              lonInput.style.backgroundColor = '#e9ecef';
                                              lonInput.style.cursor = 'not-allowed';
                                          }
                                      }
                                  })
                                  .catch(err => console.error('Erro Nominatim:', err));
                          }
                      })
                      .catch(err => console.error('Erro ViaCEP:', err));
              }
          });
      }`;

const replacementStr = `      // Função robusta de busca no mapa com fallbacks
      function buscarNoMapa(cepStr) {
          const cepVal = cepStr.replace(/\\D/g, '');
          if (cepVal.length !== 8) return;
          
          fetch('https://viacep.com.br/ws/' + cepVal + '/json/')
              .then(r => r.json())
              .then(data => {
                  if (!data.erro) {
                      const queriesToTry = [];
                      if (data.logradouro) queriesToTry.push(\`\${data.logradouro}, \${data.localidade}, \${data.uf}, Brasil\`);
                      queriesToTry.push(\`\${data.localidade}, \${data.uf}, Brasil\`);
                      queriesToTry.push(\`\${cepVal}, Brasil\`);
                      
                      const tryQuery = (index) => {
                          if (index >= queriesToTry.length) return; // Todas falharam
                          
                          fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(queriesToTry[index]))
                              .then(r => r.json())
                              .then(geo => {
                                  if (geo && geo.length > 0) {
                                      const lat = parseFloat(geo[0].lat);
                                      const lon = parseFloat(geo[0].lon);
                                      map.setView([lat, lon], 15);
                                      
                                      if (mapMarker) map.removeLayer(mapMarker);
                                      mapMarker = L.marker([lat, lon]).addTo(map);
                                      
                                      const latInput = document.getElementById('latitude');
                                      const lonInput = document.getElementById('longitude');
                                      if (latInput) {
                                          latInput.value = lat;
                                          latInput.readOnly = true;
                                          latInput.style.backgroundColor = '#e9ecef';
                                          latInput.style.cursor = 'not-allowed';
                                      }
                                      if (lonInput) {
                                          lonInput.value = lon;
                                          lonInput.readOnly = true;
                                          lonInput.style.backgroundColor = '#e9ecef';
                                          lonInput.style.cursor = 'not-allowed';
                                      }
                                  } else {
                                      tryQuery(index + 1); // Tenta o próximo nível de precisão (fallback)
                                  }
                              })
                              .catch(err => console.error('Erro Nominatim:', err));
                      };
                      
                      tryQuery(0);
                  }
              })
              .catch(err => console.error('Erro ViaCEP:', err));
      }

      // Escuta blur no CEP e click no botão Buscar para buscar coordenadas
      const inputCep = document.getElementById('cep');
      if (inputCep) {
          inputCep.addEventListener('blur', function() {
              buscarNoMapa(this.value);
          });
      }
      const btnBuscarCep = document.getElementById('buscar-cep');
      if (btnBuscarCep) {
          btnBuscarCep.addEventListener('click', function() {
              if (inputCep) buscarNoMapa(inputCep.value);
          });
      }`;

if (text.includes("inputCep.addEventListener('blur', function() {")) {
    text = text.replace(targetStr, replacementStr);
    
    // Bump version string
    text = text.replace('foco-02.js?v=1782355314000', 'foco-02.js?v=1782355314001');
    text = text.replace('sync.js?v=1782355314000', 'sync.js?v=1782355314001');
    
    fs.writeFileSync('foco-02.html', text, 'utf8');
    console.log('Patched map logic with fallback and button click!');
} else {
    console.log('Target string not found');
}
