import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

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

  const getImageUrl = (url) => {
    if (!url) return null;
    if (url.includes("localhost")) {
      return url.replace(/http:\/\/localhost:\d+/, API_URL);
    }
    if (url.startsWith("/uploads")) {
      return `${API_URL}${url}`;
    }
    return url;
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
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

  return (
    <div style={styles.container}>
      {/* Header */}
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
            <Link to="/" style={styles.navLink}>About Us</Link>
            <Link to="/" style={styles.navLink}>Team</Link>
            <div style={styles.dropdown}>
              <span 
                style={styles.navLinkActive}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Insights ▼
              </span>
              {showDropdown && (
                <div style={styles.dropdownContent}>
                  <a href="#newsletters" style={styles.dropdownItem} onClick={() => setShowDropdown(false)}>Quarterly Newsletters</a>
                  <a href="#perspectives" style={styles.dropdownItem} onClick={() => setShowDropdown(false)}>Company Perspective</a>
                  <Link to="/blogs" style={styles.dropdownItem} onClick={() => setShowDropdown(false)}>Blogs</Link>
                </div>
              )}
            </div>
            <Link to="/" style={styles.navLink}>IPO Overview</Link>
            <Link to="/" style={styles.navLink}>Careers</Link>
            <Link to="/" style={styles.navLink}>Contact Us</Link>
          </nav>
        </div>
      </header>

      {/* Blogs Section */}
      <section style={styles.blogsSection}>
        <h1 style={styles.pageTitle}>Blogs</h1>
        
        {blogs.length === 0 ? (
          <div style={styles.noBlogs}>
            <p>No blogs published yet. Check back soon!</p>
          </div>
        ) : (
          <div style={styles.blogsGrid}>
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blog/${blog._id}`}
                style={styles.blogCard}
              >
                {blog.imageUrl && (
                  <div style={styles.blogImageContainer}>
                    <img
                      src={getImageUrl(blog.imageUrl)}
                      alt={blog.title}
                      style={styles.blogImage}
                    />
                  </div>
                )}
                <div style={styles.blogContent}>
                  <h3 style={styles.blogTitle}>{blog.title}</h3>
                  <p style={styles.blogExcerpt}>
                    {stripHtml(blog.content).substring(0, 120)}...
                  </p>
                  <div style={styles.blogMeta}>
                    <span>{formatDate(blog.createdAt)}</span>
                    <span>{Math.max(1, Math.round((blog.content?.length || 0) / 300))} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

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
            <p style={styles.footerSocial}>Find us on:</p>
            <div style={styles.socialIcons}>
              <a href="#" style={styles.socialLink}>𝕏</a>
              <a href="#" style={styles.socialLink}>in</a>
            </div>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Overview</h4>
            <Link to="/" style={styles.footerLink}>About Us</Link>
            <Link to="/" style={styles.footerLink}>Team</Link>
            <Link to="/blogs" style={styles.footerLink}>Insights</Link>
            <Link to="/" style={styles.footerLink}>Careers</Link>
            <Link to="/" style={styles.footerLink}>Contact Us</Link>
          </div>

          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Other Dexter Entities</h4>
            <a href="#" style={styles.footerLink}>Dexter Capital Advisors</a>
            <a href="#" style={styles.footerLink}>Dexter Ventures</a>
            <a href="#" style={styles.footerLink}>Discover Ventures</a>
            <a href="#" style={styles.footerLink}>Dexter Foundation</a>
          </div>
        </div>

        <div style={styles.disclaimer}>
          <p>
            Disclaimer: We are not SEBI registered Investment Advisor. No content on this 
            website should be taken as a recommendation.
          </p>
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
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    minHeight: "100vh",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTopColor: "#c41e3a",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  // Header
  header: {
    background: "#fff",
    borderBottom: "1px solid #e5e7eb",
    padding: "16px 24px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
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
    height: "40px",
  },
  logoDivider: {
    width: "1px",
    height: "40px",
    background: "#e5e7eb",
  },
  deltaLogo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  deltaIcon: {
    color: "#c41e3a",
    fontSize: "24px",
  },
  deltaText: {
    display: "flex",
    flexDirection: "column",
  },
  deltaTitle: {
    fontSize: "18px",
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
    alignItems: "center",
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
    cursor: "pointer",
  },
  dropdown: {
    position: "relative",
  },
  dropdownContent: {
    position: "absolute",
    top: "30px",
    left: "-20px",
    background: "#fff",
    minWidth: "220px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    borderRadius: "8px",
    padding: "8px 0",
    zIndex: 1000,
  },
  dropdownItem: {
    display: "block",
    padding: "14px 24px",
    color: "#374151",
    textDecoration: "none",
    fontSize: "15px",
    cursor: "pointer",
    borderBottom: "1px solid #f3f4f6",
  },

  // Blogs Section
  blogsSection: {
    background: "#FEE2E2",
    padding: "60px 24px",
    minHeight: "60vh",
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1f2937",
    maxWidth: "1200px",
    margin: "0 auto 40px",
  },
  noBlogs: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280",
    fontSize: "18px",
  },
  blogsGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "30px",
  },
  blogCard: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    textDecoration: "none",
    color: "inherit",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  blogImageContainer: {
    height: "200px",
    overflow: "hidden",
  },
  blogImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  blogContent: {
    padding: "24px",
  },
  blogTitle: {
    margin: "0 0 12px 0",
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    lineHeight: "1.4",
  },
  blogExcerpt: {
    margin: "0 0 16px 0",
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.6",
  },
  blogMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#9ca3af",
  },

  // Footer
  footer: {
    background: "#f9fafb",
    borderTop: "1px solid #e5e7eb",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "60px 24px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "60px",
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
    marginBottom: "16px",
  },
  footerSocial: {
    color: "#374151",
    fontSize: "14px",
    marginTop: "16px",
  },
  socialIcons: {
    display: "flex",
    gap: "12px",
  },
  socialLink: {
    width: "32px",
    height: "32px",
    borderRadius: "4px",
    background: "#1f2937",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    fontSize: "14px",
  },
  footerTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "8px",
  },
  footerLink: {
    color: "#6b7280",
    textDecoration: "none",
    fontSize: "14px",
    display: "block",
  },
  disclaimer: {
    background: "#10b981",
    padding: "20px 24px",
    textAlign: "center",
    color: "#fff",
  },
  copyright: {
    textAlign: "center",
    padding: "24px",
    color: "#6b7280",
    fontSize: "14px",
  },
};

export default BlogsPage;
