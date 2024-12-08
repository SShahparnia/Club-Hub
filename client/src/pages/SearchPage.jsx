import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [clubs, setClubs] = useState([]);
  const { userID } = useUserContext();
  const [joinedClubs, setJoinedClubs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8800/search-clubs")
      .then((response) => {
        setClubs(response.data);
      })
      .catch((error) => {
        console.error("Error fetching clubs:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8800/clubs", { params: { userID } })
      .then((response) => {
        setJoinedClubs(response.data.map((club) => club.CID));
      })
      .catch((error) => {
        console.error("Error fetching joined clubs:", error);
      });
  }, [userID]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleJoinClub = (clubID) => {
    axios
      .post("http://localhost:8800/join-club", { userID, clubID })
      .then((response) => {
        alert(response.data.message);
        window.location.reload();
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          alert(error.response.data.message);
        } else {
          alert("An error occurred while joining the club");
        }
      });
  };

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.searchContainer}>
        <h1 style={styles.title}>Find Your Club</h1>
        <input
          type="text"
          placeholder="Search for a club..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>

      {searchTerm && (
        <div style={styles.resultsContainer}>
          {filteredClubs.map((club) => (
            <div key={club.CID} style={styles.clubCard}>
              <div style={styles.clubInfo}>
                <h2 style={styles.clubName}>{club.name}</h2>
                <p style={styles.clubDescription}>
                  {club.description || "No description available"}
                </p>
              </div>
              <button
                onClick={() => handleJoinClub(club.CID)}
                style={{
                  ...styles.joinButton,
                  ...(joinedClubs.includes(club.CID)
                    ? styles.joinedButton
                    : {}),
                }}
                disabled={joinedClubs.includes(club.CID)}
              >
                {joinedClubs.includes(club.CID)
                  ? "Already Joined"
                  : "Join Club"}
              </button>
            </div>
          ))}
          {filteredClubs.length === 0 && (
            <p style={styles.noResults}>No clubs found matching your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: "100vh",
    padding: "20px",
    backgroundColor: "#f0f2f5",
  },
  searchContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "30vh",
    padding: "20px",
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "30px",
    color: "#1a73e8",
    textAlign: "center",
  },
  searchInput: {
    width: "100%",
    maxWidth: "500px",
    padding: "15px 20px",
    fontSize: "1.1rem",
    border: "2px solid #e1e4e8",
    borderRadius: "30px",
    outline: "none",
    transition: "all 0.3s ease",
    "&:focus": {
      borderColor: "#1a73e8",
      boxShadow: "0 0 0 3px rgba(26,115,232,0.2)",
    },
  },
  resultsContainer: {
    maxWidth: "800px",
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  clubCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: "1.25rem",
    marginBottom: "8px",
    color: "#1a73e8",
  },
  clubDescription: {
    fontSize: "0.9rem",
    color: "#666",
    margin: 0,
  },
  joinButton: {
    backgroundColor: "#1a73e8",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#1557b0",
    },
  },
  noResults: {
    textAlign: "center",
    color: "#666",
    padding: "20px",
    fontSize: "1.1rem",
  },
};

export default SearchPage;
