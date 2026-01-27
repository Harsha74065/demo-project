// API Configuration
// Change this URL to your Render backend URL after deployment
// Example: https://demo-backend.onrender.com

const API_URL = import.meta.env.PROD 
  ? "https://demo-project-td6f.onrender.com"
  : "http://localhost:5000";

export default API_URL;
