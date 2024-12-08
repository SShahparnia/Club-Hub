import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../pages_css/ChatRoom.css";
import { useUserContext } from "../context/UserContext";

function ChatRoomPage() {
  const { chatroomID: CRID } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyToContent, setReplyToContent] = useState("");
  const [replyToUser, setReplyToUser] = useState("");
  const [members, setMembers] = useState([]); // State for member list
  const inputRef = useRef(null);
  const { userID } = useUserContext();
  const [suggestions, setSuggestions] = useState([]); // For autocomplete suggestions
  const [isMentioning, setIsMentioning] = useState(false); // Whether the user is typing an @mention
  const [highlightedIndex, setHighlightedIndex] = useState(0); // Tracks the currently highlighted suggestion
  const chatContainer = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("http://localhost:8800/chatroom", {
          params: { CRID },
        });
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [CRID]);

  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Fetch the member list
    const fetchMembers = async () => {
      try {
        const clubID = 1; // Replace with logic to get the actual clubID
        const response = await axios.get(
          `http://localhost:8800/club-members?clubID=${clubID}`
        );
        setMembers(response.data);
      } catch (err) {
        console.error("Error fetching members:", err);
      }
    };

    fetchMembers();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        await axios.post("http://localhost:8800/chatroom", {
          CRID: CRID,
          userID: userID,
          message: message,
          reply_to: replyTo,
        });
        setMessage("");
        setReplyTo(null);
        setReplyToContent("");
        const response = await axios.get("http://localhost:8800/chatroom", {
          params: { CRID },
        });
        setMessages(response.data);
      } catch (err) {
        console.error("Error sending message:", err);
      }
    }
  };

  const handleReply = (id, content, username) => {
    setReplyTo(id); // Use the correct message ID (MID)
    setReplyToContent(content);
    setReplyToUser(username);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e) => {
    const input = e.target.value;
    setMessage(input);

    // Detect if user is typing `@` and update suggestions
    const mentionMatch = input.match(/@(\w*)$/);
    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase();
      const filteredSuggestions = members.filter((member) =>
        member.username.toLowerCase().startsWith(query)
      );
      setSuggestions(filteredSuggestions);
      setIsMentioning(true);
      setHighlightedIndex(0); // Reset highlighted index
    } else {
      setSuggestions([]);
      setIsMentioning(false);
    }
  };

  const handleKeyDown = (e) => {
    if (isMentioning && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex(
          (prevIndex) => (prevIndex + 1) % suggestions.length
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex(
          (prevIndex) =>
            (prevIndex - 1 + suggestions.length) % suggestions.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        handleSuggestionSelect(suggestions[highlightedIndex].username);
      } else if (e.key === "Escape") {
        setSuggestions([]);
        setIsMentioning(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) { // Prevent default only when Enter is pressed
      e.preventDefault();
      sendMessage(e); // Call sendMessage directly
    } 
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // Automatically focus on the input field
    }
  }, []);

  const handleSuggestionSelect = (username) => {
    const updatedMessage = message.replace(/@\w*$/, `@${username} `);
    setMessage(updatedMessage);
    setSuggestions([]);
    setIsMentioning(false);
    setHighlightedIndex(0); // Reset highlighted index
    if (inputRef.current) {
      inputRef.current.focus(); // Refocus the input field
    }
  };

  return (
    <div className="chatroom-member-container">
      <div className="chatroom-input-container">
        <div
          className="chatroom-messages"
          ref={chatContainer}
        >
          {messages.map((msg) => (
            <div key={msg.message_id} className="message">
              <span className="message-username">{msg.username}</span>
              {/* Display the replied-to message */}
              {msg.reply_to && (
                <div className="replied-message">
                  Replying to {msg.replied_user || "Unknown"}:{" "}
                  {msg.replied_message || "Deleted Message"}
                </div>
              )}
              {/* Display the main message */}
              <div className="message-content">
                {msg.message.split(/(\@\w+)/).map((part, index) =>
                  part.startsWith("@") ? (
                    <span key={index} className="mention">
                      {part}
                    </span>
                  ) : (
                    part
                  )
                )}
              </div>
              <button
                className="reply-button"
                onClick={() =>
                  handleReply(msg.message_id, msg.message, msg.username)
                }
              >
                Reply
              </button>
              <div className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="chatroom-input">
          {replyTo && (
            <div className="reply-indicator">
              Replying to {replyToUser}: {replyToContent}{" "}
              <button onClick={() => setReplyTo(null)}>Cancel</button>
            </div>
          )}
          <div className="chat-input-container">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              ref={inputRef}
            />
            {isMentioning && suggestions.length > 0 && (
              <div className="mention-suggestions">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.UID}
                    onClick={() => handleSuggestionSelect(suggestion.username)}
                    className={`suggestion-item ${
                      index === highlightedIndex ? "active" : ""
                    }`}
                  >
                    @{suggestion.username}
                  </div>
                ))}
              </div>
            )}
            <button type="submit">Send</button>
          </div>
        </form>
      </div>
        <div className="member-list">
          <h3>Members</h3>
          <ul>
            {members.map((member) => (
              <li
                key={member.UID}
                onClick={() => handleSuggestionSelect(member.username)}
                className="mentionable-member"
              >
                <div className="member-avatar"></div>
                <div className="member-info">
                  <div className="member-name">{`${member.fname} ${member.lname}`}</div>
                  <div className="member-username">@{member.username}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
}

export default ChatRoomPage;
