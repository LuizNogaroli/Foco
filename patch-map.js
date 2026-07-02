const fs = require('fs');
let text = fs.readFileSync('foco-02.html', 'utf8');

const mapInitTarget = `      // Leaflet Map Logic
      var map = L.map('map').setView([-15.793889, -47.882778], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);`;

const mapInitReplacement = `      // Leaflet Map Logic
      var map = L.map('map').setView([-15.793889, -47.882778], 4);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      
      var mapMarker = null;

      // Escuta blur no CEP para buscar coordenadas e mover mapa
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
                                      }
                                  })
                                  .catch(err => console.error('Erro Nominatim:', err));
                          }
                      })
                      .catch(err => console.error('Erro ViaCEP:', err));
              }
          });
      }`;

if (text.includes("var map = L.map('map')")) {
    text = text.replace(mapInitTarget, mapInitReplacement);
    fs.writeFileSync('foco-02.html', text, 'utf8');
    console.log('Patched foco-02.html successfully.');
} else {
    console.log('Target string not found');
}
