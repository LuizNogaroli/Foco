const fs = require('fs');
let html = fs.readFileSync('foco-02.html', 'utf8');

// The block we want to replace:
const oldBlock = `<div class="checkbox-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label class="checkbox-option"><input type="checkbox" name="modal_conceituacao[]" value="espelho_dagua"> Espelho d'água</label>
                    <label class="checkbox-option"><input type="checkbox" name="modal_conceituacao[]" value="cavidades_naturais"> Cavidades naturais subterrâneas</label>
                    <label class="checkbox-option"><input type="checkbox" name="modal_conceituacao[]" value="manguezal"> Manguezal</label>
                    <label class="checkbox-option"><input type="checkbox" name="modal_conceituacao[]" value="praia_mar"> Praia marítima</label>
                    <label class="checkbox-option"><input type="checkbox" name="modal_conceituacao[]" value="praia_rio"> Praia fluvial ou lacustre</label>
                </div>`;

const newBlock = `<div class="checkbox-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; background: #fff; border: 1px solid #cbd5e1; border-radius: 4px;">
                        <input type="checkbox" name="modal_conceituacao[]" value="espelho_dagua" style="width:18px; height:18px; cursor:pointer;"> Espelho d'água
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; background: #fff; border: 1px solid #cbd5e1; border-radius: 4px;">
                        <input type="checkbox" name="modal_conceituacao[]" value="cavidades_naturais" style="width:18px; height:18px; cursor:pointer;"> Cavidades naturais subterrâneas
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; background: #fff; border: 1px solid #cbd5e1; border-radius: 4px;">
                        <input type="checkbox" name="modal_conceituacao[]" value="manguezal" style="width:18px; height:18px; cursor:pointer;"> Manguezal
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; background: #fff; border: 1px solid #cbd5e1; border-radius: 4px;">
                        <input type="checkbox" name="modal_conceituacao[]" value="praia_mar" style="width:18px; height:18px; cursor:pointer;"> Praia marítima
                    </label>
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 8px; background: #fff; border: 1px solid #cbd5e1; border-radius: 4px;">
                        <input type="checkbox" name="modal_conceituacao[]" value="praia_rio" style="width:18px; height:18px; cursor:pointer;"> Praia fluvial ou lacustre
                    </label>
                </div>`;

html = html.replace(oldBlock, newBlock);
fs.writeFileSync('foco-02.html', html, 'utf8');
console.log('Fixed checkboxes');
