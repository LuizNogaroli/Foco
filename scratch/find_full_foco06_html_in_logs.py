import json

log_path = r"C:\Users\luizn\.gemini\antigravity\brain\6ccc312e-0c28-45a5-8374-bac2789ad42a\.system_generated\logs\transcript_full.jsonl"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        # Check if this step has tool calls
        tool_calls = data.get('tool_calls', [])
        for tc in tool_calls:
            args = tc.get('arguments', {})
            if isinstance(args, dict):
                target_file = args.get('TargetFile', '')
                if 'foco-06.html' in target_file:
                    print(f"Step {data.get('step_index')} (type: {data.get('type')}) - Tool: {tc.get('name')}")
                    # Print some keys of arguments
                    for k, v in args.items():
                        if k not in ['CodeContent', 'ReplacementContent']:
                            print(f"  {k}: {str(v)[:150]}")
                        else:
                            print(f"  {k} length: {len(v)}")
