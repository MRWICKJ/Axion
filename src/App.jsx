// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Exam from "./pages/Exam";
import Layout from "./components/Layout";
import BigQuestionExam from "./pages/BigExam";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/exam"
        element={
          <Layout>
            <Exam />
          </Layout>
        }
      />
      <Route
        path="/big-exam"
        element={
          <Layout>
            <BigQuestionExam />
          </Layout>
        }
      />
    </Routes>
  );
}
