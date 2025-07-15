// ChatPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/Chat.css";
import docProfIcon from "../assets/docprof.png";

export default function ChatPage() {
  const location = useLocation();
  const rawFileName = location.state?.fileName || "RoleDoc";
  const fileName = rawFileName.replace(/\.[^/.]+$/, "");
  const fileUrl = location.state?.fileUrl;

  const [messages, setMessages] = useState([
    { type: "doc", text: `Hey! I'm ${fileName}. What do you want to know?` },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [persona, setPersona] = useState("Friendly");
  const chatRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const docResponse = {
        type: "doc",
        text: getPersonaResponse(input),
      };
      setMessages((prev) => [...prev, docResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const getPersonaResponse = (question) => {
    switch (persona) {
      case "Formal":
        return `You inquired: "${question}". I shall assist you accordingly.`;
      case "Sarcastic":
        return `Oh wow, never heard *that* one before. "${question}"? Groundbreaking. 😏`;
      case "Motivational":
        return `Great question! "${question}" shows you're truly curious. Keep going! 💪`;
      case "Friendly":
      default:
        return `You asked: "${question}". Here's what I think! 😊`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="chat-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          <span className="centered"><img src={docProfIcon} alt="Document Icon" className="docProfile" /><h3>{fileName}</h3></span>
          <select value={persona} onChange={(e) => setPersona(e.target.value)}>
            <option value="Friendly">Friendly</option>
            <option value="Formal">Formal</option>
            <option value="Sarcastic">Sarcastic</option>
            <option value="Motivational">Motivational</option>
          </select>
        </div>
        <div ref={chatRef} className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-bubble ${
                msg.type === "user" ? "message-user" : "message-doc"
              }`}
            >
              <strong>{msg.type === "user" ? "You" : "RoleDoc"}:</strong> {msg.text}
            </div>
          ))}
          {isTyping && <div className="typing-indicator">{fileName} is typing...</div>}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            className="chat-input"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend} className="send-btn">
            Send
          </button>
        </div>
      </div>

      {/* Right - Document Viewer */}
      <div className="doc-container">
        <div className="doc-header">📄 {fileName}</div>
        <div className="doc-content">
          {fileUrl ? (
            <iframe
              src={fileUrl}
              title="Document Viewer"
              width="100%"
              height="100%"
              style={{ border: "none", borderRadius: "12px" }}
            ></iframe>
          ) : (
            <div className="doc-placeholder">
              No document uploaded. Please upload a file to view it here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
