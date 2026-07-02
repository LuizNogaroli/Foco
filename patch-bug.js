const fs = require('fs');
let html = fs.readFileSync('foco-02.html', 'utf8');

// 1. Fix the `buscarNoModal` viaCEP error swallowing
const oldBuscar = `      function buscarNoModal() {
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
      }`;

const newBuscar = `      function buscarNoModal() {
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
                      } else {
                          // ViaCEP retornou erro (ex: CEP genérico), tenta buscar pelo valor original
                          queriesToTry = [val];
                          queryIndex = 0;
                          tentaProximaBusca();
                      }
                  })
                  .catch(err => {
                      console.error('Erro ViaCEP:', err);
                      queriesToTry = [val];
                      queryIndex = 0;
                      tentaProximaBusca();
                  });
          } else {
              queriesToTry = [val];
              queryIndex = 0;
              tentaProximaBusca();
          }
      }`;

// 2. Fix the save event dispatching
const oldSalvar = `      function salvarGeoModal() {
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
      }`;

const newSalvar = `      function salvarGeoModal() {
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
                  latInput.dispatchEvent(new Event('change', {bubbles: true}));
                  latInput.dispatchEvent(new Event('blur', {bubbles: true}));
              }
              if (lonInput) {
                  lonInput.value = centro.lng.toFixed(6);
                  lonInput.readOnly = true;
                  lonInput.style.backgroundColor = '#e9ecef';
                  lonInput.style.cursor = 'not-allowed';
                  lonInput.dispatchEvent(new Event('input', {bubbles: true}));
                  lonInput.dispatchEvent(new Event('change', {bubbles: true}));
                  lonInput.dispatchEvent(new Event('blur', {bubbles: true}));
              }
              fecharGeoModal();
          } else {
              alert('Por favor, desenhe uma área (polígono/retângulo) ou marque um ponto no mapa usando as ferramentas no canto superior direito antes de salvar.');
          }
      }`;

if (html.includes(oldBuscar)) {
    html = html.replace(oldBuscar, newBuscar);
}
if (html.includes(oldSalvar)) {
    html = html.replace(oldSalvar, newSalvar);
}

html = html.replace(/v=1782355314004/g, 'v=1782355314005');
fs.writeFileSync('foco-02.html', html, 'utf8');
console.log('Patched modal bugs!');
