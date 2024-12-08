import { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem("userID");
    const name = localStorage.getItem("username");

    if (id) {
      setUserID(id);
      setUsername(name);
    }
    setLoading(false);
  }, []);

  const login = (id, name) => {
    setUserID(id);
    setUsername(name);
    localStorage.setItem("userID", id); // Persist in localStorage
    localStorage.setItem("username", name);
  };

  const logout = () => {
    setUserID("");
    setUsername("");
    localStorage.removeItem("userID");
    localStorage.removeItem("username");
  };

  return (
    <UserContext.Provider
      value={{
        userID, setUserID,
        username, setUsername,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserContext };
