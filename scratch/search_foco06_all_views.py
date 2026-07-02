import json

log_path = r"C:\Users\luizn\Documents\0-GESTÃO\C01-TRABALHO-SPU\Projeto-Admissibilidade\Foco-08\C01-TRABALHO-SPU-Projeto-Admissibilidade-Foco-08.jsonl" # wait, where is transcript?
# Let's use the path from restore_foco06.py:
log_path = r"C:\Users\luizn\.gemini\antigravity\brain\6ccc312e-0c28-45a5-8374-bac2789ad42a\.system_generated\logs\transcript_full.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') in ['VIEW_FILE', 'PLANNER_RESPONSE', 'SYSTEM']:
            content = str(data)
            if 'foco-06.html' in content:
                print(f"Step {data.get('step_index')}, Type: {data.get('type')}, Len: {len(content)}")
