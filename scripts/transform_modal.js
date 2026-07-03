const fs = require('fs');

let html = fs.readFileSync('foco-02.html', 'utf8');

// Replace the Terrenos Dispensados block
const oldDispensadosRegex = /<div>\s*<h5 style="margin: 0 0 10px 0; color: #ea580c; font-size: 0\.95em;">Terrenos Dispensados de RIP<\/h5>\s*<div class="checkbox-group"[\s\S]*?<\/div>\s*<\/div>/;

const newDispensados = `<div>
                    <h5 style="margin: 0 0 10px 0; color: #ea580c; font-size: 0.95em;">Terrenos Dispensados de RIP</h5>
                    <div style="margin-top: 10px;">
                        <button type="button" onclick="openCadastroMinimo()" style="padding: 10px 15px; border-radius: 6px; background-color: #ea580c; color: white; border: none; cursor: pointer; font-weight: bold; width: 100%; text-align: left;">📝 Preencher Cadastro Mínimo</button>
                        <div id="cadastro-minimo-status" style="margin-top: 8px; font-size: 0.9em; color: #16a34a; display: none;">✅ Cadastro preenchido</div>
                    </div>
                </div>`;

if (html.match(oldDispensadosRegex)) {
    html = html.replace(oldDispensadosRegex, newDispensados);
}

// Replace secaoCadastroMinimo with the Modal
const oldSecaoRegex = /<!-- ========== CADASTRO MÍ.*?========== -->[\s\S]*?<!-- ========== FIM CADASTRO MÍ.*?========== -->/i;
const newModal = `<!-- ========== MODAL CADASTRO MÍNIMO ========== -->
<div id="modalCadastroMinimo" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; justify-content: center; align-items: center;">
    <div style="background: white; border-radius: 12px; width: 850px; max-width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 10px 25px rgba(0,0,0,0.2); position: relative;">
        <!-- Header -->
        <div style="padding: 20px 30px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: white; z-index: 10;">
            <h3 style="margin: 0; color: #ea580c; font-size: 1.4em;">Cadastro Mínimo para Áreas sem RIP</h3>
            <button type="button" onclick="closeCadastroMinimo()" style="background: none; border: none; font-size: 1.5em; cursor: pointer; color: #64748b;">&times;</button>
        </div>
        
        <!-- Body -->
        <div style="padding: 30px; background: #f8fafc;">
            
            <div style="margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #cbd5e1;">
                <h5 style="margin: 0 0 15px 0; color: #334155; font-size: 1.1em;">Selecione o tipo de terreno dispensado:</h5>
                <div class="checkbox-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label class="checkbox-option"><input type="checkbox" name="modal_conceituacao[]" value="espelho_dagua"> Espelho d'água</label>
                    <label class="checkbox-option"><input type="checkbox" name="modal_conceituacao[]" value="cavidades_naturais"> Cavidades naturais subterrâneas</label>
                    <label class="checkbox-option"><input type="checkbox" name="modal_conceituacao[]" value="manguezal"> Manguezal</label>
                    <label class="checkbox-option"><input type="checkbox" name="modal_conceituacao[]" value="praia_mar"> Praia marítima</label>
                    <label class="checkbox-option"><input type="checkbox" name="modal_conceituacao[]" value="praia_rio"> Praia fluvial ou lacustre</label>
                </div>
            </div>

            <style>
                .modal-group { background: #f0f4f8; border-radius: 6px; padding: 12px 16px; border-left: 5px solid #0056b3; }
                .modal-group label { display: block; margin-bottom: 6px; font-weight: bold; color: #000; font-size: 0.9em; }
                .modal-group input[type="text"], .modal-group input[type="number"], .modal-group textarea { width: 100%; border: 1px solid #28a745; border-radius: 4px; padding: 8px; font-size: 0.95em; outline: none; }
                .modal-group input:focus, .modal-group textarea:focus { border-color: #218838; box-shadow: 0 0 0 2px rgba(40,167,69,0.25); }
                .btn-add-doc { background: transparent; border: 1px dashed #0056b3; color: #0056b3; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 0.9em; font-weight: 500; }
                .btn-add-doc:hover { background: #e6f0fa; }
            </style>

            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px; margin-bottom: 15px;">
                <div class="modal-group">
                    <label for="cep_sem_rip">CEP <span style="color:red">*</span>:</label>
                    <input type="text" id="cep_sem_rip" placeholder="00000-000" onblur="buscarCep(this.value)" oninput="this.value = this.value.replace(/[^0-9]/g, '').replace(/(\\d{5})(\\d{3})/, '$1-$2')" maxlength="9">
                </div>
                <div class="modal-group">
                    <label for="logradouro_sem_rip">Logradouro:</label>
                    <input type="text" id="logradouro_sem_rip" placeholder="Preenchimento automático">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 15px; margin-bottom: 15px;">
                <div class="modal-group">
                    <label for="municipio_sem_rip">Município:</label>
                    <input type="text" id="municipio_sem_rip" placeholder="Preenchimento automático">
                </div>
                <div class="modal-group">
                    <label for="uf_sem_rip">UF:</label>
                    <input type="text" id="uf_sem_rip" placeholder="RJ">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px; margin-bottom: 15px;">
                <div class="modal-group">
                    <label for="numero_sem_rip">Número:</label>
                    <input type="text" id="numero_sem_rip" placeholder="515">
                </div>
                <div class="modal-group">
                    <label for="complemento_sem_rip">Complemento:</label>
                    <input type="text" id="complemento_sem_rip" placeholder="Casa 102">
                </div>
            </div>

            <div class="modal-group" style="margin-bottom: 15px;">
                <label for="area_sem_rip">Área a ser destinada (m²) <span style="color:red">*</span>:</label>
                <input type="number" id="area_sem_rip" placeholder="Ex: 5000">
            </div>
            
            <div class="modal-group">
                <label for="obs_geral_01">Observações:</label>
                <textarea id="obs_geral_01" rows="3" placeholder="Escreva observações aqui..."></textarea>
                
                <div style="margin-top: 15px;">
                    <input type="file" id="arquivo_minimo" accept=".pdf, .png, .jpg, .jpeg" style="display: none;" onchange="handleArquivoMinimo(this)">
                    <button type="button" class="btn-add-doc" onclick="document.getElementById('arquivo_minimo').click()">+ Adicionar link/documento</button>
                    <div id="arquivo_minimo_status" style="margin-top: 10px; font-size: 0.85em; color: #0056b3;"></div>
                </div>
            </div>
            
        </div>
        
        <!-- Footer -->
        <div style="padding: 20px 30px; border-top: 1px solid #e2e8f0; background: white; text-align: right; border-radius: 0 0 12px 12px;">
            <button type="button" onclick="closeCadastroMinimo()" style="padding: 10px 20px; border: 1px solid #cbd5e1; background: white; border-radius: 6px; cursor: pointer; margin-right: 10px;">Cancelar</button>
            <button type="button" onclick="salvarCadastroMinimo()" style="padding: 10px 20px; border: none; background: #28a745; color: white; border-radius: 6px; cursor: pointer; font-weight: bold;">Salvar Cadastro</button>
        </div>
    </div>
</div>
<!-- ========== FIM MODAL CADASTRO MÍNIMO ========== -->`;

if (html.match(oldSecaoRegex)) {
    html = html.replace(oldSecaoRegex, newModal);
} else {
    // If it fails to match strictly, we can just append it at the end of the body
    console.log("Could not find secaoCadastroMinimo regex, appending to the end");
    html = html.replace('</body>', newModal + '\n</body>');
}

fs.writeFileSync('foco-02.html', html, 'utf8');

// Now we patch foco-02.js
let js = fs.readFileSync('foco-02.js', 'utf8');

// Modify verificarConceituacao to ignore dispensaRIP block logic
const oldVerificar = /if \(dispensaRIP\) \{[\s\S]*?else \{[\s\S]*?secaoMinimo\.style\.display = 'none';\s*\}/;
if (js.match(oldVerificar)) {
    js = js.replace(oldVerificar, `// Cadastro mínimo agora é acionado por botão, não mais exibido inline`);
}

const newJsLogic = `
window.openCadastroMinimo = function() {
    document.getElementById('modalCadastroMinimo').style.display = 'flex';
};

window.closeCadastroMinimo = function() {
    document.getElementById('modalCadastroMinimo').style.display = 'none';
};

let arquivoBase64 = null;
let arquivoNome = null;

window.handleArquivoMinimo = function(input) {
    const file = input.files[0];
    if (file) {
        arquivoNome = file.name;
        const statusDiv = document.getElementById('arquivo_minimo_status');
        statusDiv.innerHTML = 'Carregando arquivo...';
        
        const reader = new FileReader();
        reader.onload = function(e) {
            arquivoBase64 = e.target.result;
            statusDiv.innerHTML = '✅ Arquivo anexado: <strong>' + arquivoNome + '</strong> <button type="button" onclick="removerArquivoMinimo()" style="background:none; border:none; color:red; cursor:pointer; margin-left:10px;">[Remover]</button>';
        };
        reader.onerror = function() {
            alert("Erro ao ler o arquivo.");
            statusDiv.innerHTML = '';
        }
        reader.readAsDataURL(file);
    }
};

window.removerArquivoMinimo = function() {
    arquivoBase64 = null;
    arquivoNome = null;
    document.getElementById('arquivo_minimo').value = '';
    document.getElementById('arquivo_minimo_status').innerHTML = '';
};

window.salvarCadastroMinimo = function() {
    const cep = document.getElementById('cep_sem_rip').value;
    const area = document.getElementById('area_sem_rip').value;
    
    if (!cep || !area) {
        alert("Por favor, preencha pelo menos o CEP e a Área a ser destinada.");
        return;
    }

    // Get checked checkboxes in modal
    const checks = document.querySelectorAll('input[name="modal_conceituacao[]"]:checked');
    const tiposDispensados = Array.from(checks).map(c => c.value);

    const dadosCadastro = {
        tipos_dispensados: tiposDispensados,
        cep: cep,
        logradouro: document.getElementById('logradouro_sem_rip').value,
        municipio: document.getElementById('municipio_sem_rip').value,
        uf: document.getElementById('uf_sem_rip').value,
        numero: document.getElementById('numero_sem_rip').value,
        complemento: document.getElementById('complemento_sem_rip').value,
        area: area,
        observacoes: document.getElementById('obs_geral_01').value,
        arquivo_nome: arquivoNome,
        arquivo_base64: arquivoBase64
    };

    if (!window.parent.formDataState) {
        window.parent.formDataState = {};
    }
    
    window.parent.formDataState.cadastro_minimo = dadosCadastro;
    
    document.getElementById('cadastro-minimo-status').style.display = 'block';
    
    closeCadastroMinimo();
    alert("Cadastro Mínimo salvo com sucesso! Os dados e anexos foram gravados na memória e irão compor o relatório.");
};
`;

js = js.trim() + '\n\n' + newJsLogic;
fs.writeFileSync('foco-02.js', js, 'utf8');

console.log('Scripts and HTML patched!');
