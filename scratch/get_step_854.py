import json
import re

log_path = r"C:\Users\luizn\.gemini\antigravity\brain\6ccc312e-0c28-45a5-8374-bac2789ad42a\.system_generated\logs\transcript_full.jsonl"
step_to_find = 329

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('step_index') == step_to_find:
            content = data.get('content', '')
            lines = content.split('\n')
            clean_lines = []
            started = False
            for l in lines:
                if "The following code has been modified to include a line number" in l:
                    started = True
                    continue
                if started:
                    if ':' in l:
                        parts = l.split(':', 1)
                        if parts[0].strip().isdigit():
                            val = parts[1]
                            if val.startswith(' '):
                                val = val[1:]
                            val = val.replace('\r', '')
                            clean_lines.append(val)
            
            restored = '\n'.join(clean_lines)
            with open("scratch/step_854_foco06.html", "w", encoding="utf-8") as out:
                out.write(restored)
            print(f"Saved step {step_to_find} to scratch/step_854_foco06.html with {len(clean_lines)} lines")
