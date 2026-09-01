#!/usr/bin/env python3
"""Compresses conversation context into YAML snapshots before compaction."""
import sys, json, os, re
from datetime import datetime

_QH = os.path.dirname(os.path.dirname(os.path.abspath(__file__))).replace("\\", "/")
MEMORY_DIR = _QH + "/memories"
SNAPSHOT_DIR = _QH + "/memories/_snapshots"

def distill(transcript_text):
    """Extract key decisions, file changes, and open questions from transcript."""
    snapshot = {
        "timestamp": datetime.now().isoformat(),
        "decisions_made": [],
        "files_changed": [],
        "open_questions": [],
        "key_context": [],
        "lessons_learned": []
    }

    lines = transcript_text.split("\n") if transcript_text else []

    for line in lines:
        line_lower = line.lower().strip()
        # Extract decisions
        if any(kw in line_lower for kw in ["decided", "chose", "selected", "using", "will use"]):
            snapshot["decisions_made"].append(line.strip()[:200])
        # Extract file changes
        if any(kw in line_lower for kw in ["created", "modified", "wrote", "updated", "deleted"]):
            match = re.search(r'[\w\-./\\]+\.\w+', line)
            if match:
                snapshot["files_changed"].append(match.group())
        # Extract questions
        if "?" in line and any(kw in line_lower for kw in ["how", "what", "why", "should", "can"]):
            snapshot["open_questions"].append(line.strip()[:200])
        # Extract lessons
        if any(kw in line_lower for kw in ["lesson", "learned", "mistake", "fix", "avoid", "remember"]):
            snapshot["lessons_learned"].append(line.strip()[:200])

    # Deduplicate
    for key in snapshot:
        if isinstance(snapshot[key], list):
            snapshot[key] = list(dict.fromkeys(snapshot[key]))[:10]

    return snapshot

def save_snapshot(snapshot):
    """Save snapshot to memory directory."""
    os.makedirs(SNAPSHOT_DIR, exist_ok=True)
    filename = f"snapshot_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    filepath = os.path.join(SNAPSHOT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, indent=2, ensure_ascii=False)
    print(json.dumps({"status": "saved", "file": filepath, "decisions": len(snapshot["decisions_made"]), "lessons": len(snapshot["lessons_learned"])}))

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        payload = json.loads(input_data) if input_data.strip() else {}
        transcript = payload.get("transcript", "")
        snapshot = distill(transcript)
        save_snapshot(snapshot)
    except Exception as e:
        print(json.dumps({"status": "error", "message": str(e)}))
        sys.exit(0)