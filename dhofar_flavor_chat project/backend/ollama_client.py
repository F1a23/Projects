# Ollama text generation helper for the RAG pipeline

import subprocess

def ollama_generate(prompt: str, model: str = "llama3") -> str:
    # Run the model and return the generated text
    result = subprocess.run(
        ["ollama", "run", model],
        input=prompt,
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="ignore"
    )
    return (result.stdout or "").strip()
