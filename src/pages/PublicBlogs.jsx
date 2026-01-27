import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config";

const PublicBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch(`${API_URL}/api/blogs/public`);
      const data = await res.json();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading blogs...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/" style={styles.logoLink}>
            <img
              src="https://www.dfrpms.com/images/Dexter-Capital-Advisors-logo.png"
              alt="Dexter Logo"
              style={styles.logo}
            />
          </Link>
          <nav style={styles.nav}>
            <Link to="/login" style={styles.navLink}>
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Insights & Blogs</h1>
        <p style={styles.heroSubtitle}>
          Discover valuable insights on investing, markets, and more
        </p>
      </section>

      {/* Blogs Grid */}
      <main style={styles.main}>
        {blogs.length === 0 ? (
          <div style={styles.noBlogs}>
            <p>No blogs published yet. Check back soon!</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog._id}`}
                style={styles.card}
              >
                {blog.imageUrl && (
                  <div style={styles.imageContainer}>
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      style={styles.cardImage}
                    />
                  </div>
                )}
                <div style={styles.cardContent}>
                  <h2 style={styles.cardTitle}>{blog.title}</h2>
                  <p style={styles.cardExcerpt}>
                    {stripHtml(blog.content).substring(0, 150)}...
                  </p>
                  <div style={styles.cardMeta}>
                    <span style={styles.author}>
                      By {blog.authorName || "Admin"}
                    </span>
                    <span style={styles.date}>{formatDate(blog.createdAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

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
    gap: "20px",
  },
  navLink: {
    color: "#4a5568",
    textDecoration: "none",
    fontWeight: "500",
    padding: "8px 16px",
    borderRadius: "6px",
    background: "#edf2f7",
    transition: "background 0.2s",
  },
  hero: {
    background: "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)",
    color: "#fff",
    padding: "60px 20px",
    textAlign: "center",
  },
  heroTitle: {
    margin: "0 0 10px 0",
    fontSize: "36px",
    fontWeight: "700",
  },
  heroSubtitle: {
    margin: 0,
    fontSize: "18px",
    opacity: 0.9,
  },
  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  noBlogs: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#718096",
    fontSize: "18px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "30px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    textDecoration: "none",
    color: "inherit",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  imageContainer: {
    height: "200px",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardContent: {
    padding: "24px",
  },
  cardTitle: {
    margin: "0 0 12px 0",
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a365d",
    lineHeight: "1.4",
  },
  cardExcerpt: {
    margin: "0 0 16px 0",
    color: "#718096",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  cardMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#a0aec0",
  },
  author: {
    fontWeight: "500",
  },
  date: {},
  footer: {
    background: "#1a365d",
    color: "#fff",
    textAlign: "center",
    padding: "20px",
    marginTop: "40px",
  },
};

export default PublicBlogs;
