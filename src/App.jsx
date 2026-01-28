import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import DashboardLayout from "./components/DashboardLayout";
import CMSPage from "./cms/CMSPage";
import BlogEditor from "./cms/BlogEditor";
import BlogDetail from "./cms/BlogDetail";
import PublicBlogs from "./pages/PublicBlogs";
import PublicBlogView from "./pages/PublicBlogView";
import AdminUsers from "./pages/AdminUsers";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing login
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/blogs" element={<PublicBlogs />} />
      <Route path="/blog/:id" element={<PublicBlogView />} />
      <Route
        path="/login"
        element={
          user ? <Navigate to="/cms" /> : <AuthPage onLogin={handleLogin} />
        }
      />

      {/* Protected Routes */}
      {user ? (
        <Route element={<DashboardLayout user={user} onLogout={handleLogout} />}>
          <Route path="/" element={<Navigate to="/cms" />} />
          <Route path="/dashboard" element={<h2>Dashboard Working ✅</h2>} />
          <Route path="/cms" element={<CMSPage />} />
          <Route path="/cms/blog/:id" element={<BlogDetail />} />
          <Route path="/cms/editor" element={<BlogEditor user={user} />} />
          <Route path="/cms/editor/:id" element={<BlogEditor user={user} />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} />
      )}
    </Routes>
  );
}

export default App;
