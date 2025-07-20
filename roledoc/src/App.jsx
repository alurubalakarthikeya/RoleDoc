import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadePage";
import ChatPage from "./pages/ChatPage";
import Preloader from "./pages/Preloader";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000); // 5s animation + 1s fade out
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Preloader />}
      {!loading && (
        <div className="app-root fade-in">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<UploadPage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      )}
    </>
  );
}

export default App;
