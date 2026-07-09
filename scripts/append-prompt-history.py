#!/usr/bin/env python3
"""Append a prompt-history entry from the agent transcript on stop (major tasks only)."""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime
from pathlib import Path

HISTORY_FILE = Path("docs/prompt-history.md")
MAJOR_TOOL_MARKERS = (
    "Write",
    "StrReplace",
    "ApplyPatch",
    "Delete",
    "EditNotebook",
    "Task",
)
PHASE_KEYWORDS: list[tuple[str, re.Pattern[str]]] = [
    ("Setup", re.compile(r"\b(setup|scaffold|init|config|hook|rule)\b", re.I)),
    ("Backend", re.compile(r"\b(api|server|backend|database|db|migration|endpoint)\b", re.I)),
    ("Frontend", re.compile(r"\b(frontend|ui|component|react|css|html)\b", re.I)),
    ("Auth", re.compile(r"\b(auth|login|jwt|session|permission)\b", re.I)),
    ("Testing", re.compile(r"\b(test|spec|ci|lint)\b", re.I)),
    ("DevOps", re.compile(r"\b(deploy|docker|infra|pipeline)\b", re.I)),
    ("Documentation", re.compile(r"\b(doc|readme|prompt-history)\b", re.I)),
    ("Bugfix", re.compile(r"\b(fix|bug|broken|error|regression)\b", re.I)),
    ("Refactor", re.compile(r"\b(refactor|cleanup|reorganize)\b", re.I)),
    ("Planning", re.compile(r"\b(plan|design|architecture|approach)\b", re.I)),
]


def load_input() -> dict:
    raw = sys.stdin.read()
    if not raw.strip():
        return {}
    return json.loads(raw)


def strip_tags(text: str) -> str:
    text = re.sub(r"<user_query>\s*", "", text)
    text = re.sub(r"\s*</user_query>", "", text)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def summarize(text: str, limit: int = 400) -> str:
    cleaned = strip_tags(text)
    if len(cleaned) <= limit:
        return cleaned
    return cleaned[: limit - 3].rstrip() + "..."


def infer_phase(user_text: str, assistant_text: str, transcript_text: str) -> str:
    combined = f"{user_text}\n{assistant_text}\n{transcript_text}"
    for phase, pattern in PHASE_KEYWORDS:
        if pattern.search(combined):
            return phase
    return "Setup"


def infer_objective(user_text: str) -> str:
    cleaned = strip_tags(user_text)
    first_line = cleaned.split(". ")[0].split("\n")[0].strip()
    if len(first_line) > 120:
        return first_line[:117] + "..."
    return first_line or "Complete requested task"


def parse_transcript(path: Path) -> tuple[str, str, str, bool]:
    user_text = ""
    assistant_text = ""
    transcript_blob = ""
    is_major = False

    if not path.is_file():
        return user_text, assistant_text, transcript_blob, is_major

    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            continue

        transcript_blob += line + "\n"
        role = record.get("role")
        message = record.get("message", {})
        content = message.get("content", [])

        if role == "user":
            parts = []
            for block in content:
                if isinstance(block, dict) and block.get("type") == "text":
                    parts.append(block.get("text", ""))
            if parts:
                user_text = "\n".join(parts)

        if role == "assistant":
            parts = []
            for block in content:
                if isinstance(block, dict):
                    if block.get("type") == "text":
                        parts.append(block.get("text", ""))
                    if block.get("type") == "tool_use":
                        tool_name = block.get("name", "")
                        if tool_name in MAJOR_TOOL_MARKERS:
                            is_major = True
            if parts:
                assistant_text = "\n".join(parts)

        if '"tool_use"' in line and any(marker in line for marker in MAJOR_TOOL_MARKERS):
            is_major = True

    return user_text, assistant_text, transcript_blob, is_major


def generation_already_logged(generation_id: str, history: str) -> bool:
    if not generation_id:
        return False
    return f"<!-- gen:{generation_id} -->" in history


def append_entry(
    *,
    date_str: str,
    phase: str,
    objective: str,
    prompt_summary: str,
    output_summary: str,
    generation_id: str,
) -> None:
    HISTORY_FILE.parent.mkdir(parents=True, exist_ok=True)
    if not HISTORY_FILE.exists():
        HISTORY_FILE.write_text(
            "# Prompt History\n\n"
            "Append-only log of major AI-assisted tasks in this project.\n",
            encoding="utf-8",
        )

    history = HISTORY_FILE.read_text(encoding="utf-8")
    if generation_already_logged(generation_id, history):
        return

    marker = f"<!-- gen:{generation_id} -->" if generation_id else ""
    entry = (
        f"\n---\n\n"
        f"## {date_str} — {phase}\n\n"
        f"**Objective:** {objective}\n\n"
        f"**Prompt Summary:** {prompt_summary}\n\n"
        f"**AI Output Summary:** {output_summary}\n\n"
    )
    if marker:
        entry += f"{marker}\n"

    with HISTORY_FILE.open("a", encoding="utf-8") as handle:
        handle.write(entry)


def main() -> int:
    payload = load_input()
    status = payload.get("status", "")
    if status and status != "completed":
        return 0

    generation_id = payload.get("generation_id", "")
    transcript_path = payload.get("transcript_path")
    if not transcript_path:
        return 0

    user_text, assistant_text, transcript_blob, is_major = parse_transcript(
        Path(transcript_path)
    )
    if not is_major or not user_text:
        return 0

    if HISTORY_FILE.exists():
        history = HISTORY_FILE.read_text(encoding="utf-8")
        if generation_already_logged(generation_id, history):
            return 0

    date_str = datetime.now().strftime("%Y-%m-%d")
    phase = infer_phase(user_text, assistant_text, transcript_blob)
    objective = infer_objective(user_text)
    prompt_summary = summarize(user_text)
    output_summary = summarize(assistant_text) if assistant_text else "Task completed (see transcript)."

    append_entry(
        date_str=date_str,
        phase=phase,
        objective=objective,
        prompt_summary=prompt_summary,
        output_summary=output_summary,
        generation_id=generation_id,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
