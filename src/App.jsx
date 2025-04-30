// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
import AdminPanel from "./pages/AdminPanel";
// import { useEffect } from "react";
// import { uploadQuestionsHis } from "./uploadHisQuestions";

export default function App() {
  // useEffect(() => {
  //   // Викликаємо завантаження питань при першому завантаженні
  //   uploadQuestionsHis();
  // }, []); // Порожній масив залежностей, щоб викликати лише один раз
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/test" element={<TestPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  );
}
