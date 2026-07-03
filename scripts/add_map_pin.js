const fs = require('fs');

let html = fs.readFileSync('foco-02.html', 'utf8');

const regexAbrirGeo = /function abrirGeoModal\(\) \{[\s\S]*?buscarNoModal\(\);\n          \}\n      \}/;
const newAbrirGeo = `function abrirGeoModal() {
          document.getElementById('geoModal').style.display = 'flex';
          inicializarMapa();
          
          const latInput = document.getElementById('latitude').value;
          const lonInput = document.getElementById('longitude').value;
          const lat = parseFloat(latInput);
          const lon = parseFloat(lonInput);
          
          if (!isNaN(lat) && !isNaN(lon)) {
              // Se já temos lat/lon preenchidos, coloca o pin
              if (drawnItems) {
                  drawnItems.clearLayers();
                  const marker = L.marker([lat, lon]);
                  drawnItems.addLayer(marker);
                  
                  // Atualiza a visualização do mapa para focar no pin, timeout para dar tempo da DIV renderizar
                  setTimeout(() => { 
                      map.setView([lat, lon], 16); 
                  }, 400);
              }
          } else {
              // Caso não tenha coordenadas, tenta buscar pelo CEP para dar um zoom inicial
              const cepStr = document.getElementById('cep').value;
              if (cepStr && (!drawnItems || drawnItems.getLayers().length === 0)) {
                  document.getElementById('modal-search-input').value = cepStr;
                  buscarNoModal();
              }
          }
      }`;

if (html.match(regexAbrirGeo)) {
    html = html.replace(regexAbrirGeo, newAbrirGeo);
    fs.writeFileSync('foco-02.html', html, 'utf8');
    console.log('Fixed map pin in foco-02.html');
} else {
    console.log('Could not find abrirGeoModal in HTML');
}
