import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";

function EventPage() {
  const { clubID } = useParams();
  const { userID } = useUserContext();
  const { darkMode } = useTheme();
  const [events, setEvents] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    street: "",
    city: "",
    zipcode: "",
    limit: "",
  });
  const [error, setError] = useState(null);

  // Fetch events and check if user is owner
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await axios.get(`http://localhost:8800/events`, {
          params: { clubID, userID },
        });
        setEvents(eventsResponse.data);

        const rolesResponse = await axios.post(`http://localhost:8800/isOwner`, {
          userID: userID, clubID: clubID
        });
        setIsOwner(rolesResponse.data);
      } catch (error) {
        setError("Failed to load events. Please try again later.");
      }
    };

    fetchData();
  }, [clubID, userID]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/create-event", {
        ...newEvent,
        clubID,
      });
      setNewEvent({
        name: "",
        date: "",
        street: "",
        city: "",
        zipcode: "",
        limit: "",
      });

      const eventsResponse = await axios.get(`http://localhost:8800/events`, {
        params: { clubID, userID },
      });
      setEvents(eventsResponse.data);
    } catch (error) {
      setError("Failed to create event. Please try again.");
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await axios.post("http://localhost:8800/register-event", {
        eventID: eventId,
        userID,
      });
      const response = await axios.get(`http://localhost:8800/events`, {
        params: { clubID, userID },
      });
      setEvents(response.data);
    } catch (error) {
      setError("Failed to register for event. Please try again.");
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      await axios.post("http://localhost:8800/unregister-event", {
        eventID: eventId,
        userID,
      });
      const response = await axios.get(`http://localhost:8800/events`, {
        params: { clubID, userID },
      });
      setEvents(response.data);
    } catch (error) {
      setError("Failed to unregister for event. Please try again.");
    }
  };

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div
      style={{
        ...styles.container,
        backgroundColor: darkMode ? "#121212" : "#ffffff",
        color: darkMode ? "#ffffff" : "#000000",
      }}
    >
      <h1 style={styles.title}>Upcoming Events</h1>

      {isOwner && (
        <div
          className="createEventSection"
          style={{
            ...styles.createEventSection,
            backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
            color: darkMode ? "#ffffff" : "#000000",
          }}
        >
          <h2>Create New Event</h2>
          <form onSubmit={handleCreateEvent} style={styles.form}>
            <input
              type="text"
              placeholder="Event Name"
              value={newEvent.name}
              onChange={(e) =>
                setNewEvent({ ...newEvent, name: e.target.value })
              }
              style={{
                ...styles.input,
                backgroundColor: darkMode ? "#2c2c2c" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000",
              }}
              required
            />
            <input
              type="datetime-local"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent({ ...newEvent, date: e.target.value })
              }
              style={{
                ...styles.input,
                backgroundColor: darkMode ? "#2c2c2c" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000",
              }}
              required
            />
            <input
              type="text"
              placeholder="Street Address"
              value={newEvent.street}
              onChange={(e) =>
                setNewEvent({ ...newEvent, street: e.target.value })
              }
              style={{
                ...styles.input,
                backgroundColor: darkMode ? "#2c2c2c" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000",
              }}
            />
            <input
              type="text"
              placeholder="City"
              value={newEvent.city}
              onChange={(e) =>
                setNewEvent({ ...newEvent, city: e.target.value })
              }
              style={{
                ...styles.input,
                backgroundColor: darkMode ? "#2c2c2c" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000",
              }}
            />
            <input
              type="text"
              placeholder="Zipcode"
              value={newEvent.zipcode}
              onChange={(e) =>
                setNewEvent({ ...newEvent, zipcode: e.target.value })
              }
              style={{
                ...styles.input,
                backgroundColor: darkMode ? "#2c2c2c" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000",
              }}
            />
            <input
              type="number"
              min="0"
              placeholder="Participant Limit"
              value={newEvent.limit === 0 ? "" : newEvent.limit}
              onChange={(e) => {
                const value =
                  e.target.value === ""
                    ? ""
                    : Math.max(0, parseInt(e.target.value) || 0);
                setNewEvent({ ...newEvent, limit: value });
              }}
              style={{
                ...styles.input,
                backgroundColor: darkMode ? "#2c2c2c" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000",
              }}
            />
            <button
              type="submit"
              style={{
                ...styles.createButton,
                backgroundColor: darkMode ? "#3f51b5" : "#1a73e8",
              }}
            >
              Create Event
            </button>
          </form>
        </div>
      )}

      <div style={styles.eventsList}>
        {events.length === 0 ? (
          <p style={styles.noEvents}>No upcoming events</p>
        ) : (
          events.map((event) => (
            <div
              key={event.EID}
              style={{
                ...styles.eventCard,
                backgroundColor: darkMode ? "#1e1e1e" : "#ffffff",
                color: darkMode ? "#ffffff" : "#000000",
              }}
            >
              <div style={styles.eventInfo}>
                <h3 style={styles.eventName}>{event.name}</h3>
                <p style={styles.eventDate}>
                  {new Date(event.date).toLocaleString()}
                </p>
                <p style={styles.eventLocation}>
                  {event.street && `${event.street}, `}
                  {event.city && `${event.city}, `}
                  {event.zipcode}
                </p>
                <p style={styles.eventParticipants}>
                  {event.registered_count || 0} / {event.limit || "∞"}{" "}
                  participants
                </p>
              </div>
              <div style={styles.buttonGroup}>
                {event.is_registered ? (
                  <button
                    onClick={() => handleUnregister(event.EID)}
                    style={{
                      ...styles.unregisterButton,
                      backgroundColor: darkMode ? "#b00020" : "#dc3545",
                    }}
                  >
                    Unregister
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(event.EID)}
                    style={{
                      ...styles.registerButton,
                      backgroundColor: darkMode ? "#3f51b5" : "#1a73e8",
                    }}
                    disabled={
                      event.limit && event.registered_count >= event.limit
                    }
                  >
                    {event.limit && event.registered_count >= event.limit
                      ? "Event Full"
                      : "Register"}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "40px 20px",
    minHeight: "100vh",
  },
  title: {
    fontSize: "2.5rem",
    textAlign: "center",
    marginBottom: "40px",
  },
  createEventSection: {
    padding: "30px",
    borderRadius: "10px",
    marginBottom: "30px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "10px 15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "1rem",
  },
  createButton: {
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  eventsList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  eventCard: {
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },
  eventName: {
    fontSize: "1.3rem",
    marginBottom: "10px",
  },
  eventDate: {
    fontSize: "1rem",
    marginBottom: "5px",
  },
  eventLocation: {
    fontSize: "1rem",
    marginBottom: "5px",
  },
  eventParticipants: {
    fontSize: "0.9rem",
    marginBottom: "15px",
  },
  registerButton: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  unregisterButton: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "#dc3545",
    padding: "10px",
    marginBottom: "20px",
    textAlign: "center",
  },
  noEvents: {
    textAlign: "center",
    padding: "20px",
  },
};

export default EventPage;
