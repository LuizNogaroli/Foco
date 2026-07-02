const fs = require('fs');
const path = require('path');
const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.startsWith('foco-') && f.endsWith('.html') && !f.includes('resumo'));

const btnHtml = `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; text-align: right;">
            <button type="button" class="btn-action" style="font-size: 1.1em; padding: 12px 24px; background-color: #28a745; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: bold; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" onclick="window.parent.saveToFinal ? window.parent.saveToFinal().then(res => { if(res) alert('Aba salva com sucesso na tabela definitiva!'); }) : alert('Função não disponível no modo isolado.')">
                💾 Salvar Aba na Tabela Definitiva
            </button>
        </div>
</form>`;

files.forEach(f => {
    let content = fs.readFileSync(path.join(dir, f), 'utf8');
    if (!content.includes('Salvar Aba na Tabela Definitiva') && content.includes('</form>')) {
        content = content.replace('</form>', btnHtml);
        fs.writeFileSync(path.join(dir, f), content);
        console.log('Updated ' + f);
    }
});
