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
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2>Blog Not Found</h2>
        <p>{error}</p>
        <Link to="/" style={styles.backLink}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header - matching main site */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/" style={styles.logoSection}>
            <img
              src="https://www.dfrpms.com/images/Dexter-Capital-Advisors-logo.png"
              alt="Dexter Capital Advisors"
              style={styles.logo}
            />
            <div style={styles.logoDivider}></div>
            <div style={styles.deltaLogo}>
              <span style={styles.deltaIcon}>&#9650;</span>
              <div style={styles.deltaText}>
                <span style={styles.deltaTitle}>DELTA</span>
                <span style={styles.deltaSubtitle}>Investment Advisors</span>
              </div>
            </div>
          </Link>
          <nav style={styles.nav}>
            <a href="/#about" style={styles.navLink}>About Us</a>
            <a href="/#team" style={styles.navLink}>Team</a>
            <Link to="/#insights" style={styles.navLinkActive}>Insights</Link>
            <a href="/#ipo" style={styles.navLink}>IPO Overview</a>
            <a href="/#careers" style={styles.navLink}>Careers</a>
            <a href="/#contact" style={styles.navLink}>Contact Us</a>
          </nav>
        </div>
      </header>

      {/* Blog Content */}
      <article style={styles.article}>
        <div style={styles.articleLayout}>
          {/* Image on left */}
          {blog.imageUrl && (
            <div style={styles.imageSection}>
              <img src={blog.imageUrl} alt={blog.title} style={styles.image} />
            </div>
          )}
          
          {/* Title and meta on right */}
          <div style={styles.titleSection}>
            <h1 style={styles.title}>{blog.title}</h1>
            <div style={styles.meta}>
              <span>{formatDate(blog.createdAt)}</span>
              <span style={styles.separator}>•</span>
              <span>{Math.max(1, Math.round((blog.content?.length || 0) / 300))} min read</span>
            </div>
          </div>
        </div>

        {/* Blog body */}
        <div style={styles.bodySection}>
          <div
            style={styles.body}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Back to insights */}
        <div style={styles.backSection}>
          <Link to="/#insights" style={styles.backButton}>
            ← Back to Insights
          </Link>
        </div>
      </article>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <div style={styles.footerLogo}>
              <span style={styles.deltaIcon}>&#9650;</span>
              <div style={styles.deltaText}>
                <span style={styles.deltaTitle}>DELTA</span>
                <span style={styles.deltaSubtitle}>Investment Advisors</span>
              </div>
            </div>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Overview</h4>
            <Link to="/" style={styles.footerLink}>Home</Link>
            <Link to="/#insights" style={styles.footerLink}>Insights</Link>
          </div>
        </div>
        <div style={styles.disclaimer}>
          <p>Disclaimer: We are not SEBI registered Investment Advisor. No content on this website should be taken as a recommendation.</p>
        </div>
        <div style={styles.copyright}>
          <p>© 2026 Delta Investment Advisors All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#fff",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
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
    borderTop: "4px solid #c41e3a",
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
    color: "#c41e3a",
    textDecoration: "none",
    fontWeight: "500",
    marginTop: "20px",
  },

  // Header
  header: {
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    padding: "12px 0",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    textDecoration: "none",
  },
  logo: {
    height: "45px",
  },
  logoDivider: {
    width: "1px",
    height: "40px",
    background: "#d1d5db",
  },
  deltaLogo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  deltaIcon: {
    color: "#c41e3a",
    fontSize: "28px",
  },
  deltaText: {
    display: "flex",
    flexDirection: "column",
  },
  deltaTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1f2937",
    letterSpacing: "2px",
  },
  deltaSubtitle: {
    fontSize: "10px",
    color: "#6b7280",
    letterSpacing: "0.5px",
  },
  nav: {
    display: "flex",
    gap: "32px",
  },
  navLink: {
    color: "#374151",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "500",
  },
  navLinkActive: {
    color: "#c41e3a",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
  },

  // Article
  article: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 24px",
  },
  articleLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    alignItems: "start",
    marginBottom: "40px",
  },
  imageSection: {
    borderRadius: "12px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  titleSection: {
    paddingTop: "20px",
  },
  title: {
    margin: "0 0 20px 0",
    fontSize: "42px",
    fontWeight: "700",
    color: "#1f2937",
    lineHeight: "1.2",
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#6b7280",
    fontSize: "15px",
  },
  separator: {
    color: "#d1d5db",
  },
  bodySection: {
    maxWidth: "800px",
    margin: "0 auto",
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb",
  },
  body: {
    fontSize: "17px",
    lineHeight: "1.9",
    color: "#374151",
  },
  backSection: {
    marginTop: "40px",
    paddingTop: "20px",
    borderTop: "1px solid #e5e7eb",
  },
  backButton: {
    display: "inline-block",
    color: "#c41e3a",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "15px",
  },

  // Footer
  footer: {
    background: "#f9fafb",
    borderTop: "1px solid #e5e7eb",
    marginTop: "60px",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 24px",
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "40px",
  },
  footerSection: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  footerLogo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  footerTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "8px",
  },
  footerLink: {
    color: "#4b5563",
    textDecoration: "none",
    fontSize: "14px",
    padding: "4px 0",
  },
  disclaimer: {
    background: "#374151",
    color: "#fff",
    padding: "20px 24px",
    textAlign: "center",
    fontSize: "14px",
  },
  copyright: {
    background: "#f9fafb",
    textAlign: "center",
    padding: "20px",
    color: "#6b7280",
    fontSize: "14px",
  },
};

export default PublicBlogView;
