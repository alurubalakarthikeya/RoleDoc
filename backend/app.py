from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests
import json

from utils.processor import process_and_store, query_vector_store

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "documents")
PROMPT_DIR = os.getenv("PROMPT_DIR", "prompts")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(PROMPT_DIR, exist_ok=True)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Process file and store vector
    process_and_store(file_path, file.filename)

    # Save a custom prompt for this file (optional)
    custom_prompt = f"You are an expert assistant for queries related to the document titled '{file.filename}'. Answer with clear and concise explanations based only on the given context."
    with open(os.path.join(PROMPT_DIR, f"{file.filename}.json"), "w") as f:
        json.dump({"system_prompt": custom_prompt}, f)

    return {"message": f"{file.filename} uploaded, processed, and prompt saved."}

@app.post("/query")
async def query_document(query: str = Form(...), file_name: str = Form(...)):
    context = query_vector_store(query, file_name)

    prompt_path = os.path.join(PROMPT_DIR, f"{file_name}.json")
    if os.path.exists(prompt_path):
        with open(prompt_path, "r") as f:
            system_prompt = json.load(f)["system_prompt"]
    else:
       system_prompt = """You are a friendly, thoughtful AI named Roly who helps users learn and build cool things. Use a warm, conversational tone unless the context demands otherwise. Adjust your tone automatically based on the topic without asking the user.
       Behavior Rules:
       1. Default tone: Friendly, casual, slightly quirky, like a supportive tutor who gets excited about ideas.
       2. If the user asks coding-related questions (bugs, how-to, errors), be chill, smart, and concise — like a helpful dev buddy.
       3. If the topic is deep theory (maths, ML, algorithms), stay friendly but be more structured, with analogies or examples if needed.
       4. If the user says "just answer", give direct, no-frills responses.
       5. If it’s a health, emotional, or personal topic, shift to calm and gentle guidance, no overpromising.
       6. If user says “roly”, treat it like a cue that they're confident and just want the essentials.
       7. Avoid repeating facts unnecessarily. Speak like a human, not a manual.
       8. Never say “as an AI language model.”
       9. You are allowed to reason beyond the provided context when answering questions. Do not simply repeat what’s in the context. Use it to guide your response, but aim to explain and teach like a helpful tutor would.
       10. Avoid referencing the 'provided context' or making meta-comments about where the answer came from. Just give clear, confident, helpful responses like a knowledgeable tutor.
       You are designed to make people feel understood, capable, and motivated."""

    user_prompt = f"""You have access to the following background information to help answer the user's question. Use it wisely, but respond naturally and helpfully. You don’t need to repeat it or summarize it unless necessary. Think and explain like a smart human tutor.

Context:
{context}

Question:
{query}

Answer:"""

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
            "Content-Type": "application/json"
        },
        json={
            "model": "mistralai/mistral-7b-instruct",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "max_tokens": 300,
            "temperature": 0.7
        }
    )

    if response.status_code == 200:
        ai_reply = response.json()["choices"][0]["message"]["content"]
        return {"result": ai_reply}
    else:
        return {
            "error": "AI model request failed",
            "details": response.json(),
            "faiss_context": context
        }