import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config";

const PublicBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
    // Check if admin is logged in
    const token = localStorage.getItem("token");
    if (token) {
      setIsAdmin(true);
    }
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

  // Fix image URLs to use correct backend
  const getImageUrl = (url) => {
    if (!url) return null;
    // If it's a localhost URL, replace with production backend
    if (url.includes("localhost")) {
      return url.replace(/http:\/\/localhost:\d+/, API_URL);
    }
    // If it's a relative path, prepend API_URL
    if (url.startsWith("/uploads")) {
      return `${API_URL}${url}`;
    }
    return url;
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
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logoSection}>
            <div style={styles.dexterLogo}>
              <span style={{fontSize: "24px", color: "#1e40af"}}>🏛️</span>
              <div style={{marginLeft: "8px"}}>
                <div style={{fontSize: "14px", fontWeight: "700", color: "#1e40af"}}>DEXTER</div>
                <div style={{fontSize: "9px", color: "#6b7280"}}>CAPITAL ADVISORS</div>
              </div>
            </div>
            <div style={styles.logoDivider}></div>
            <div style={styles.deltaLogo}>
              <span style={styles.deltaIcon}>&#9650;</span>
              <div style={styles.deltaText}>
                <span style={styles.deltaTitle}>DELTA</span>
                <span style={styles.deltaSubtitle}>Investment Advisors</span>
              </div>
            </div>
          </div>
          <nav style={styles.nav}>
            <a href="#about" style={styles.navLink}>About Us</a>
            <a href="#team" style={styles.navLink}>Team</a>
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
                  <a 
                    href="/blogs" 
                    style={styles.dropdownItem}
                  >
                    Blogs
                  </a>
                </div>
              )}
            </div>
            <a href="#ipo" style={styles.navLink}>IPO Overview</a>
            <a href="#careers" style={styles.navLink}>Careers</a>
            <a href="#contact" style={styles.navLink}>Contact Us</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <h1 style={styles.heroTitle}>
            Investing with<br />
            first-principles thinking
          </h1>
          <p style={styles.heroSubtitle}>
            We want to be part owners of great businesses which are run by exceptional
            people and are available at a reasonable valuation
          </p>
        </div>
      </section>

      {/* Investment Philosophy */}
      <section style={styles.philosophySection}>
        <h2 style={styles.sectionTitle}>Investment Philosophy</h2>
        <p style={styles.philosophyText}>
          Our investment philosophy is grounded in value investing principles and fundamental 
          business understanding, as a result we are extremely selective about our investments 
          and entry valuations.
        </p>
        <p style={styles.philosophyText}>
          We believe the market seldom offers high-quality businesses at reasonable valuation 
          and so our approach is to have the most comprehensive coverage and astute monitoring.
        </p>

        <div style={styles.featuresGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎯</div>
            <h3 style={styles.featureTitle}>Circle of Competence</h3>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔍</div>
            <h3 style={styles.featureTitle}>Extensive Primary Research</h3>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📊</div>
            <h3 style={styles.featureTitle}>Data Driven Decision Making</h3>
          </div>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🔗</div>
            <h3 style={styles.featureTitle}>Leveraging Network for Insights</h3>
          </div>
        </div>
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
            <a href="#about" style={styles.footerLink}>About Us</a>
            <a href="#team" style={styles.footerLink}>Team</a>
            <a href="#insights" style={styles.footerLink}>Insights</a>
            <a href="#careers" style={styles.footerLink}>Careers</a>
            <a href="#contact" style={styles.footerLink}>Contact Us</a>
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
  },
  dexterLogo: {
    display: "flex",
    alignItems: "center",
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
    transition: "color 0.2s",
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

  // Hero
  hero: {
    backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "60px",
  },
  heroOverlay: {
    maxWidth: "600px",
  },
  heroTitle: {
    color: "#fff",
    fontSize: "48px",
    fontWeight: "700",
    lineHeight: "1.2",
    margin: "0 0 24px 0",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: "18px",
    lineHeight: "1.6",
    margin: 0,
  },

  // Philosophy Section
  philosophySection: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "80px 24px",
  },
  sectionTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "24px",
  },
  philosophyText: {
    fontSize: "16px",
    color: "#4b5563",
    lineHeight: "1.8",
    marginBottom: "16px",
    maxWidth: "900px",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
    marginTop: "60px",
  },
  featureCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "40px 24px",
    textAlign: "center",
    transition: "box-shadow 0.2s",
  },
  featureIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  featureTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1f2937",
    margin: 0,
  },

  // Insights Section
  insightsSection: {
    background: "#FEE2E2",
    padding: "80px 24px",
  },
  noBlogs: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#6b7280",
    fontSize: "18px",
  },
  blogsGrid: {
    maxWidth: "1200px",
    margin: "40px auto 0",
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
  readMore: {
    color: "#c41e3a",
    fontWeight: "500",
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
    gridTemplateColumns: "2fr 1fr 1fr",
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
    marginBottom: "20px",
  },
  footerSocial: {
    color: "#4b5563",
    fontSize: "14px",
    margin: "16px 0 8px",
  },
  socialIcons: {
    display: "flex",
    gap: "12px",
  },
  socialLink: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#1f2937",
    color: "#fff",
    borderRadius: "4px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
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

export default PublicBlogs;
