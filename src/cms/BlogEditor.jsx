import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import API_URL from "../config";

/* ================= IMAGE UPLOAD MODAL ================= */
function ImageUploadModal({ isOpen, onClose, onInsert }) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onInsert(e.target.result);
        onClose();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
    }} onClick={onClose}>
      <div style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "24px",
        width: "400px",
        maxWidth: "90%",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
      }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
          <button onClick={onClose} style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#9ca3af",
            lineHeight: 1,
          }}>×</button>
        </div>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          style={{
            border: `2px dashed ${dragOver ? "#2563eb" : "#e5e7eb"}`,
            borderRadius: "8px",
            padding: "48px 24px",
            textAlign: "center",
            background: dragOver ? "#eff6ff" : "#fafafa",
            transition: "all 0.2s",
            cursor: "pointer",
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Image Icon */}
          <div style={{ marginBottom: "16px" }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" style={{ margin: "0 auto" }}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>

          {/* Text */}
          <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
            Drag and drop an image here or{" "}
            <span style={{ color: "#2563eb", fontWeight: "500", cursor: "pointer" }}>
              Upload from computer
            </span>
          </p>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        </div>

        {/* Or URL option */}
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p style={{ color: "#9ca3af", fontSize: "12px", marginBottom: "8px" }}>or paste image URL</p>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              id="imageUrlInput"
              style={{
                flex: 1,
                padding: "10px 12px",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "13px",
                outline: "none",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value) {
                  onInsert(e.target.value);
                  onClose();
                }
              }}
            />
            <button
              onClick={() => {
                const url = document.getElementById("imageUrlInput").value;
                if (url) {
                  onInsert(url);
                  onClose();
                }
              }}
              style={{
                padding: "10px 16px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Insert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= RICH TEXT EDITOR COMPONENT ================= */
function RichTextEditor({ content, setContent, onHighlightImages }) {
  const editorRef = useRef(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertImage = (src) => {
    if (src && editorRef.current) {
      editorRef.current.focus();
      const img = `<img src="${src}" alt="image" style="max-width: 50%; height: auto; margin: 8px 0; cursor: pointer;" />`;
      document.execCommand("insertHTML", false, img);
      handleInput();
    }
  };

  // Handle image click for resize options
  const handleEditorClick = (e) => {
    if (e.target.tagName === "IMG") {
      setSelectedImage(e.target);
    } else {
      setSelectedImage(null);
    }
  };

  // Resize selected image
  const resizeImage = (size) => {
    if (selectedImage) {
      selectedImage.style.maxWidth = size;
      selectedImage.style.width = size;
      handleInput();
    }
  };

  // Delete selected image
  const deleteImage = () => {
    if (selectedImage) {
      selectedImage.remove();
      setSelectedImage(null);
      handleInput();
    }
  };

  // Highlight all images in editor and scroll to them
  const highlightImages = () => {
    if (editorRef.current) {
      // Scroll to editor
      editorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      
      const images = editorRef.current.querySelectorAll("img");
      if (images.length === 0) {
        // Flash the editor border to show where to add images
        editorRef.current.style.outline = "3px solid #3b82f6";
        editorRef.current.style.outlineOffset = "2px";
        setTimeout(() => {
          editorRef.current.style.outline = "none";
          editorRef.current.style.outlineOffset = "0";
        }, 2000);
        return;
      }
      // Highlight all images
      images.forEach((img) => {
        img.style.outline = "3px solid #3b82f6";
        img.style.outlineOffset = "2px";
        img.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      // Remove highlight after 2 seconds
      setTimeout(() => {
        images.forEach((img) => {
          img.style.outline = "none";
          img.style.outlineOffset = "0";
        });
      }, 2000);
    }
  };

  // Expose highlightImages to parent - only run once on mount
  useEffect(() => {
    if (onHighlightImages) {
      onHighlightImages(highlightImages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Styles
  const selectStyle = {
    padding: "6px 8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "13px",
    color: "#374151",
    outline: "none",
  };

  const btnStyle = {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "transparent",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    color: "#374151",
    transition: "background 0.15s",
  };

  const dividerStyle = {
    width: "1px",
    height: "24px",
    background: "#e5e7eb",
    margin: "0 6px",
  };

  return (
    <div style={{ border: "1px solid #d1d5db", borderRadius: "4px", overflow: "hidden", background: "#fff" }}>
      {/* Toolbar */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "2px",
        padding: "8px 12px",
        borderBottom: "1px solid #e5e7eb",
        background: "#fff",
      }}>
        {/* Heading */}
        <select onChange={(e) => execCommand("formatBlock", e.target.value)} style={selectStyle} title="Heading">
          <option value="p">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        <div style={dividerStyle} />

        {/* Font */}
        <select onChange={(e) => execCommand("fontName", e.target.value)} style={selectStyle} title="Font">
          <option value="sans-serif">Sans Serif</option>
          <option value="serif">Serif</option>
          <option value="Georgia">Georgia</option>
          <option value="monospace">Monospace</option>
        </select>

        <div style={dividerStyle} />

        {/* Font Size */}
        <select onChange={(e) => execCommand("fontSize", e.target.value)} style={selectStyle} title="Font Size">
          <option value="3">Normal</option>
          <option value="1">Small</option>
          <option value="4">Large</option>
          <option value="5">Larger</option>
          <option value="6">Huge</option>
        </select>

        <div style={dividerStyle} />

        {/* Bold, Italic, Underline, Strike */}
        <button style={btnStyle} onClick={() => execCommand("bold")} title="Bold (Ctrl+B)"><strong>B</strong></button>
        <button style={btnStyle} onClick={() => execCommand("italic")} title="Italic (Ctrl+I)"><em>I</em></button>
        <button style={btnStyle} onClick={() => execCommand("underline")} title="Underline (Ctrl+U)"><span style={{ textDecoration: "underline" }}>U</span></button>
        <button style={btnStyle} onClick={() => execCommand("strikeThrough")} title="Strikethrough"><span style={{ textDecoration: "line-through" }}>S</span></button>

        <div style={dividerStyle} />

        {/* Colors */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: "bold", color: "#374151" }}>A</span>
          <input type="color" onChange={(e) => execCommand("foreColor", e.target.value)} title="Text Color" 
            style={{ width: "16px", height: "16px", border: "none", cursor: "pointer", marginLeft: "2px", background: "transparent" }} />
        </div>
        <div style={{ position: "relative", display: "flex", alignItems: "center", marginLeft: "8px" }}>
          <span style={{ fontSize: "14px", fontWeight: "bold", background: "#fef08a", padding: "0 4px", borderRadius: "2px" }}>A</span>
          <input type="color" onChange={(e) => execCommand("hiliteColor", e.target.value)} title="Highlight Color" defaultValue="#fef08a"
            style={{ width: "16px", height: "16px", border: "none", cursor: "pointer", marginLeft: "2px", background: "transparent" }} />
        </div>

        <div style={dividerStyle} />

        {/* Sub/Superscript */}
        <button style={btnStyle} onClick={() => execCommand("subscript")} title="Subscript">x<sub style={{ fontSize: "10px" }}>2</sub></button>
        <button style={btnStyle} onClick={() => execCommand("superscript")} title="Superscript">x<sup style={{ fontSize: "10px" }}>2</sup></button>

        <div style={dividerStyle} />

        {/* Lists */}
        <button style={btnStyle} onClick={() => execCommand("insertOrderedList")} title="Numbered List">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><text x="4" y="7" fontSize="8" fill="currentColor">1</text><text x="4" y="13" fontSize="8" fill="currentColor">2</text><text x="4" y="19" fontSize="8" fill="currentColor">3</text></svg>
        </button>
        <button style={btnStyle} onClick={() => execCommand("insertUnorderedList")} title="Bullet List">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="2" fill="currentColor"/><circle cx="4" cy="12" r="2" fill="currentColor"/><circle cx="4" cy="18" r="2" fill="currentColor"/></svg>
        </button>

        <div style={dividerStyle} />

        {/* Alignment */}
        <button style={btnStyle} onClick={() => execCommand("justifyLeft")} title="Align Left">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>
        </button>
        <button style={btnStyle} onClick={() => execCommand("justifyCenter")} title="Align Center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
        </button>
        <button style={btnStyle} onClick={() => execCommand("justifyRight")} title="Align Right">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>
        </button>
        <button style={btnStyle} onClick={() => execCommand("justifyFull")} title="Justify">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </button>

        <div style={dividerStyle} />

        {/* Indent */}
        <button style={btnStyle} onClick={() => execCommand("outdent")} title="Decrease Indent">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/><polyline points="6 9 3 12 6 15"/></svg>
        </button>
        <button style={btnStyle} onClick={() => execCommand("indent")} title="Increase Indent">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/><polyline points="3 9 6 12 3 15"/></svg>
        </button>

        <div style={dividerStyle} />

        {/* Link */}
        <button style={btnStyle} onClick={() => {
          const url = prompt("Enter link URL:");
          if (url) execCommand("createLink", url);
        }} title="Insert Link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>

        {/* Image */}
        <button style={btnStyle} onClick={() => setShowImageModal(true)} title="Insert Image">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>

        {/* Video */}
        <button style={btnStyle} onClick={() => {
          const url = prompt("Enter video embed URL:");
          if (url) {
            const iframe = `<iframe src="${url}" width="560" height="315" frameborder="0" allowfullscreen></iframe>`;
            document.execCommand("insertHTML", false, iframe);
          }
        }} title="Insert Video">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><polygon points="10 9 15 12 10 15 10 9" fill="currentColor"/></svg>
        </button>

        <div style={dividerStyle} />

        {/* Quote */}
        <button style={btnStyle} onClick={() => execCommand("formatBlock", "blockquote")} title="Quote">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z"/></svg>
        </button>

        {/* Code */}
        <button style={btnStyle} onClick={() => execCommand("formatBlock", "pre")} title="Code Block">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
        </button>

        <div style={dividerStyle} />

        {/* Clear Formatting */}
        <button style={btnStyle} onClick={() => execCommand("removeFormat")} title="Clear Formatting">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/><line x1="4" y1="20" x2="20" y2="4" strokeWidth="2"/></svg>
        </button>
      </div>

      {/* Image Resize Toolbar - appears when image is selected */}
      {selectedImage && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderBottom: "1px solid #e5e7eb",
          background: "#f0f9ff",
        }}>
          <span style={{ fontSize: "13px", color: "#374151", fontWeight: "500" }}>Image Size:</span>
          <button onClick={() => resizeImage("25%")} style={{ padding: "4px 12px", border: "1px solid #d1d5db", borderRadius: "4px", background: "#fff", cursor: "pointer", fontSize: "12px" }}>25%</button>
          <button onClick={() => resizeImage("50%")} style={{ padding: "4px 12px", border: "1px solid #d1d5db", borderRadius: "4px", background: "#fff", cursor: "pointer", fontSize: "12px" }}>50%</button>
          <button onClick={() => resizeImage("75%")} style={{ padding: "4px 12px", border: "1px solid #d1d5db", borderRadius: "4px", background: "#fff", cursor: "pointer", fontSize: "12px" }}>75%</button>
          <button onClick={() => resizeImage("100%")} style={{ padding: "4px 12px", border: "1px solid #d1d5db", borderRadius: "4px", background: "#fff", cursor: "pointer", fontSize: "12px" }}>100%</button>
          <div style={{ width: "1px", height: "20px", background: "#d1d5db", margin: "0 4px" }} />
          <button onClick={deleteImage} style={{ padding: "4px 12px", border: "1px solid #ef4444", borderRadius: "4px", background: "#fef2f2", color: "#ef4444", cursor: "pointer", fontSize: "12px" }}>Delete</button>
          <button onClick={() => setSelectedImage(null)} style={{ padding: "4px 12px", border: "1px solid #d1d5db", borderRadius: "4px", background: "#fff", cursor: "pointer", fontSize: "12px" }}>Done</button>
        </div>
      )}

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onClick={handleEditorClick}
        style={{
          minHeight: "300px",
          padding: "16px",
          outline: "none",
          background: "#fff",
          fontSize: "14px",
          lineHeight: "1.7",
          color: "#374151",
        }}
        data-placeholder="Enter Blog Content..."
      />

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        onInsert={insertImage}
      />
    </div>
  );
}

export default function BlogEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [content, setContent] = useState("");

  // ✅ NEW image states
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [highlightImagesFn, setHighlightImagesFn] = useState(null);

  /* ---------------- FETCH BLOG (EDIT MODE) ---------------- */
  const fetchBlog = async () => {
    setLoadingData(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch blog");
      }

      const data = await response.json();

      setTitle(data.title || "");
      setSeoTitle(data.seoTitle || "");
      setSeoDescription(data.seoDescription || "");
      setSeoKeywords(data.seoKeywords || "");
      setContent(data.content || "");

      // show existing image
      if (data.imageUrl) {
        setImagePreview(data.imageUrl);
        setExistingImageUrl(data.imageUrl);
      }

      setLoadingData(false);
    } catch (error) {
      console.error("Error fetching blog:", error);
      alert("Failed to load blog");
      setLoadingData(false);
      navigate("/cms");
    }
  };

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // file for backend
      setImagePreview(URL.createObjectURL(file)); // preview only
      setExistingImageUrl("");
    }
  };

  /* ---------------- SAVE BLOG ---------------- */
  const handleSave = async () => {
    if (!title || !content) {
      alert("Title and content are required!");
      return;
    }

    setLoading(true);

    try {
      const url = id
        ? `${API_URL}/api/blogs/${id}`
        : `${API_URL}/api/blogs`;

      const method = id ? "PUT" : "POST";

      // ✅ FormData (IMPORTANT)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("seoTitle", seoTitle);
      formData.append("seoDescription", seoDescription);
      formData.append("seoKeywords", seoKeywords);
      formData.append("content", content);

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (existingImageUrl) {
        formData.append("imageUrl", existingImageUrl);
      }

      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // ❗ DO NOT set Content-Type
      });

      const data = await response.json();

      if (response.ok) {
        alert(id ? "Blog updated successfully! ✅" : "Blog created successfully! ✅");
        navigate("/cms");
      } else {
        alert(data.message || "Failed to save blog");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save blog. Make sure backend is running!");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOADING STATE ---------------- */
  if (loadingData) {
    return (
      <div className="editor-container">
        <p style={{ textAlign: "center", padding: "40px" }}>
          Loading blog data...
        </p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="editor-container">
      <div className="editor-header">
        <button onClick={() => navigate("/cms")} className="back-btn">
          ← Back
        </button>

        <button onClick={handleSave} className="save-btn" disabled={loading}>
          {loading ? "Saving..." : "Save Blog"}
        </button>
      </div>

      <div className="editor-card">
        <h2 style={{ marginBottom: "24px", fontSize: "24px", fontWeight: "700" }}>
          {id ? "Edit Blog" : "Create New Blog"}
        </h2>

        {/* IMAGE */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#374151" }}>
            Blog Cover Image
          </label>
          
          {/* Image URL Input - Recommended for production */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Paste image URL (e.g., https://images.unsplash.com/...)"
                value={existingImageUrl}
                onChange={(e) => {
                  setExistingImageUrl(e.target.value);
                  setImagePreview(e.target.value);
                  setImageFile(null);
                }}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                }}
              />
              <a 
                href="https://unsplash.com" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  padding: "12px 16px",
                  background: "#f3f4f6",
                  color: "#374151",
                  textDecoration: "none",
                  borderRadius: "6px",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                }}
              >
                Get Images
              </a>
            </div>
            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
              Tip: Right-click any image on Unsplash → Copy image address → Paste here
            </p>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div style={{ marginTop: "12px", position: "relative" }}>
              <img 
                src={imagePreview} 
                alt="Blog preview" 
                style={{ 
                  maxWidth: "100%", 
                  maxHeight: "300px", 
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <button
                onClick={() => {
                  setImagePreview("");
                  setExistingImageUrl("");
                  setImageFile(null);
                }}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: "28px",
                  height: "28px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                ×
              </button>
            </div>
          )}
          
          {/* Upload from computer - saves to Cloudinary */}
          <div style={{ marginTop: "16px" }}>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{ 
                width: "100%",
                border: "2px dashed #2563eb",
                borderRadius: "8px",
                padding: "40px 20px",
                textAlign: "center",
                cursor: "pointer",
                background: "#eff6ff",
                color: "#2563eb",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              📁 Click here to upload image from computer
            </button>
            <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px", textAlign: "center" }}>
              Supports: JPG, PNG, GIF (max 10MB)
            </p>
          </div>
        </div>

        <div className="two-columns">
          <div className="field">
            <label>
              Blog Title <span className="required">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Blog Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="field">
            <label>SEO Title</label>
            <input
              type="text"
              placeholder="Enter SEO Title"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
            />
          </div>
        </div>

        <div className="two-columns">
          <div className="field">
            <label>SEO Description</label>
            <textarea
              rows="3"
              placeholder="Enter SEO Description"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
            />
          </div>

          <div className="field">
            <label>SEO Keywords</label>
            <textarea
              rows="3"
              placeholder="Enter keywords separated by commas"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
            />
          </div>
        </div>

        <div className="field" style={{ marginTop: "20px" }}>
          <label>Blog Editor</label>
          <div 
            onClick={() => highlightImagesFn && highlightImagesFn()}
            style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px", cursor: "pointer" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6" style={{ flexShrink: 0 }}>
              <path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/>
            </svg>
            <span style={{ fontSize: "12px", color: "#3b82f6", textDecoration: "underline" }}>Click on any image to resize or delete it</span>
          </div>
          <RichTextEditor content={content} setContent={setContent} onHighlightImages={(fn) => setHighlightImagesFn(() => fn)} />
        </div>
      </div>
    </div>
  );
}
