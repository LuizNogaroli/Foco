import json
import re

log_path = r"C:\Users\luizn\.gemini\antigravity\brain\6ccc312e-0c28-45a5-8374-bac2789ad42a\.system_generated\logs\transcript_full.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'VIEW_FILE':
            content = data.get('content', '')
            # Find the path in content
            match = re.search(r'File Path:\s*`file:///(.*?)`', content)
            if match:
                file_path = match.group(1)
                if 'foco-06.html' in file_path.lower() and not file_path.endswith('.md'):
                    print(f"Step {data.get('step_index')}: {file_path} - length of content: {len(content)}")
