import subprocess, shutil

def check_ollama(model="llama3"):
    if shutil.which("ollama") is None:
        return "Ollama is not found in PATH. Install Ollama, then open a new terminal."

    r = subprocess.run(["ollama", "list"], text=True, capture_output=True, encoding="utf-8", errors="ignore")
    if r.returncode != 0:
        return "Ollama is installed but not running. Run: ollama serve\n" + (r.stderr or "").strip()[:400]

    out = (r.stdout or "").strip()
    if model not in out:
        return f"Ollama is running but model ({model}) is not available. Run: ollama pull {model}\n\nAvailable models:\n{out}"

    t = subprocess.run(
        ["ollama", "run", model],
        input="Say only: OK",
        text=True,
        capture_output=True,
        encoding="utf-8",
        errors="ignore"
    )
    if t.returncode == 0 and (t.stdout or "").strip():
        return "Ollama is ready.\n" + t.stdout.strip()[:200]

    return "Ollama is running but the test prompt returned an empty response.\n" + (t.stderr or "").strip()[:300]
