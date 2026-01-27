import { useState, useEffect } from "react";
import API_URL from "../config";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "active" ? "blocked" : "active";
      
      await fetch(`${API_URL}/api/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      fetchUsers();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return <div style={styles.loading}>Loading users...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>User Management</h1>
        <p style={styles.subtitle}>Manage all registered users</p>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={styles.row}>
                <td style={styles.td}>{user.name}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      background: user.role === "admin" ? "#9f7aea" : "#4299e1",
                    }}
                  >
                    {user.role}
                  </span>
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      background: user.status === "active" ? "#48bb78" : "#f56565",
                    }}
                  >
                    {user.status}
                  </span>
                </td>
                <td style={styles.td}>{formatDate(user.createdAt)}</td>
                <td style={styles.td}>
                  {user.role !== "admin" && (
                    <div style={styles.actions}>
                      <button
                        onClick={() => toggleUserStatus(user._id, user.status)}
                        style={{
                          ...styles.actionBtn,
                          background: user.status === "active" ? "#f56565" : "#48bb78",
                        }}
                      >
                        {user.status === "active" ? "Block" : "Unblock"}
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        style={{ ...styles.actionBtn, background: "#718096" }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
  },
  loading: {
    padding: "40px",
    textAlign: "center",
    color: "#718096",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a365d",
  },
  subtitle: {
    margin: 0,
    color: "#718096",
  },
  tableContainer: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  headerRow: {
    background: "#f7fafc",
  },
  th: {
    textAlign: "left",
    padding: "16px 20px",
    fontWeight: "600",
    color: "#4a5568",
    fontSize: "14px",
    borderBottom: "1px solid #e2e8f0",
  },
  row: {
    borderBottom: "1px solid #edf2f7",
  },
  td: {
    padding: "16px 20px",
    fontSize: "14px",
    color: "#4a5568",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  actionBtn: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "12px",
    cursor: "pointer",
    fontWeight: "500",
  },
};

export default AdminUsers;
