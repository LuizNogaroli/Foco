import json

log_path = r"C:\Users\luizn\.gemini\antigravity\brain\6ccc312e-0c28-45a5-8374-bac2789ad42a\.system_generated\logs\transcript_full.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        step_type = data.get('type', '')
        if 'REPLACE' in step_type or 'WRITE' in step_type:
            content_str = str(data)
            if 'foco-06.html' in content_str:
                print(f"Step {data.get('step_index')} (type: {step_type})")
                for k in data.keys():
                    if k != 'content':
                        print(f"  {k}: {str(data[k])[:150]}")
