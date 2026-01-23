# Chunking utilities for splitting domain text into recipe blocks

import re

def split_recipes_docx(text: str):
    # Split text into recipe blocks using the DF-ID markers
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    blocks = []
    current = []

    id_pattern = re.compile(r"^ID\s*:\s*DF-\S+", re.IGNORECASE)

    for line in lines:
        if id_pattern.match(line):
            # Save the previous block when a new ID starts
            if current:
                blocks.append("\n".join(current).strip())
                current = []
            current.append(line)
        else:
            # Append normal lines to the current block
            current.append(line)

    # Save the last block
    if current:
        blocks.append("\n".join(current).strip())

    # Fix ordering if the ID line appears before the recipe name
    fixed_blocks = []
    for b in blocks:
        b_lines = b.splitlines()
        if len(b_lines) >= 2 and id_pattern.match(b_lines[0]) and not id_pattern.match(b_lines[1]):
            b_lines = [b_lines[1], b_lines[0]] + b_lines[2:]
        fixed_blocks.append("\n".join(b_lines))

    return fixed_blocks

if __name__ == "__main__":
    # Minimal self-test
    sample = "Dish Name\nID: DF-001\nIngredients: ...\n"
    out = split_recipes_docx(sample)
    print("Blocks:", len(out))
