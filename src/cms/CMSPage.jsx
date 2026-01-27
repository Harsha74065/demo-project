import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API_URL from "../config";

// Helper function to strip HTML tags and get plain text
const stripHtml = (html) => {
  if (!html) return "";
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export default function CMSPage({ user }) {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/blogs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Blog deleted successfully!");
        fetchBlogs();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/blogs/${id}/publish`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchBlogs();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update blog");
      }
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="cms-page">
      <h1>Content Management System</h1>
      <p>
        {user?.role === "admin" 
          ? "Manage all blogs and website content" 
          : "Manage your blogs and website content"}
      </p>

      <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
        <button
          className="primary-btn"
          onClick={() => navigate("/cms/editor")}
          style={{
            background: "#1f2937",
            color: "#fff",
            borderRadius: "6px",
            border: "none",
            padding: "8px 14px",
          }}
        >
          + Create New Blog
        </button>
        <a
          href="/blogs"
          target="_blank"
          style={{
            background: "#e0f2fe",
            color: "#0369a1",
            borderRadius: "6px",
            border: "none",
            padding: "8px 14px",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          View Public Blog Page
        </a>
      </div>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "8px"
        }}>
          {user?.role === "admin" ? "All Blogs" : "My Blogs"}
        </div>

        {blogs.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: "40px", background: "#fff", borderRadius: "12px" }}>
            No blogs yet. Create your first blog!
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "18px",
            }}
          >
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="cms-blog-card"
                style={{
                  borderRadius: "6px",
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 2px 10px rgba(15, 23, 42, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {/* Published Badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                    fontWeight: "600",
                    background: blog.published ? "#d1fae5" : "#fef3c7",
                    color: blog.published ? "#065f46" : "#92400e",
                    zIndex: 1,
                  }}
                >
                  {blog.published ? "Published" : "Draft"}
                </div>

                <div
                  onClick={() => navigate(`/cms/blog/${blog._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {blog.imageUrl ? (
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      style={{
                        width: "100%",
                        height: "170px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div style={{
                      width: "100%",
                      height: "170px",
                      background: "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "32px",
                      color: "#9ca3af"
                    }}>
                      📄
                    </div>
                  )}
                </div>

                <div style={{
                  padding: "14px 16px 12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  flex: "1",
                }}>
                  <h3
                    onClick={() => navigate(`/cms/blog/${blog._id}`)}
                    style={{ margin: 0, fontSize: "16px", fontWeight: "600", color: "#111827", cursor: "pointer" }}
                  >
                    {blog.title}
                  </h3>
                  <p style={{ margin: 0, color: "#6b7280", lineHeight: "1.45", fontSize: "13px" }}>
                    {stripHtml(blog.content).substring(0, 100)}...
                  </p>
                  
                  {/* Author info for admin */}
                  {user?.role === "admin" && blog.authorName && (
                    <div style={{ fontSize: "11px", color: "#8b5cf6", marginTop: "4px" }}>
                      By: {blog.authorName}
                    </div>
                  )}

                  <div style={{
                    marginTop: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#9ca3af"
                  }}>
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    <span>{Math.max(1, Math.round((blog.content?.length || 0) / 300))} min read</span>
                  </div>

                  <div style={{ display: "flex", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
                    <button
                      onClick={() => handleTogglePublish(blog._id)}
                      style={{
                        background: blog.published ? "#fef3c7" : "#d1fae5",
                        color: blog.published ? "#92400e" : "#065f46",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      {blog.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => navigate(`/cms/editor/${blog._id}`)}
                      style={{
                        background: "#111827",
                        color: "#fff",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id, blog.title)}
                      style={{
                        background: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        padding: "6px 10px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
