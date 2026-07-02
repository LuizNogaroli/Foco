const fs = require('fs');
let html = fs.readFileSync('foco-02.html', 'utf8');

const oldListener = `      // Adiciona o listener para o botão de abrir Modal
      document.addEventListener('DOMContentLoaded', () => {
          const btnOpen = document.getElementById('btn-open-geo-modal');
          if (btnOpen) {
              btnOpen.addEventListener('click', abrirGeoModal);
          }
      });`;
      
const newListener = `      // Adiciona o listener para o botão de abrir Modal
      document.addEventListener('DOMContentLoaded', () => {
          const btnOpen = document.getElementById('btn-open-geo-modal');
          if (btnOpen) {
              btnOpen.addEventListener('click', abrirGeoModal);
          }
          const btnBuscarCep = document.getElementById('buscar-cep');
          if (btnBuscarCep) {
              btnBuscarCep.addEventListener('click', abrirGeoModal);
          }
      });`;

if (html.includes(oldListener)) {
    html = html.replace(oldListener, newListener);
    html = html.replace(/v=1782355314003/g, 'v=1782355314004');
    fs.writeFileSync('foco-02.html', html, 'utf8');
    console.log('Fixed listener for main page button');
} else {
    console.log('Could not find listener block');
}
