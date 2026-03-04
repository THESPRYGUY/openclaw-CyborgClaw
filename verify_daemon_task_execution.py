#!/usr/bin/env python3
"""Verify daemon task execution by inspecting a marker or log entry.

Usage examples:
  python verify_daemon_task_execution.py --marker /var/run/task_done --max-age 900
  python verify_daemon_task_execution.py --log /var/log/daemon/tasks.log --task-id abc123
  python verify_daemon_task_execution.py --log /var/log/daemon/tasks.log \
    --regex '(?i)task\s+abc123\s+done'
"""
from __future__ import annotations

import argparse
import os
import re
import sys
import time
from typing import Iterable

DEFAULT_MAX_AGE = 15 * 60
DEFAULT_REGEX = r"(?i)\btask\b.*\b{task_id}\b.*\b(done|complete|success)\b"


def tail_lines(path: str, limit: int) -> Iterable[str]:
    """Read the last `limit` lines from a text file."""
    with open(path, "rb") as handle:
        handle.seek(0, os.SEEK_END)
        end = handle.tell()
        block = bytearray()
        lines_found = 0
        offset = 1
        while end - offset >= 0 and lines_found <= limit:
            handle.seek(-offset, os.SEEK_END)
            byte = handle.read(1)
            if byte == b"\n":
                lines_found += 1
                if lines_found > limit:
                    break
            block.extend(byte)
            offset += 1
        data = block[::-1].decode("utf-8", errors="replace")
    return data.splitlines()[-limit:]


def verify_marker(path: str, max_age: int) -> int:
    if not os.path.exists(path):
        print(f"NOT_FOUND marker={path}")
        return 2
    age = time.time() - os.path.getmtime(path)
    if age > max_age:
        print(f"STALE marker={path} age={int(age)}s max_age={max_age}s")
        return 3
    print(f"OK marker={path} age={int(age)}s")
    return 0


def verify_log(path: str, regex: str, max_age: int, tail: int) -> int:
    if not os.path.exists(path):
        print(f"NOT_FOUND log={path}")
        return 2
    pattern = re.compile(regex)
    matched_line = None
    for line in tail_lines(path, tail):
        if pattern.search(line):
            matched_line = line
    if matched_line is None:
        print("NOT_FOUND log_match")
        return 2

    age = time.time() - os.path.getmtime(path)
    if age > max_age:
        print(f"STALE log={path} age={int(age)}s max_age={max_age}s")
        return 3

    print(f"OK log={path} match={matched_line.strip()}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify daemon task execution.")
    parser.add_argument("--marker", help="Path to a marker file written by the task.")
    parser.add_argument("--log", help="Path to a log file containing task completion.")
    parser.add_argument("--task-id", help="Task identifier to interpolate into regex.")
    parser.add_argument("--regex", help="Regex for log match (default uses task-id).")
    parser.add_argument("--max-age", type=int, default=DEFAULT_MAX_AGE)
    parser.add_argument("--tail", type=int, default=200)

    args = parser.parse_args()

    if not args.marker and not args.log:
        print("ERROR: provide --marker or --log")
        return 1

    if args.log:
        regex = args.regex
        if not regex:
            if not args.task_id:
                print("ERROR: --task-id required when --regex is omitted")
                return 1
            regex = DEFAULT_REGEX.format(task_id=re.escape(args.task_id))
        return verify_log(args.log, regex, args.max_age, args.tail)

    return verify_marker(args.marker, args.max_age)


if __name__ == "__main__":
    sys.exit(main())
