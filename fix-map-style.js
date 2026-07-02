const fs = require('fs');
let text = fs.readFileSync('foco-02.html', 'utf8');

const targetStr = `                                          map.setView([lat, lon], 15);
                                          
                                          if (mapMarker) map.removeLayer(mapMarker);
                                          mapMarker = L.marker([lat, lon]).addTo(map);`;
                                          
const replacementStr = `                                          map.setView([lat, lon], 15);
                                          
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
                                          }`;

if (text.includes('map.setView([lat, lon], 15);') && !text.includes('latInput.value = lat;')) {
    text = text.replace(targetStr, replacementStr);
    fs.writeFileSync('foco-02.html', text, 'utf8');
    console.log('Patched foco-02.html map style');
} else {
    console.log('Could not patch html');
}
