import os
import re

antigos_dir = r"c:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\antigos"

for f in os.listdir(antigos_dir):
    if 'foco-06' in f:
        path = os.path.join(antigos_dir, f)
        if os.path.isdir(path):
            continue
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as file:
                content = file.read()
            
            form_id = re.search(r'<form\s+id="([^"]+)"', content)
            form_id_str = form_id.group(1) if form_id else "None"
            
            has_area_total = 'area_total' in content
            has_valor_total = 'valor_total' in content or 'valor_imovel' in content
            has_declaracao = 'declaracao' in content
            has_btn_enviar_spu = 'btnEnviarSPU' in content
            has_modal_envio = 'modalEnvio' in content
            has_documentos_list = 'documentos-list' in content
            has_sync = 'sync.js' in content
            
            print(f"{f} ({len(content)} bytes):")
            print(f"  Form ID: {form_id_str}")
            print(f"  Flags: area_total={has_area_total}, valor_total={has_valor_total}, declaracao={has_declaracao}, btnEnviarSPU={has_btn_enviar_spu}, modalEnvio={has_modal_envio}, documentos={has_documentos_list}, sync={has_sync}")
        except Exception as e:
            print(f"Error: {e}")
