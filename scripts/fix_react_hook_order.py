#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import shutil
import sys
from dataclasses import dataclass
from pathlib import Path


HOOK_CALL_RE = re.compile(
    r"""
    ^(?:const|let|var)\s+[\s\S]*?=\s*
    (?:React\.)?
    (?:useState|useEffect|useMemo|useCallback|useRef|useReducer|useLayoutEffect)
    \s*\(
    """,
    re.VERBOSE,
)
BARE_HOOK_RE = re.compile(r"^(?:React\.)?(?:useEffect|useLayoutEffect)\s*\(")
EARLY_RETURN_RE = re.compile(r"^if\s*\([^)]*\)\s*return\b", re.DOTALL)
REGEX_PREFIX_TOKENS = {
    "",
    "(",
    "[",
    "{",
    "=",
    ":",
    ",",
    ";",
    "!",
    "?",
    "&",
    "|",
    "+",
    "-",
    "*",
    "%",
    "^",
    "~",
    ">",
    "return",
    "case",
    "throw",
    "delete",
    "typeof",
    "void",
    "new",
    "in",
    "of",
}


@dataclass
class Statement:
    start: int
    end: int
    text: str


def previous_significant_token(text: str, index: int) -> str:
    index -= 1
    while index >= 0 and text[index].isspace():
        index -= 1
    if index < 0:
        return ""
    if text[index].isalnum() or text[index] in "_$":
        end = index
        while index >= 0 and (text[index].isalnum() or text[index] in "_$"):
            index -= 1
        return text[index + 1 : end + 1]
    return text[index]


def looks_like_regex(text: str, index: int) -> bool:
    if index + 1 >= len(text):
        return False
    next_char = text[index + 1]
    if next_char in "/*=":
        return False
    previous = previous_significant_token(text, index)
    if previous == "<" and next_char.isalpha():
        return False
    return previous in REGEX_PREFIX_TOKENS


def skip_regex_literal(text: str, index: int) -> int:
    index += 1
    in_class = False
    while index < len(text):
        char = text[index]
        if char == "\\":
            index += 2
            continue
        if char == "[" and not in_class:
            in_class = True
        elif char == "]" and in_class:
            in_class = False
        elif char == "/" and not in_class:
            index += 1
            while index < len(text) and (text[index].isalpha() or text[index] == "$"):
                index += 1
            return index
        index += 1
    return index


def skip_quoted(text: str, index: int, quote: str) -> int:
    index += 1
    while index < len(text):
        char = text[index]
        if char == "\\":
            index += 2
            continue
        if char == quote:
            return index + 1
        index += 1
    return index


def skip_line_comment(text: str, index: int) -> int:
    newline = text.find("\n", index + 2)
    return len(text) if newline == -1 else newline + 1


def skip_block_comment(text: str, index: int) -> int:
    end = text.find("*/", index + 2)
    return len(text) if end == -1 else end + 2


def skip_template(text: str, index: int) -> int:
    index += 1
    while index < len(text):
        char = text[index]
        if char == "\\":
            index += 2
            continue
        if char == "`":
            return index + 1
        if char == "$" and index + 1 < len(text) and text[index + 1] == "{":
            index = skip_balanced_expression(text, index + 2, "}")
            continue
        index += 1
    return index


def skip_balanced_expression(text: str, index: int, closing: str) -> int:
    paren = 0
    bracket = 0
    brace = 1 if closing == "}" else 0
    while index < len(text):
        char = text[index]
        nxt = text[index + 1] if index + 1 < len(text) else ""
        if char == "'" or char == '"':
            index = skip_quoted(text, index, char)
            continue
        if char == "`":
            index = skip_template(text, index)
            continue
        if char == "/" and looks_like_regex(text, index):
            index = skip_regex_literal(text, index)
            continue
        if char == "/" and nxt == "/":
            index = skip_line_comment(text, index)
            continue
        if char == "/" and nxt == "*":
            index = skip_block_comment(text, index)
            continue
        if char == "(":
            paren += 1
        elif char == ")":
            paren -= 1
        elif char == "[":
            bracket += 1
        elif char == "]":
            bracket -= 1
        elif char == "{":
            brace += 1
        elif char == "}":
            brace -= 1
            if closing == "}" and paren == 0 and bracket == 0 and brace == 0:
                return index + 1
        index += 1
    return index


def find_matching_brace(text: str, open_index: int) -> int:
    depth = 1
    index = open_index + 1
    while index < len(text):
        char = text[index]
        nxt = text[index + 1] if index + 1 < len(text) else ""
        if char == "'" or char == '"':
            index = skip_quoted(text, index, char)
            continue
        if char == "`":
            index = skip_template(text, index)
            continue
        if char == "/" and looks_like_regex(text, index):
            index = skip_regex_literal(text, index)
            continue
        if char == "/" and nxt == "/":
            index = skip_line_comment(text, index)
            continue
        if char == "/" and nxt == "*":
            index = skip_block_comment(text, index)
            continue
        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return index
        index += 1
    raise ValueError("Could not find matching closing brace for HomeschoolApp")


def split_top_level_statements(body: str) -> list[Statement]:
    statements: list[Statement] = []
    start = 0
    index = 0
    paren = 0
    bracket = 0
    brace = 0
    while index < len(body):
        char = body[index]
        nxt = body[index + 1] if index + 1 < len(body) else ""
        if char == "'" or char == '"':
            index = skip_quoted(body, index, char)
            continue
        if char == "`":
            index = skip_template(body, index)
            continue
        if char == "/" and looks_like_regex(body, index):
            index = skip_regex_literal(body, index)
            continue
        if char == "/" and nxt == "/":
            index = skip_line_comment(body, index)
            continue
        if char == "/" and nxt == "*":
            index = skip_block_comment(body, index)
            continue
        if char == "(":
            paren += 1
        elif char == ")":
            paren -= 1
        elif char == "[":
            bracket += 1
        elif char == "]":
            bracket -= 1
        elif char == "{":
            brace += 1
        elif char == "}":
            brace -= 1
        elif char == ";" and paren == 0 and bracket == 0 and brace == 0:
            end = index + 1
            statements.append(Statement(start, end, body[start:end]))
            start = end
        index += 1
    if start < len(body):
        tail = body[start:]
        if tail.strip():
            statements.append(Statement(start, len(body), tail))
    return statements


def is_hook_statement(statement_text: str) -> bool:
    stripped = statement_text.lstrip()
    return bool(HOOK_CALL_RE.match(stripped) or BARE_HOOK_RE.match(stripped))


def is_early_return(statement_text: str) -> bool:
    return bool(EARLY_RETURN_RE.match(statement_text.lstrip()))


def find_function_body(text: str, function_name: str) -> tuple[int, int]:
    match = re.search(rf"\bfunction\s+{re.escape(function_name)}\s*\(\)\s*\{{", text)
    if not match:
        raise ValueError(f"Could not find function {function_name}() in file")
    open_brace_index = match.end() - 1
    close_brace_index = find_matching_brace(text, open_brace_index)
    return open_brace_index + 1, close_brace_index


def line_number_for_offset(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def rewrite_hook_order(file_path: Path, function_name: str, check_only: bool, backup: bool) -> int:
    source = file_path.read_text(encoding="utf-8")
    body_start, body_end = find_function_body(source, function_name)
    body = source[body_start:body_end]
    statements = split_top_level_statements(body)
    if not statements:
        print("No statements found inside function body.")
        return 0

    first_return_index = next((i for i, stmt in enumerate(statements) if is_early_return(stmt.text)), None)
    if first_return_index is None:
        print("No early return found; nothing to reorder.")
        return 0

    offending_indexes = [i for i, stmt in enumerate(statements[first_return_index + 1 :], start=first_return_index + 1) if is_hook_statement(stmt.text)]
    if not offending_indexes:
        print("Hook order already looks safe. No top-level hooks exist below the first early return.")
        return 0

    offending_lines = [line_number_for_offset(body, statements[i].start) for i in offending_indexes]
    print("Found hook statements below the first early return at body lines:", ", ".join(map(str, offending_lines)))
    if check_only:
        return 1

    before = statements[:first_return_index]
    moved = [statements[i] for i in offending_indexes]
    middle = [stmt for i, stmt in enumerate(statements[first_return_index:]) if (first_return_index + i) not in offending_indexes]
    reordered_body = "".join(stmt.text for stmt in before + moved + middle)
    updated_source = source[:body_start] + reordered_body + source[body_end:]

    if backup:
        backup_path = file_path.with_suffix(file_path.suffix + ".bak")
        shutil.copyfile(file_path, backup_path)
        print(f"Backup written to {backup_path}")

    file_path.write_text(updated_source, encoding="utf-8")
    print(f"Reordered {len(moved)} hook statement(s) in {file_path}")
    return 0


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Hoist top-level React hook statements above the first early return inside HomeschoolApp."
    )
    parser.add_argument("--path", default="js/app.js", help="Path to the source file. Default: js/app.js")
    parser.add_argument("--function", default="HomeschoolApp", help="Function name to inspect. Default: HomeschoolApp")
    parser.add_argument("--check", action="store_true", help="Report bad hook order without rewriting the file.")
    parser.add_argument("--no-backup", action="store_true", help="Do not write a .bak backup file before rewriting.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    file_path = Path(args.path)
    if not file_path.exists():
        print(f"File not found: {file_path}", file=sys.stderr)
        return 2
    try:
        return rewrite_hook_order(
            file_path=file_path,
            function_name=args.function,
            check_only=args.check,
            backup=not args.no_backup,
        )
    except Exception as error:  # noqa: BLE001
        print(f"Hook-order fixer failed: {error}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
