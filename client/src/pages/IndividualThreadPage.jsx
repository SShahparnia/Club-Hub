import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

function IndividualThreadPage() {
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyContent, setReplyContent] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const { threadID } = useParams();
  const { userID } = useUserContext(); // Replace with actual user ID from your auth system

  // Fetch thread and replies
  const fetchThreadAndReplies = async () => {
    try {
      // Fetch thread
      const threadResponse = await axios.get(
        `http://localhost:8800/thread/${threadID}`
      );
      setThread(threadResponse.data);

      // Fetch replies
      const repliesResponse = await axios.get(
        `http://localhost:8800/thread-replies/${threadID}`
      );
      console.log("Replies:", repliesResponse.data); // Debug log
      setReplies(repliesResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchThreadAndReplies();
  }, [threadID]);

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;

    try {
      await axios.post("http://localhost:8800/thread-reply", {
        threadID,
        userID,
        content: replyContent,
        parentReplyID: replyingTo,
      });

      // Clear the input and refresh replies
      setReplyContent("");
      setReplyingTo(null);
      fetchThreadAndReplies();
    } catch (error) {
      console.error("Error posting reply:", error);
    }
  };

  // New component for rendering nested replies
  const ReplyItem = ({ reply, depth = 0 }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [localReplyContent, setLocalReplyContent] = useState("");

    const handleLocalReply = async () => {
      if (!localReplyContent.trim()) return;

      try {
        await axios.post("http://localhost:8800/thread-reply", {
          threadID,
          userID,
          content: localReplyContent,
          parentReplyID: reply.TRID,
        });

        // Clear the input and refresh replies
        setLocalReplyContent("");
        setShowReplyInput(false);
        fetchThreadAndReplies();
      } catch (error) {
        console.error("Error posting reply:", error);
      }
    };

    return (
      <div
        style={{
          ...styles.replyItem,
          marginLeft: `${depth * 32}px`,
          width: `calc(100% - ${depth * 32}px)`,
          borderLeft: depth > 0 ? "2px solid #e0e0e0" : "none",
        }}
      >
        <div style={styles.replyHeader}>
          <span style={styles.replyUsername}>{reply.username}</span>
          {reply.parent_username && (
            <span style={styles.replyingTo}>
              replying to @{reply.parent_username}
            </span>
          )}
          <span style={styles.replyTimestamp}>
            {new Date(reply.timestamp).toLocaleString()}
          </span>
        </div>
        <p style={styles.replyContent}>{reply.content}</p>
        <button
          style={styles.replyButton}
          onClick={() => setShowReplyInput(!showReplyInput)}
        >
          Reply
        </button>

        {/* Reply input field */}
        {showReplyInput && (
          <div style={styles.replyForm}>
            <textarea
              style={styles.replyInput}
              value={localReplyContent}
              onChange={(e) => setLocalReplyContent(e.target.value)}
              placeholder={`Reply to ${reply.username}...`}
            />
            <div style={styles.replyActions}>
              <button style={styles.replyButton} onClick={handleLocalReply}>
                Submit
              </button>
              <button
                style={styles.cancelButton}
                onClick={() => {
                  setShowReplyInput(false);
                  setLocalReplyContent("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Render nested replies */}
        {reply.replies &&
          reply.replies.map((nestedReply) => (
            <ReplyItem
              key={nestedReply.TRID}
              reply={nestedReply}
              depth={depth + 1}
            />
          ))}
      </div>
    );
  };

  if (!thread) return <div>Loading...</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContent}>
        <div style={styles.threadContainer}>
          <div style={styles.threadHeader}>
            <span style={styles.category}>{thread.category}</span>
            <h1 style={styles.title}>{thread.title}</h1>
          </div>

          <div style={styles.threadContent}>
            <p style={styles.content}>{thread.content}</p>
          </div>

          <div style={styles.commentsSection}>
            <h3>Comments ({replies.length})</h3>
            <div style={styles.replyForm}>
              <textarea
                style={styles.replyInput}
                placeholder="Share your thoughts..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <button style={styles.replyButton} onClick={handleReplySubmit}>
                Comment
              </button>
            </div>

            {/* Display replies */}
            <div style={styles.repliesList}>
              {replyingTo && (
                <div style={styles.replyingToIndicator}>
                  Replying to comment...
                  <button onClick={() => setReplyingTo(null)}>Cancel</button>
                </div>
              )}
              {replies.length > 0 ? (
                replies.map((reply) => (
                  <ReplyItem key={reply.TRID} reply={reply} />
                ))
              ) : (
                <p style={styles.noReplies}>
                  No replies yet. Be the first to reply!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: "#f6f7f8",
    minHeight: "100vh",
    padding: "20px",
  },
  mainContent: {
    maxWidth: "800px",
    margin: "0 auto",
    overflow: "hidden",
  },
  threadContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    padding: "20px",
    overflow: "hidden",
  },
  threadHeader: {
    marginBottom: "20px",
  },
  category: {
    backgroundColor: "#e9ecef",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#495057",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginTop: "10px",
    color: "#1a1a1b",
  },
  threadContent: {
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  content: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#1a1a1b",
  },
  commentsSection: {
    marginTop: "20px",
  },
  replyForm: {
    marginTop: "15px",
    marginBottom: "20px",
    marginLeft: "10px",
    marginRight: "35px",
  },
  replyInput: {
    width: "100%",
    minHeight: "100px",
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    marginBottom: "10px",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  replyButton: {
    backgroundColor: "#0079d3",
    color: "white",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#005fa3",
    },
  },
  repliesList: {
    marginTop: "20px",
    overflowX: "auto",
    maxWidth: "100%",
    paddingBottom: "10px",
  },
  replyItem: {
    padding: "15px",
    marginBottom: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
    transition: "all 0.2s ease",
    minWidth: "300px",
  },
  replyHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  replyUsername: {
    fontWeight: "600",
    color: "#1a1a1b",
  },
  replyTimestamp: {
    color: "#787c7e",
    fontSize: "12px",
  },
  replyContent: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#1a1a1b",
    margin: 0,
  },
  noReplies: {
    textAlign: "center",
    color: "#787c7e",
    fontStyle: "italic",
    padding: "20px 0",
  },
  replyingTo: {
    fontSize: "12px",
    color: "#666",
    marginLeft: "8px",
  },
  replyingToIndicator: {
    padding: "8px",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    marginBottom: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  replyActions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  cancelButton: {
    backgroundColor: "#e0e0e0",
    color: "#333",
    border: "none",
    borderRadius: "4px",
    padding: "8px 16px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};

export default IndividualThreadPage;
