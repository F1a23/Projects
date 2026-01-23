# Read domain text from a DOCX file (used as a knowledge source for RAG)

from pathlib import Path
from docx import Document

# Define the project root directory
PROJECT_ROOT = Path(r"C:\Users\USER PC\OneDrive\Desktop\dhofar_flavor_chat project")

# Define the path to the domain DOCX file
DOCX_PATH = PROJECT_ROOT / "data" / "raw" / "dhofar flavor.docx"

def read_docx_text(docx_path: str) -> str:
    # Read a DOCX file and return non-empty paragraphs as a single string
    doc = Document(docx_path)
    parts = []
    for p in doc.paragraphs:
        t = (p.text or "").strip()
        if t:
            parts.append(t)
    return "\n".join(parts)

# Run a small test when executed directly
if __name__ == "__main__":
    if not DOCX_PATH.exists():
        print("DOCX not found at:", DOCX_PATH)
    else:
        raw_text = read_docx_text(str(DOCX_PATH))
        print("DOCX loaded. Characters:", len(raw_text))
        print(raw_text[:800])
