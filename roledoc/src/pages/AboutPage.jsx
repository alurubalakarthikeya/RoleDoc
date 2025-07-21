// src/pages/AboutPage.jsx
import React from "react";
import "../styles/About.css";
import Navbar from "./Navbar";
import illustration from "../assets/about-illustration.svg"; // Get an SVG from unDraw or use any image

export default function AboutPage() {
  return (
    <div className="about-page">
      <Navbar />
      <div className="about-hero">
        <div className="about-text">
          <h1>Meet RoleDoc</h1>
          <p>
            RoleDoc is a smart document assistant that allows you to **upload, interact, and chat** with your documents like never before.
          </p>
          <p>
            Designed with students, researchers, and professionals in mind, our AI-driven interface helps you save time, boost productivity, and make document navigation intuitive and interactive.
          </p>
        </div>
        <div className="about-illustration">
          <img src={illustration} alt="About Illustration" />
        </div>
      </div>

      <div className="about-values">
        <h2>Why RoleDoc?</h2>
        <ul>
          <li>📄 Simple file upload with support for PDF, DOCX, and TXT</li>
          <li>💬 Natural language interface for querying files</li>
          <li>⚡ Fast, secure, and lightweight</li>
        </ul>
      </div>

      <footer className="about-footer">Made with ❤️ by Carty • RoleDoc © 2025</footer>
    </div>
  );
}
