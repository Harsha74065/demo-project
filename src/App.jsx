import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthPage from "./components/AuthPage";
import DashboardLayout from "./components/DashboardLayout";
import CMSPage from "./cms/CMSPage";
import BlogEditor from "./cms/BlogEditor";
import BlogDetail from "./cms/BlogDetail";
import PublicBlogs from "./pages/PublicBlogs";
import PublicBlogView from "./pages/PublicBlogView";
import BlogsPage from "./pages/BlogsPage";
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
      {/* Public Routes - Anyone can access */}
      <Route path="/" element={<PublicBlogs />} />
      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="/blog/:id" element={<PublicBlogView />} />
      
      {/* Admin Login */}
      <Route
        path="/login"
        element={
          user ? <Navigate to="/cms" /> : <AuthPage onLogin={handleLogin} />
        }
      />

      {/* Protected Admin Routes */}
      {user ? (
        <Route element={<DashboardLayout user={user} onLogout={handleLogout} />}>
          <Route path="/dashboard" element={<h2>Dashboard Working</h2>} />
          <Route path="/cms" element={<CMSPage />} />
          <Route path="/cms/blog/:id" element={<BlogDetail />} />
          <Route path="/cms/editor" element={<BlogEditor user={user} />} />
          <Route path="/cms/editor/:id" element={<BlogEditor user={user} />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      ) : null}
    </Routes>
  );
}

export default App;
