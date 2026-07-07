import re

with open('foco-02.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove Edit Toggles (the toggle-label-left / right switches)
content = re.sub(r'<label class="edit-toggle".*?</label>', '', content, flags=re.DOTALL)

# 2. Update buildField to remove yellow background and use blue border for empty unlocked
# Find: bgStyle = 'background-color: #fefce8; border-color: #fde047; box-shadow: 0 0 4px rgba(253,224,71,0.5);';
target_bg_yellow = r"bgStyle = 'background-color: #fefce8; border-color: #fde047; box-shadow: 0 0 4px rgba\(253,224,71,0\.5\);';"
replacement_bg_blue = r"bgStyle = 'background-color: #ffffff; border-color: #3b82f6; box-shadow: 0 0 4px rgba(59,130,246,0.3);';"
content = re.sub(target_bg_yellow, replacement_bg_blue, content)

# 3. Remove Bloco Justificativa in HTML
content = re.sub(r'<!-- Bloco Justificativa.*?</div>\s*</div>\s*</div>\s*(</div><!-- /secao-)', r'\1', content, flags=re.DOTALL)
content = re.sub(r'<div id="blocoJustificativa_secao-[^>]+>.*?</div>\s*</div>\s*</div>', '', content, flags=re.DOTALL)

# 4. Remove window.habilitarEdicaoSecao
pattern_habilitar = r'// ==================== Habilitar Ediç.*?// ==================== Fim Habilitar Edição por Seção ===================='
content = re.sub(pattern_habilitar, '', content, flags=re.DOTALL)
# without accents just in case
pattern_habilitar2 = r'window\.habilitarEdicaoSecao = function.*?// ==================== Fim Habilitar Ed.*?===================='
content = re.sub(pattern_habilitar2, '', content, flags=re.DOTALL)

# 5. Remove transformarCamposComOpcoes
pattern_transformar = r'function transformarCamposComOpcoes\(secao\).*?if \(\!isEditing\) {\s*transformarCamposComOpcoes\(secao\);\s*}\s*};'
content = re.sub(pattern_transformar, '', content, flags=re.DOTALL)
# simpler fallback
content = re.sub(r'function transformarCamposComOpcoes\(secao\) \{.*?\}\s*\};', '', content, flags=re.DOTALL)

# 6. Remove diff engine from Salvar (form02 submit)
# Replace the entire submit listener logic for simplicity
pattern_submit = r"form02\.addEventListener\('submit', function\(e\) \{.*?// Avança para a aba 3"
replacement_submit = """form02.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Formulário Foco-02 salvo (modo simplificado).");
            // Avança para a aba 3"""
content = re.sub(pattern_submit, replacement_submit, content, flags=re.DOTALL)

# 7. Remove atualizarVisibilidadeJustificativaSecao and verificarMudancaInline
content = re.sub(r'function atualizarVisibilidadeJustificativaSecao.*?}', '', content, flags=re.DOTALL)
content = re.sub(r'function verificarMudancaInline.*?}', '', content, flags=re.DOTALL)
content = re.sub(r'const pesquisarRipOriginal = window.pesquisarRip;.*?};', '', content, flags=re.DOTALL)

with open('foco-02.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("foco-02.js cleanup applied!")
