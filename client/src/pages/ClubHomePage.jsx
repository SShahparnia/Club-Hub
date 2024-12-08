import React, {
        useState,
        useEffect
    } from "react";
import { Outlet, useParams } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const ClubHomePage = () => {
  const { clubID: CID } = useParams(); // Get the Club ID from the URL
  const [isOwner, setIsOwner] = useState(false); // Track if the user is an owner
  const [chatroomName, setChatroomName] = useState(""); // State for chatroom name
  const [message, setMessage] = useState(""); // Success or error message
  const { userID } = useUserContext();
  const [clubName, setClubName] = useState("");
  const [clubDesc, setClubDesc] = useState("");
  const [clubThreads, setClubThreads] = useState([]);
  const [clubChatrooms, setClubChatrooms] = useState([]);

  const fetchData = () => {
    axios
    .get("http://localhost:8800/club", { params: { CID } })
    .then((response) => {
      setClubName(response.data[0].name);
      setClubDesc(response.data[0].description);
    })
    .catch((err) => {
      console.error(err);
    });

    axios
    .get("http://localhost:8800/threads", { params: { CID } })
    .then((response) => {
      setClubThreads(response.data);
    })
    .catch((err) => {
      console.error(err);
    });

    axios
    .get("http://localhost:8800/chatrooms", { params: { CID } })
    .then((response) => {
      setClubChatrooms(response.data);
    })
    .catch((err) => {
      console.error(err);
    });
  }

  useEffect(() => {
    axios
      .post("http://localhost:8800/isOwner", { userID: userID, clubID: CID })
      .then((response) => {
        setIsOwner(response.data);
      })
      .catch((err) => console.error(err));
  }, [userID]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateChatroom = (e) => {
    e.preventDefault();
    // Make a POST request to create a chatroom
    axios
      .post("http://localhost:8800/create-chatroom", {
        clubID: CID,
        chatroomName,
      })
      .then((response) => {
        setMessage("Chatroom created successfully!");
        setChatroomName(""); // Reset input
      })
      .catch((err) => {
        console.error(err);
        setMessage("Failed to create chatroom.");
      });
  };

  return (
    <div>
      <header>
        <h1>Welcome to the {clubName} Club!</h1>
      </header>
      <main>
        <section>
          <h2>About Our Club</h2>
          <p>{clubDesc}</p>
        </section>
        <section>
          <h2>Club Content</h2>
          <div style={styles.buttonContainer}>
            <a 
              href={`${CID}/threads`} 
              style={styles.actionButton}
            >
              View All Threads
            </a>
            <a 
              href={`${CID}/posts`} 
              style={styles.actionButton}
            >
              View All Posts
            </a>
            <a 
              href={`${CID}/events`} 
              style={styles.actionButton}
            >
              View Events
            </a>
          </div>

          <h2>Club ChatRooms</h2>
          <nav style={styles.chatroomList}>
            {clubChatrooms.map((chatroom) => (
              <a 
                key={chatroom.CRID}
                href={`${CID}/chatroom/${chatroom.CRID}`}
                style={styles.chatroomButton}
              >
                {chatroom.name}
              </a>
            ))}
          </nav>

          {isOwner && (
            <form onSubmit={handleCreateChatroom} style={{ marginTop: "20px" }}>
              <h3>Create a New Chatroom</h3>
              <input
                type="text"
                placeholder="Chatroom Name"
                value={chatroomName}
                onChange={(e) => setChatroomName(e.target.value)}
                style={{
                  padding: "10px",
                  width: "300px",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                  marginBottom: "10px",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2c3e50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Create Chatroom
              </button>
              {message && <p style={{ marginTop: "10px" }}>{message}</p>}
            </form>
          )}

          <Outlet />
        </section>
      </main>
      <footer>
        <p>&copy; 2023 Club Hub. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ClubHomePage;

// Add these styles at the bottom with your other styles
const styles = {
  actionButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#0079d3',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    marginBottom: '20px',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
    fontWeight: '500',
    ':hover': {
      backgroundColor: '#005fa3',
    }
  },
  chatroomList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px'
  },
  chatroomButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#2c3e50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
    fontWeight: '500',
    ':hover': {
      backgroundColor: '#34495e',
    }
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px'
  },
  actionButton: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#0079d3',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
    fontWeight: '500',
    flex: '1',
    textAlign: 'center',
    maxWidth: '200px',
    ':hover': {
      backgroundColor: '#005fa3',
    }
  }
};
