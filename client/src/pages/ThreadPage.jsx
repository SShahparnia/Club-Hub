import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function ThreadPage() {
  const [threads, setThreads] = useState([]);
  const [clubName, setClubName] = useState("");
  const navigate = useNavigate();
  const { clubID } = useParams();

  // Fetch threads and club info from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch club info
        const clubResponse = await axios.get(`http://localhost:8800/club`, { params: { CID: clubID } });
        setClubName(clubResponse.data[0].name);

        // Fetch threads for this specific club
        const threadsResponse = await axios.get(`http://localhost:8800/thread`, { params: { CID: clubID } });
        setThreads(threadsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [clubID]);

  const handleCreateThreadClick = () => {
    navigate(`create-thread`);
  };

  const handleThreadClick = (threadId) => {
    navigate(`thread/${threadId}`);
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <div style={styles.clubBanner}>
          <div style={styles.clubInfo}>
            <h1 style={styles.clubName}>{clubName} Discussions</h1>
            <p style={styles.clubDescription}>
              Join the conversation in {clubName}
            </p>
          </div>
        </div>
      </header>

      <div style={styles.mainContent}>
        <div style={styles.ThreadsContainer}>
          <h2 style={styles.sectionHeading}>Latest Threads</h2>
          {threads.length > 0 ? (
            threads.map((thread) => (
              <div
                key={thread.TID}
                onClick={() => handleThreadClick(thread.TID)}
                style={{...styles.Thread, cursor: 'pointer'}}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <h3 style={styles.ThreadTitle}>{thread.title}</h3>
                <p style={styles.ThreadText}>{thread.content}</p>
                <div style={styles.threadMeta}>
                  <span style={styles.category}>{thread.category}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No threads available in this club yet</p>
          )}
        </div>
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarHeading}>About {clubName} Threads</h3>
          <p style={styles.sidebarText}>
            Join the discussion in {clubName}! Create threads to ask questions,
            share updates, or start conversations with other club members.
          </p>
          <button onClick={handleCreateThreadClick} style={styles.createThreadButton}>
            Create New Thread
          </button>
        </aside>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f0f2f5",
    color: "#1a1a1b",
    minHeight: "100vh",
    margin: 0,
    padding: 0,
  },
  header: {
    backgroundColor: "#0079d3",
    color: "white",
    padding: "20px",
    textAlign: "center",
  },
  clubBanner: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
  },
  bannerImage: {
    width: "50px",
    height: "50px",
    borderRadius: "25px",
    marginRight: "15px",
  },
  clubInfo: {
    textAlign: "left",
  },
  clubName: {
    fontSize: "1.5rem",
    margin: "0",
  },
  clubDescription: {
    fontSize: "1rem",
    margin: "0",
    color: "#d7dadd",
  },
  mainContent: {
    display: "flex",
    maxWidth: "1000px",
    margin: "20px auto",
    gap: "20px",
  },
  ThreadsContainer: {
    flex: 3,
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  sectionHeading: {
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  Thread: {
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "15px",
    marginBottom: "15px",
    padding: "15px",
    borderRadius: "4px",
    transition: "background-color 0.2s ease",
    cursor: "pointer",
  },
  ThreadTitle: {
    fontSize: "1.1rem",
    margin: "0 0 5px",
    color: "#0079d3",
    fontWeight: "600",
  },
  ThreadText: {
    fontSize: "0.9rem",
    margin: "0",
    color: "#1a1a1b",
  },
  sidebar: {
    flex: 1,
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  sidebarHeading: {
    fontSize: "1rem",
    marginBottom: "10px",
  },
  sidebarText: {
    fontSize: "0.9rem",
    marginBottom: "15px",
  },
  createThreadButton: {
    backgroundColor: "#0079d3",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%",
  },
  threadMeta: {
    marginTop: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  category: {
    backgroundColor: '#e9ecef',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#495057',
  },
};

export default ThreadPage;
