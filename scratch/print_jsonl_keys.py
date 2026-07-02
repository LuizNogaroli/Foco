import json

log_path = r"C:\Users\luizn\.gemini\antigravity\brain\6ccc312e-0c28-45a5-8374-bac2789ad42a\.system_generated\logs\transcript_full.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        content_str = str(data)
        if 'foco-06.html' in content_str:
            print("FOUND ENTRY!")
            print(f"Type: {data.get('type')}, Step: {data.get('step_index')}")
            for k in data.keys():
                if k != 'content':
                    print(f"  {k}: {str(data[k])[:200]}")
            break
