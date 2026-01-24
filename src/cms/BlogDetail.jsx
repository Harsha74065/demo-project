import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API_URL from "../config";

export default function BlogDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`${API_URL}/api/blogs/${id}`);
      if (!response.ok) throw new Error("Blog not found");
      const data = await response.json();
      setBlog(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setLoading(false);
      navigate("/cms");
    }
  };

  useEffect(() => {
    fetchBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>Blog not found</p>
      </div>
    );
  }

  const readTime = Math.max(1, Math.round((blog.content?.length || 0) / 300));

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px" }}>
      {/* Back button */}
      <button
        onClick={() => navigate("/cms")}
        style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          color: "#64748b",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          cursor: "pointer",
          marginBottom: "24px",
        }}
      >
        ← Back to Blogs
      </button>

      {/* Hero image */}
      {blog.imageUrl && (
        <img
          src={blog.imageUrl}
          alt={blog.title}
          style={{
            width: "100%",
            maxHeight: "400px",
            objectFit: "cover",
            borderRadius: "12px",
            marginBottom: "32px",
          }}
        />
      )}

      {/* Title */}
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          color: "#111827",
          marginBottom: "12px",
          lineHeight: "1.3",
        }}
      >
        {blog.title}
      </h1>

      {/* Date and read time */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "14px",
          color: "#6b7280",
          marginBottom: "32px",
        }}
      >
        <span>{new Date(blog.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}</span>
        <span>•</span>
        <span>{readTime} min read</span>
      </div>

      {/* Content */}
      <div
        style={{
          fontSize: "16px",
          lineHeight: "1.8",
          color: "#374151",
        }}
        className="blog-content"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {/* Edit button */}
      <div style={{ marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #e5e7eb" }}>
        <button
          onClick={() => navigate(`/cms/editor/${blog._id}`)}
          style={{
            background: "#111827",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Edit this blog
        </button>
      </div>
    </div>
  );
}
