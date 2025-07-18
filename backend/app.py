from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os

from utils.processor import process_and_store, query_vector_store

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "documents"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
    process_and_store(file_path, file.filename)
    return {"message": f"{file.filename} uploaded and processed successfully"}

@app.post("/query")
async def query_document(query: str = Form(...), file_name: str = Form(...)):
    answer = query_vector_store(query, file_name)
    return {"result": answer}  
