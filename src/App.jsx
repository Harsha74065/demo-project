import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import LoginPage from "./components/LoginPage";
import DashboardLayout from "./components/DashboardLayout";
import CMSPage from "./cms/CMSPage";
import BlogEditor from "./cms/BlogEditor";
import BlogDetail from "./cms/BlogDetail";

function App() {
  const [user, setUser] = useState(true); // temp true for testing

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<h2>Dashboard Working ✅</h2>} />
        <Route path="/cms" element={<CMSPage />} />
        <Route path="/cms/blog/:id" element={<BlogDetail />} />
        <Route path="/cms/editor" element={<BlogEditor />} />
        <Route path="/cms/editor/:id" element={<BlogEditor />} />
      </Route>
    </Routes>
  );
}

export default App;