import os

bkp_path = r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\antigos\foco-06-bkp-03.html"
target_path = r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\foco-06.html"

with open(bkp_path, 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

# 1. Replace form ID from form04 to form06
html = html.replace('<form id="form04" novalidate>', '<form id="form06" novalidate>')

# 2. Insert comparison area and value fields
area_box_html = """
            <!-- Área e Valor a ser destinada -->
            <div class="form-section area-destinada-box" style="margin-top: 20px; padding: 15px; border: 1px solid #cbd5e1; border-radius: 8px; background-color: #f8fafc;">
                <h3 style="margin-top: 0; color: #1e3a5f; font-size: 1rem; border-bottom: 2px solid #cbd5e1; padding-bottom: 5px; font-weight: bold;">Dados de Comparação de Área e Valor:</h3>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px;">
                    <div class="form-group editavel">
                        <label for="area_total_imovel">Área total do imóvel (m²):</label>
                        <input type="text" id="area_total_imovel" name="area_total_imovel" placeholder="Ex: 5.000,00" autocomplete="off" />
                    </div>
                    <div class="form-group editavel">
                        <label for="valor_total_imovel">Valor total do imóvel (R$):</label>
                        <input type="text" id="valor_total_imovel" name="valor_total_imovel" placeholder="Ex: 1.500.000,00" autocomplete="off" />
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 10px; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
                    <div class="form-group editavel">
                        <label for="area_terreno_destinada">Área do terreno a ser destinada (m²):</label>
                        <input type="text" id="area_terreno_destinada" name="area_terreno_destinada" placeholder="Ex: 1.200,00" autocomplete="off" />
                    </div>
                    <div class="form-group editavel">
                        <label for="area_construida_destinada">Área construída a ser destinada (m²):</label>
                        <input type="text" id="area_construida_destinada" name="area_construida_destinada" placeholder="Ex: 800,00" autocomplete="off" />
                    </div>
                </div>
                
                <div class="form-group editavel" style="margin-top: 10px;">
                    <label for="valor_area_destinada">Valor de referência da área a ser destinada (R$):</label>
                    <input type="text" id="valor_area_destinada" name="valor_area_destinada" placeholder="Ex: 360.000,00" autocomplete="off" />
                </div>
            </div>
"""

target_split = """                <span class="error-msg" id="err53">Selecione o tipo de uso específico pretendido.</span>
            </div>"""

if target_split in html:
    html = html.replace(target_split, target_split + "\n" + area_box_html)
    print("Successfully inserted area comparison box.")
else:
    print("Warning: Could not find insert point for area box.")

# 3. Replace the old Observações / Upload section and button group with the new layout
old_obs_section = """            <!-- Observações / Upload -->
            <div class="form-group editavel">
                <label for="obs224_0">Observações:</label>
                <textarea id="obs224_0" name="imoveis[0][obs_geral_ident]" placeholder=""></textarea>
                <div class="dynamic-list-wrapper" style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
                    <button type="button" class="btn-add" id="btnAdicionarImagemIdent_0"
                        style="align-self: flex-start;">＋ Adicionar link/documento</button>
                    <div id="imagens-list-ident_0"></div>
                </div>
            </div>

            <!-- Botões -->
            <div class="button-group">
                <button type="button" class="btn-secondary" id="btnLimpar">🗑️ Limpar</button>
                <button type="button" id="btnImprimir" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
                <button type="submit" id="btnEnviar">✅ Salvar</button>
            </div>"""

new_bottom_html = """            <!-- Observações -->
            <div class="form-group editavel">
                <label for="observacoes">Observações:</label>
                <textarea id="observacoes" name="observacoes" rows="4" placeholder="Registre informações complementares, se necessário..."></textarea>
            </div>

            <!-- Lista de anexos / documentos (Aba 6) -->
            <div class="form-group editavel" style="margin-top: 25px; border-top: 1px dashed #e2e8f0; padding-top: 15px;">
                <label style="font-weight: bold;">Documentos e Links Anexados (Aba 6 - Proposta de Destinação):</label>
                <div class="dynamic-list-wrapper" style="flex: 1; display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
                    <button type="button" class="btn-add" id="btnAdicionarDocumento06" style="align-self: flex-start;">＋ Adicionar link/documento</button>
                    <div id="documentos-list-06"></div>
                </div>
            </div>

            <!-- Técnico Responsável (Sanfona) -->
            <div class="acordeao-wrapper" id="acordeao-declaracao" style="margin-top: 20px; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
                <div class="acordeao-header" id="header-declaracao" role="button" tabindex="0" style="display: flex; align-items: center; justify-content: flex-start; padding: 15px 20px; background: #1e3a5f; cursor: pointer; user-select: none; gap: 10px; transition: background 0.2s;">
                    <div class="acordeao-titulo" style="display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 1em; color: #ffffff; flex: 1;">📋 Técnico Responsável</div>
                    <span class="acordeao-badge-pendente" id="pendente-ok" style="display: flex; align-items: center; gap: 4px; background: #fef3c7; color: #92400e; font-size: 0.82em; font-weight: 700; padding: 2px 10px; border-radius: 20px; border: 1px solid #fde68a; white-space: nowrap; margin-right: 50px;">⏳ Pendente</span>
                    <span class="acordeao-badge-ok" id="badge-ok" style="display: none; align-items: center; gap: 4px; background: #dcfce7; color: #16a34a; font-size: 0.82em; font-weight: 700; padding: 2px 10px; border-radius: 20px; border: 1px solid #86efac; white-space: nowrap; margin-right: 50px;">✔ Concluído</span>
                    <span class="acordeao-seta" style="color: #fff; transition: transform 0.25s;">▼</span>
                </div>
                <div class="acordeao-corpo" id="corpo-declaracao" style="display: none; padding: 20px; background: #fff; border-top: 1px solid #e2e8f0;">
                    <div id="conteudo-declaracao">
                        <p style="font-size:0.94em; color:#1e293b; margin:0 0 4px;"><strong>Declaro que:</strong></p>
                        <div class="decl-opcao-btns" style="display: flex; flex-direction: column; gap: 10px; margin: 14px 0 6px;">
                            <input type="checkbox" id="decl-check1" name="decl_check1" style="display:none;" />
                            <label class="decl-opcao-btn-label" for="decl-check1" style="display: flex; align-items: flex-start; gap: 12px; padding: 11px 14px; border: 2px solid #cbd5e1; border-radius: 7px; cursor: pointer; background: #f8fafc; transition: border-color 0.18s, background 0.18s, box-shadow 0.18s; font-size: 0.93em; color: #1e293b; line-height: 1.5; user-select: none;">
                                <span class="opcao-icone" style="flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; border: 2px solid #94a3b8; background: #fff; display: flex; align-items: center; justify-content: center; transition: border-color 0.18s, background 0.18s; margin-top: 1px; font-size: 0.75em; color: transparent;">✔</span>
                                <span>As informações consignadas no referido formulário foram inseridas com base nos dados disponíveis nos sistemas oficiais e nas verificações realizadas no âmbito desta unidade.</span>
                            </label>
                        </div>
                    </div>

                    <div class="decl-btn-assinar" style="margin-top: 20px; display: flex; align-items: center; gap: 12px;">
                        <button type="button" class="btn-assinar" id="btn-assinar" disabled style="padding: 8px 22px; background: #1e3a5f; color: #fff; border: none; border-radius: 5px; font-size: 0.93em; font-weight: 600; cursor: pointer;">✍️ Concluir Manifestação</button>
                        <button type="button" id="btn-limpar-decl" style="display:none; padding: 8px 22px; background: #64748b; color: #fff; border: none; border-radius: 5px; font-size: 0.93em; font-weight: 600; cursor: pointer;">Desfazer</button>
                        <span class="decl-status-assinado" id="status-assinado" style="display: none; align-items: center; gap: 6px; color: #16a34a; font-weight: 600;">✔ Manifestação registrada</span>
                    </div>
                    
                    <div class="decl-assinado-overlay" id="overlay-assinado" style="display: none; background: #f0fdf4; border: 1px solid #86efac; border-radius: 5px; padding: 14px 16px; margin-top: 16px; font-size: 0.91em; color: #15803d;">
                        <strong>✔ Manifestação registrada com sucesso.</strong>
                    </div>
                    <input type="hidden" id="flag-assinado" value="0">
                </div>
            </div>

            <!-- Botões -->
            <div class="button-group" style="margin-top: 25px;">
                <button type="button" class="btn-secondary" id="btnLimpar">🗑️ Limpar</button>
                <button type="button" id="btnImprimir" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
                <button type="submit" style="display:none;">Salvar Rascunho</button>
                <button type="button" id="btnEnviarSPU" style="background:#1a7a4a; color:white; border:none; padding:10px 22px; border-radius:5px; font-weight:600; cursor:pointer;">🚀 Salvar e Enviar SPU/UF</button>
            </div>
"""

# Let's clean up line endings so replacement is robust
html_clean = html.replace('\r\n', '\n')
old_obs_clean = old_obs_section.replace('\r\n', '\n')
new_bottom_clean = new_bottom_html.replace('\r\n', '\n')

if old_obs_clean in html_clean:
    html_clean = html_clean.replace(old_obs_clean, new_bottom_clean)
    print("Successfully replaced bottom section.")
else:
    # If the exact indentation is different, we can try to search with regex or a more lenient search
    print("Warning: Could not find exact match for bottom section replacement.")
    # Let's try replacing with a simpler match: search from '<!-- Observações / Upload -->' to the end of form
    import re
    pattern = re.compile(r'<!-- Observações / Upload -->.*?<!-- Botões -->.*?</div>', re.DOTALL)
    if pattern.search(html_clean):
        html_clean = pattern.sub(new_bottom_clean, html_clean)
        print("Replaced bottom section using regex.")
    else:
        print("Failed regex replacement as well.")

# 5. Insert Modal de Confirmação right before scripts and change scripts to load foco-06.js and sync.js
modal_html = """
    <!-- Modal de Confirmação -->
    <div id="modalEnvio" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:2000; align-items:center; justify-content:center;">
        <div style="background:white; padding:30px; border-radius:12px; max-width:500px; width:90%; box-shadow:0 10px 25px rgba(0,0,0,0.3); text-align:center; position:relative; border-top: 8px solid #1a7a4a;">
            <div style="font-size:40px; margin-bottom:15px;">✅</div>
            <h3 style="color:#1e3a5f; margin-bottom:15px;">Envio Realizado!</h3>
            <p style="color:#475569; line-height:1.6; font-size:0.95em;">
                O status da demanda foi atualizado no sistema e estará disponível para a chefia imediata e instâncias superiores na Superintendência para ciência e encaminhamentos, se necessários.
            </p>
            <button type="button" id="btnFecharModal" style="margin-top:25px; width:100%; background:#1e3a5f; color:white; border:none; padding:10px; border-radius:5px; font-weight:600; cursor:pointer;">Entendido</button>
        </div>
    </div>
"""

old_scripts = """    <script src="formulario.js"></script>
    <script src="hints.js"></script>
    <script src="foco-04.js"></script>
    <script src="custom-select.js"></script>"""

new_scripts_and_modal = modal_html + """
    <script src="formulario.js"></script>
    <script src="hints.js"></script>
    <script src="foco-06.js"></script>
    <script src="custom-select.js"></script>
    <script>
        // Inicializa a lista de documentos para a Aba 6
        window.inicializarListaDocumentosDinamica('aba6', 'btnAdicionarDocumento06', 'documentos-list-06');
    </script>
    <script src="sync.js"></script>"""

old_scripts_clean = old_scripts.replace('\r\n', '\n')
new_scripts_clean = new_scripts_and_modal.replace('\r\n', '\n')

if old_scripts_clean in html_clean:
    html_clean = html_clean.replace(old_scripts_clean, new_scripts_clean)
    print("Successfully replaced scripts section.")
else:
    # Try regex or simple replace
    print("Warning: Could not find exact match for scripts section replacement.")
    # Let's replace the script tags directly
    html_clean = html_clean.replace('<script src="foco-04.js"></script>', '<script src="foco-06.js"></script>')
    # And add sync.js before </body>
    body_close = "</body>"
    sync_addition = """    <script>
        // Inicializa a lista de documentos para a Aba 6
        window.inicializarListaDocumentosDinamica('aba6', 'btnAdicionarDocumento06', 'documentos-list-06');
    </script>
    <script src="sync.js"></script>
</body>"""
    html_clean = html_clean.replace(body_close, sync_addition)
    # And insert modal_html before first script
    html_clean = html_clean.replace('<script src="formulario.js"></script>', modal_html + '\n    <script src="formulario.js"></script>')
    print("Applied fallback replacements for scripts and modal.")

with open(target_path, 'w', encoding='utf-8') as f:
    f.write(html_clean)
print("Saved rebuilt foco-06.html!")
