import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import axios from "axios";
import "../pages_css/SideNavBar.css";

function SideNavBar({ isCollapsed, toggleSidebar }) {
  const { userID } = useUserContext();
  const navigate = useNavigate();
  const [chatrooms, setChatrooms] = useState([]);
  const { clubID: CID } = useParams();
  const [clubName, setClubName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (CID) {
      axios
        .get("http://localhost:8800/chatrooms", { params: { CID: CID } })
        .then((response) => {
          setChatrooms(response.data); // Update chatrooms
        })
        .catch((error) => {
          console.error("Error fetching chatrooms:", error);
        });

      axios
        .get("http://localhost:8800/club", { params: { CID: CID } })
        .then((response) => {
          setClubName(response.data[0].name);
        })
        .catch((error) => {
          console.error("Error fetching club name:", error);
        });
    }
  }, [CID]);

  if (!userID) {
    return null;
  }

  return (
    <>
      {/* Sidebar */}
      <nav
        className={`side-navbar ${isCollapsed ? "collapsed" : ""}`}
      >
        {!isCollapsed && (
          <div className={`sidebar-content`}>
            <h3 className={`text`}>{clubName}</h3>
            <div>
              <button
                className="sidebar-button"
                onClick={() => navigate(`/club/${CID}`)}
              >
                Home
              </button>
            </div>
            <div>
              <button
                className="sidebar-button"
                onClick={() => navigate(`/club/${CID}/threads`)}
              >
                Threads
              </button>
            </div>
            <div
              className="dropdown"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="sidebar-button dropdown-trigger">
                Chatrooms {isDropdownOpen ? "▲" : "▼"}
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  {chatrooms.length > 0 ? (
                    chatrooms.map((chatroom) => (
                      <button
                        key={chatroom.CRID}
                        className="dropdown-item"
                        onClick={() => navigate(`/club/${CID}/chatroom/${chatroom.CRID}`)}
                      >
                        {chatroom.name}
                      </button>
                    ))
                  ) : (
                    <span className="dropdown-item">
                      No chatrooms available
                    </span>
                  )}
                </div>
              )}
            </div>
            <div>
              <button
                className="sidebar-button"
                onClick={() => navigate(`/club/${CID}/posts`)}
              >
                Posts
              </button>
            </div>
            <div>
              <button
                className="sidebar-button"
                onClick={() => navigate(`/club/${CID}/events`)}
              >
                Events
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Toggle Button */}
      <button
        className={`sidebar-toggle-button ${
          isCollapsed ? "collapsed" : "expanded"
        }`}
        onClick={toggleSidebar}
      >
        {isCollapsed ? "▶" : "◀"}
      </button>
    </>
  );
}

export default SideNavBar;
