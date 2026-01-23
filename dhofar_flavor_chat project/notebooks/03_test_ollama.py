# Quick test to verify Ollama generation works

from backend.ollama_client import ollama_generate

test_prompt = "اكتب سطر واحد فقط: مرحبا"
print(ollama_generate(test_prompt, model="llama3"))
