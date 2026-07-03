import re

html = open('foco-03-v2.html', encoding='utf-8').read()

# 1. Remover o submit de form04 do arquivo extraido, pois ns temos o form03
html = re.sub(r"document\.getElementById\('form04'\)\.addEventListener\('submit',function\(e\)\{[\s\S]*?\}\);", "", html)

# 2. Remover o handler btnEnviarSPU e o btnLimpar que vieram de campo.txt (ns j temos o nosso no final do body do form03)
html = re.sub(r"document\.getElementById\('btnEnviarSPU'\)\.addEventListener\('click',function\(e\)\{[\s\S]*?\}\);", "", html)
html = re.sub(r"document\.getElementById\('btnLimpar'\)\.addEventListener\('click',function\(\)\{[\s\S]*?\}\);", "", html)

# 3. Adicionar toggleBloco e popularCampo53 no incio do nosso JS
js_utils = """
  function toggleBloco(id, mostrar) {
    const el = document.getElementById(id);
    if(el) el.style.display = mostrar ? 'flex' : 'none';
  }
  
  function popularCampo53(tipoImobiliario) {
    const c53 = document.getElementById('campo53');
    if(!c53) return;
    c53.innerHTML = '<option value="">Selecione...</option>';
    if (usoEspecificoMap[tipoImobiliario]) {
        usoEspecificoMap[tipoImobiliario].forEach(item => {
            const opt = document.createElement('option');
            opt.value = item[0];
            opt.textContent = item[1];
            c53.appendChild(opt);
        });
    }
  }

  function limparErro(el, idErr) {
    const err = document.getElementById(idErr);
    if(err) err.style.display = 'none';
    if(el) el.style.borderColor = '';
  }
"""
html = html.replace("const usoEspecificoMap={", js_utils + "\nconst usoEspecificoMap={")

# 4. Modificar o submit do form03 para exigir a declarao assinada
submit_old = """
      document.getElementById('form03').addEventListener('submit', function(e) {
          e.preventDefault();
          const form = e.target;
          if (form.checkValidity()) {
"""
submit_new = """
      document.getElementById('form03').addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Validaao da declarao
          const declFlag = document.getElementById('decl-assinado-flag');
          if (declFlag && declFlag.value !== '1') {
              alert(' Voc precisa assinar o Termo de Declarao antes de salvar e avanar.');
              const errDecl = document.getElementById('err-decl');
              if (errDecl) errDecl.style.display = 'block';
              
              const wrapperDecl = document.getElementById('acordeao-declaracao');
              if (wrapperDecl && !wrapperDecl.classList.contains('aberto')) {
                  wrapperDecl.classList.add('aberto');
                  document.getElementById('acordeao-header-declaracao').setAttribute('aria-expanded', 'true');
              }
              document.getElementById('decl-check1').scrollIntoView({behavior: 'smooth', block: 'center'});
              return;
          }
          
          const form = e.target;
          if (form.checkValidity()) {
"""
html = html.replace(submit_old, submit_new)

# Substituir o antigo campo51 pelo que lida corretamente com a lgica 
# J substitui todo o bloco de campos na etapa anterior. 
# S para garantir que removemos restos da tag de js que duplicou </body>
html = html.replace("</body>\n</html>\n\n</body>", "</body>")

with open('foco-03-final.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Foco-03 final gerado!')
