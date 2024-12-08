import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [clubs, setClubs] = useState([]);
  const [newClub, setNewClub] = useState({ name: "", description: "" });
  const [showForm, setShowForm] = useState(true); // Control form visibility
  const { userID } = useUserContext();
  const navigate = useNavigate();

  async function fetchData(userID) {
    axios
      .get("http://localhost:8800/clubs", { params: { userID: userID } })
      .then((response) => {
        setClubs(response.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get("http://localhost:8800/roles", { params: { userID: userID } })
      .then((response) => {
        const roles = response.data.map((role) => role.name);
        setShowForm(!roles.includes("Owner"));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchData(userID);
    const interval = setInterval(() => fetchData(userID), 3000);
    return () => clearInterval(interval);
  }, [userID]);

  async function createClub() {
    axios
      .post("http://localhost:8800/create-club", {
        userID: userID,
        name: newClub.name,
        description: newClub.description,
      })
      .then((response) => {
        newClub.name = "";
        newClub.description = "";
        alert(response.data.message);
        fetchData();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setNewClub((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newClub.name && newClub.description) {
      createClub();
      setNewClub({ name: "", description: "" });
    }
  };

  const navigateToClub = (clubID) => {
    navigate(`/club/${clubID}`); // Redirect to the club's page
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>My Clubs</h1>
        <button
          onClick={() => navigate("/search")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#2c3e50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Search Clubs
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "20px",
          justifyContent: "flex-start", // Align items to the left
        }}
      >
        {clubs.map((club, index) => (
          <button
            className={`club-card`}
            key={index}
            onClick={() => navigateToClub(club.CID)} // Navigate on click
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: showForm ? "20px" : "40px", // Increase padding if form is hidden
              width: showForm ? "200px" : "400px", // Increase width if form is hidden
              height: showForm ? "150px" : "225px", // Increase height if form is hidden
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              textAlign: "left", // Align text to the left inside the card
            }}
          >
            <h3>{club.name}</h3>
            <p>{club.description}</p>
          </button>
        ))}
      </div>
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
          <h2>Add a New Club</h2>
          <input
            className={`text-area`}
            type="text"
            name="name"
            value={newClub.name}
            onChange={handleChange}
            placeholder="Club Name"
            style={{
              display: "block",
              margin: "10px 0",
              padding: "10px",
              width: "300px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <textarea
            className={`text-area`}
            name="description"
            value={newClub.description}
            onChange={handleChange}
            placeholder="Club Description"
            style={{
              display: "block",
              margin: "10px 0",
              padding: "10px",
              width: "300px",
              height: "100px",
              borderRadius: "5px",
              border: "1px solid #ccc",
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
            Add Club
          </button>
        </form>
      )}
    </div>
  );
}

export default Dashboard;
