// UploadPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
      } else {
        alert("Only PDF, DOCX, and TXT files are allowed.");
      }
    }
  };

  const handleUpload = () => {
    if (!file) return alert("Please select a file first!");

    setUploading(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 10;
      setProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          navigate("/chat", {
            state: {
              fileName: file.name,
              fileUrl: URL.createObjectURL(file),
            },
          });
        }, 500);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Upload a Document</h1>
        <p className="text-gray-500 mb-6">PDF, DOCX, or TXT only.</p>
        <label className="w-full border-2 border-dashed border-purple-400 rounded-xl p-6 cursor-pointer hover:bg-purple-50 transition">
          <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileChange} className="hidden" />
          <p className="text-gray-600">{file ? file.name : "Click or drag a file here to upload"}</p>
        </label>
        {file && !uploading && (
          <button
            onClick={handleUpload}
            className="mt-6 w-full bg-purple-600 text-white py-2 px-4 rounded-xl hover:bg-purple-700 transition"
          >
            Upload & Continue
          </button>
        )}
        {uploading && (
          <div className="mt-6 w-full">
            <div className="bg-purple-100 rounded-full h-4 overflow-hidden">
              <div
                className="bg-purple-600 h-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{progress}% uploaded</p>
          </div>
        )}
      </div>
    </div>
  );
}
