import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API_URL from "../config";

const PublicBlogView = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const res = await fetch(`${API_URL}/api/blogs/public/${id}`);
      if (!res.ok) {
        throw new Error("Blog not found");
      }
      const data = await res.json();
      setBlog(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2>Blog Not Found</h2>
        <p>{error}</p>
        <Link to="/blogs" style={styles.backLink}>
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/blogs" style={styles.logoLink}>
            <img
              src="https://www.dfrpms.com/images/Dexter-Capital-Advisors-logo.png"
              alt="Dexter Logo"
              style={styles.logo}
            />
          </Link>
          <nav style={styles.nav}>
            <Link to="/blogs" style={styles.navLink}>
              All Blogs
            </Link>
            <Link to="/login" style={styles.navLinkAlt}>
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Blog Content */}
      <article style={styles.article}>
        {blog.imageUrl && (
          <div style={styles.heroImage}>
            <img src={blog.imageUrl} alt={blog.title} style={styles.image} />
          </div>
        )}

        <div style={styles.content}>
          <h1 style={styles.title}>{blog.title}</h1>

          <div style={styles.meta}>
            <span style={styles.author}>By {blog.authorName || "Admin"}</span>
            <span style={styles.separator}>•</span>
            <span style={styles.date}>{formatDate(blog.createdAt)}</span>
          </div>

          <div
            style={styles.body}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>

      {/* Back Link */}
      <div style={styles.backSection}>
        <Link to="/blogs" style={styles.backButton}>
          ← Back to All Blogs
        </Link>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>© 2026 Delta Investment Advisors. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f7fafc",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: "#4a5568",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #38b2ac",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    color: "#4a5568",
    textAlign: "center",
  },
  backLink: {
    color: "#38b2ac",
    textDecoration: "none",
    fontWeight: "500",
    marginTop: "20px",
  },
  header: {
    background: "#fff",
    borderBottom: "1px solid #e2e8f0",
    padding: "15px 0",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoLink: {
    textDecoration: "none",
  },
  logo: {
    height: "40px",
  },
  nav: {
    display: "flex",
    gap: "15px",
  },
  navLink: {
    color: "#4a5568",
    textDecoration: "none",
    fontWeight: "500",
    padding: "8px 16px",
    borderRadius: "6px",
    background: "#edf2f7",
  },
  navLinkAlt: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
    padding: "8px 16px",
    borderRadius: "6px",
    background: "#38b2ac",
  },
  article: {
    maxWidth: "800px",
    margin: "0 auto",
    background: "#fff",
    marginTop: "30px",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  heroImage: {
    height: "400px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  content: {
    padding: "40px",
  },
  title: {
    margin: "0 0 20px 0",
    fontSize: "36px",
    fontWeight: "700",
    color: "#1a365d",
    lineHeight: "1.3",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#718096",
    fontSize: "15px",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e2e8f0",
  },
  author: {
    fontWeight: "500",
  },
  separator: {
    color: "#cbd5e0",
  },
  date: {},
  body: {
    fontSize: "17px",
    lineHeight: "1.8",
    color: "#4a5568",
  },
  backSection: {
    maxWidth: "800px",
    margin: "30px auto",
    padding: "0 20px",
  },
  backButton: {
    display: "inline-block",
    color: "#38b2ac",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "15px",
  },
  footer: {
    background: "#1a365d",
    color: "#fff",
    textAlign: "center",
    padding: "20px",
    marginTop: "40px",
  },
};

export default PublicBlogView;
