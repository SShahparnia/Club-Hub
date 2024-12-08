import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";  // Import axios

function CreateThreadPage() {
  const [threadTitle, setThreadTitle] = useState("");
  const [threadContent, setThreadContent] = useState("");
  const [category, setCategory] = useState("");
  const { clubID } = useParams(); // Add this to get clubID from URL

  const categories = [
    "Question",
    "Discussion",
    "Announcements",
    "Events",
    "Suggestions",
    "Resources",
    "Social",
  ];

  const navigate = useNavigate(); // Get the navigate function

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form with data:", { threadTitle, threadContent, category, clubID }); // Debug log

    const threadData = { 
      threadTitle, 
      threadContent, 
      category,
      clubID: parseInt(clubID) // Ensure clubID is a number
    };

    try {
      const response = await axios.post("http://localhost:8800/create-thread", threadData);
      console.log("New thread created:", response.data);
      navigate(`/club/${clubID}/threads`);
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1 style={styles.headerText}>Create a New Thread</h1>
      </header>

      <div style={styles.mainContent}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="title" style={styles.inputLabel}>
              Thread Title
            </label>
            <input
              type="text"
              id="title"
              value={threadTitle}
              onChange={(e) => setThreadTitle(e.target.value)}
              placeholder="Enter the title of your thread"
              style={styles.inputField}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="content" style={styles.inputLabel}>
              Thread Content
            </label>
            <textarea
              id="content"
              value={threadContent}
              onChange={(e) => setThreadContent(e.target.value)}
              placeholder="Write your thread content here"
              style={styles.textareaField}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="category" style={styles.inputLabel}>
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={styles.inputField}
              required
            >
              <option value="">Select a category</option>
              {categories.map((categoryOption, index) => (
                <option key={index} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            style={styles.submitButton}
          >
            Create Thread
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f6f7f8",
    color: "#1a1a1b",
    minHeight: "100vh",
    padding: "20px",
  },
  header: {
    backgroundColor: "#0079d3",
    color: "white",
    padding: "20px",
    textAlign: "center",
    marginBottom: "20px",
  },
  headerText: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0",
  },
  mainContent: {
    maxWidth: "800px",
    width: "100%",
    margin: "0 auto",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  inputLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#555",
    marginBottom: "8px",
  },
  inputField: {
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#333",
    boxSizing: "border-box",
  },
  textareaField: {
    width: "100%",
    minHeight: "150px",
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    color: "#333",
    resize: "vertical",
    boxSizing: "border-box",
  },
  submitButton: {
    backgroundColor: "#0079d3",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
  submitButtonHover: {
    backgroundColor: "#005fa3",
  },
  submitButtonActive: {
    backgroundColor: "#00487a",
  },
};

export default CreateThreadPage;
