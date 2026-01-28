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

export default function CMSPage() {
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
      <p>Manage all blogs and website content</p>

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
All Blogs
        </div>

        {blogs.length === 0 ? (
          <p style={{ textAlign: "center", color: "#64748b", padding: "40px", background: "#fff", borderRadius: "12px" }}>
            No blogs yet. Create your first blog!
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px",
            }}
          >
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="cms-blog-card"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#fff",
                  boxShadow: "0 4px 20px rgba(15, 23, 42, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  border: "1px solid #e5e7eb",
                  transition: "transform 0.2s, box-shadow 0.2s",
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
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  flex: "1",
                  minHeight: "180px",
                }}>
                  {/* Title - max 2 lines */}
                  <h3
                    onClick={() => navigate(`/cms/blog/${blog._id}`)}
                    style={{ 
                      margin: "0 0 8px 0", 
                      fontSize: "16px", 
                      fontWeight: "600", 
                      color: "#111827", 
                      cursor: "pointer",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {blog.title}
                  </h3>

                  {/* Excerpt - max 3 lines */}
                  <p style={{ 
                    margin: "0 0 12px 0", 
                    color: "#6b7280", 
                    lineHeight: "1.5", 
                    fontSize: "13px",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    flex: "1",
                  }}>
                    {stripHtml(blog.content).substring(0, 120)}...
                  </p>
                  
                  {/* Author info - always show */}
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#6366f1", 
                    marginBottom: "8px",
                    fontWeight: "500",
                  }}>
                    By: {blog.authorName || "Admin"}
                  </div>

                  {/* Meta info */}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "12px",
                    color: "#9ca3af",
                    marginBottom: "12px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid #f3f4f6",
                  }}>
                    <span>{new Date(blog.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span>{Math.max(1, Math.round((blog.content?.length || 0) / 300))} min read</span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleTogglePublish(blog._id)}
                      style={{
                        background: blog.published ? "#fef3c7" : "#d1fae5",
                        color: blog.published ? "#92400e" : "#065f46",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "opacity 0.2s",
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
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "opacity 0.2s",
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
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "opacity 0.2s",
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
