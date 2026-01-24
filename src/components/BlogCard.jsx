export default function BlogCard({ blog }) {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      {blog.image && (
        <img
          src={blog.image}
          alt={blog.title}
          style={{ width: "100%", height: "180px", objectFit: "cover" }}
        />
      )}

      <div style={{ padding: "15px" }}>
        <h3>{blog.title}</h3>
        <p style={{ color: "#555" }}>
          {blog.content?.slice(0, 100)}...
        </p>

        <small style={{ color: "#888" }}>
          {new Date(blog.createdAt).toDateString()}
        </small>
      </div>
    </div>
  );
}
