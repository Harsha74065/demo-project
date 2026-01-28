import { Link, useLocation, Outlet } from "react-router-dom";

/* SVG Icons */
const icons = {
  dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  investors: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>,
  tracker: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 10 10M12 2v10l7 7"/></svg>,
  people: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  pipeline: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  mandates: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
  inbox: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>,
  users: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  profile: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  cms: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
  cmsDelta: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
};

export default function DashboardLayout({ user, onLogout }) {
  const { pathname } = useLocation();

  const isActive = (path) =>
    pathname.startsWith(path) ? "active" : "";

  // Admin menu items (only admin can login now)
  const menuItems = [
    { icon: icons.dashboard, label: "Dashboard", path: "/dashboard" },
    { icon: icons.investors, label: "Investors", path: "/investors" },
    { icon: icons.tracker, label: "Master Investor\nTracker", path: "/tracker" },
    { icon: icons.people, label: "People", path: "/people" },
    { icon: icons.pipeline, label: "Pipeline", path: "/pipeline" },
    { icon: icons.mandates, label: "Mandates", path: "/mandates" },
    { icon: icons.inbox, label: "Inbox", path: "/inbox" },
    { icon: icons.users, label: "Manage Users", path: "/admin/users" },
    { icon: icons.profile, label: "Profile", path: "/profile" },
    { icon: icons.cmsDelta, label: "CMS (Blogs)", path: "/cms", hasIndicator: true },
    { icon: icons.settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="cms-layout">
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="#2563eb" strokeWidth="2" fill="none"/>
              <circle cx="20" cy="20" r="12" stroke="#2563eb" strokeWidth="2" fill="none"/>
              <circle cx="20" cy="20" r="6" fill="#2563eb"/>
              <circle cx="8" cy="20" r="3" fill="#2563eb"/>
              <circle cx="32" cy="20" r="3" fill="#2563eb"/>
              <circle cx="20" cy="8" r="3" fill="#2563eb"/>
            </svg>
          </div>
          <div className="logo-text">
            <span className="logo-title">Dexter</span>
            <span className="logo-subtitle">CAPITAL ADVISORS</span>
          </div>
        </div>

        {/* Main Menu */}
        <div className="menu-section">
          <div className="menu-header">MAIN MENU</div>
          <ul>
            {menuItems.map((item) => (
              <li key={item.path} className={isActive(item.path)}>
                <Link to={item.path}>
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-label" style={{ whiteSpace: "pre-line" }}>{item.label}</span>
                  {item.hasIndicator && <span className="menu-indicator">•</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* User Info & Logout */}
        {user && (
          <div style={{ padding: "20px", borderTop: "1px solid #e2e8f0", marginTop: "auto" }}>
            <div style={{ marginBottom: "12px", fontSize: "14px", color: "#4a5568" }}>
              <div style={{ fontWeight: "600" }}>{user.name}</div>
              <div style={{ fontSize: "12px", color: "#718096" }}>{user.email}</div>
              <div style={{ fontSize: "11px", color: "#38b2ac", textTransform: "uppercase", marginTop: "4px" }}>
                {user.role}
              </div>
            </div>
            <button
              onClick={onLogout}
              style={{
                width: "100%",
                padding: "10px",
                background: "#fed7d7",
                color: "#c53030",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "13px",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </aside>

      <main className="editor-wrapper">
        <Outlet />
      </main>
    </div>
  );
}
