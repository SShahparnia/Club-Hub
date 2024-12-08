//Nayte's code
// src/pages/SignUpPage.jsx
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import validator from "validator";

function SignUpPage() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [major, setMajor] = React.useState("");
  const [gradYear, setGradYear] = React.useState("");
  const [isValid, setIsValid] = React.useState(false);
  const navigate = useNavigate();


  const validateEmail = (email) => {
    return validator.isEmail(email);
  };

  const validatePassword = (password) => {
    return validator.isStrongPassword(password);
  };

  React.useEffect(() => {
    setIsValid(false);
    setFirstName(firstName.trim());
    setLastName(lastName.trim());
    setUsername(username.trim());
    setEmail(email.trim());
    setPassword(password.trim());

    if (!firstName) {
      setError("First name is required");
    } else if (!lastName) {
      setError("Last name is required");
    } else if (!username) {
      setError("Username is required");
    } else if (!validateEmail(email)) {
      setError("Email is invalid");
    } else if (!validatePassword(password)) {
      var err = []
      if (password.length < 8) {
        err.push("be at least 8 characters");
      }
      if (password.length > 24) {
        err.push("be at most 24 characters");
      }
      if (!password.match(/[A-Z]/)) {
        err.push("contain at least one uppercase letter");
      }
      if (!password.match(/[a-z]/)) {
        err.push("contain at least one lowercase letter");
      }
      if (!password.match(/[0-9]/)) {
        err.push("contain at least one number");
      }
      if (!password.match(/\[\]!@#$%^&*()-_=+[]{}|;:'",<.>`~?\/\\/)) {
        err.push("contain at least one special character");
      }
      setError("Password must " + err.join(", "));
    } else {
      setError("")
      setIsValid(true);
    }
  }, [firstName, lastName, username, email, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:8800/signup", {
        username,
        email,
        password,
        firstName,
        lastName,
        major: major || null,
        gradYear: gradYear || null,
      })
      .then((response) => {
        setUsername("");
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setMajor("");
        setGradYear("");
        setError("");
        alert(response.data.message);
        navigate("/login");
      })
      .catch((err) => {
        setError(`Error: ${err.response.data.errors[0].msg}`);
      });
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Sign Up for Club Hub</h1>
      <form style={{ marginTop: "20px" }}>
        <input
          className={`text-area`}
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First Name"
          style={{
            display: "block",
            margin: "10px auto",
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          className={`text-area`}
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last Name"
          style={{
            display: "block",
            margin: "10px auto",
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          className={`text-area`}
          type="text"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          placeholder="Major (optional)"
          style={{
            display: "block",
            margin: "10px auto",
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          className={`text-area`}
          type="text"
          value={gradYear}
          onChange={(e) => setGradYear(e.target.value)}
          placeholder="Graduation Year (optional)"
          style={{
            display: "block",
            margin: "10px auto",
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          className={`text-area`}
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          style={{
            display: "block",
            margin: "10px auto",
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          className={`text-area`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={{
            display: "block",
            margin: "10px auto",
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          className={`text-area`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            display: "block",
            margin: "10px auto",
            padding: "10px",
            width: "300px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!isValid}
          style={{
            padding: "10px 20px",
            marginTop: "10px",
            backgroundColor: isValid ? "#2c3e50" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
        >
          Sign Up
        </button>
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default SignUpPage;