import json

log_path = r"C:\Users\luizn\.gemini\antigravity\brain\6ccc312e-0c28-45a5-8374-bac2789ad42a\.system_generated\logs\transcript_full.jsonl"
step_to_find = 862

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        if data.get('step_index') == step_to_find:
            print("FOUND STEP!")
            # Inspect data structure
            # Typically VIEW_FILE has absolute path and we want to print the content
            print(data.keys())
            if 'content' in data:
                content = data['content']
                print(f"Content length: {len(content)}")
                # Save it to a file
                with open("scratch/step_862_foco06.html", "w", encoding="utf-8") as out:
                    out.write(content)
                print("Saved to scratch/step_862_foco06.html")
            else:
                print("No 'content' key in data.")
                # Print some keys/values
                for k, v in data.items():
                    if k != 'content':
                        print(f"{k}: {str(v)[:300]}")
