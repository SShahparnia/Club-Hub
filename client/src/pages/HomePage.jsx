import React from "react";

function HomePage() {

  return (
    <div className={`container`} style={styles.container}>
      <h1 style={styles.heading}>Welcome to Club Hub!</h1>
      <p style={styles.text}>
        This is your personalized dashboard for managing university clubs, events, and discussions.
      </p>
      <p style={styles.note}>
        Use the navigation bar to explore the dashboard and discover your clubs.
      </p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "40px",
    marginTop: "50px",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "800px",
    margin: "50px auto",
  },
  heading: {
    fontSize: "2.5rem",
    marginBottom: "20px",
  },
  text: {
    fontSize: "1.2rem",
    lineHeight: "1.6",
    marginBottom: "10px",
  },
  note: {
    fontSize: "1rem",
    fontStyle: "italic",
  },
};

export default HomePage;
