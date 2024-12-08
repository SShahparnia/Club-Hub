import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useUserContext } from "../context/UserContext";

function PostPage() {
  const [posts, setPosts] = useState([]);
  const [clubName, setClubName] = useState("");
  const [newPost, setNewPost] = useState({ caption: "", mediaURL: "" });
  const { clubID} = useParams(); // Extract clubID from URL parameters
  const { userID } = useUserContext();
  const [isOwner, setIsOwner] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  // Fetch posts and club info
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch club info
        const clubResponse = await axios.get(`http://localhost:8800/club`, { 
          params: { CID: clubID } 
        });
        setClubName(clubResponse.data[0].name);

        // Fetch posts for this club
        const postsResponse = await axios.get(`http://localhost:8800/posts`, { 
          params: { CID: clubID } 
        });
        setPosts(postsResponse.data);

        // Fetch comments for the posts
        const commentsResponse = await axios.get(`http://localhost:8800/comments`, { params: { CID: clubID} });
        setComments(commentsResponse.data);
        console.log(commentsResponse.data);

        // Check if user is owner
        const rolesResponse = await axios.post(`http://localhost:8800/isOwner`, {
          userID: userID, clubID: clubID
        });
        setIsOwner(rolesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [clubID, userID]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    // Validate URL
    if (!newPost.mediaURL) {
      setError("Image URL is required!");
      return;
    }

    try {
      // Validate if the URL is accessible
      const urlPattern = /^(https?:\/\/)/i;
      if (!urlPattern.test(newPost.mediaURL)) {
        setError("Please enter a valid URL starting with http:// or https://");
        return;
      }

      await axios.post("http://localhost:8800/create-post", {
        ...newPost,
        clubID,
        userID
      });

      // Reset form and error
      setNewPost({ caption: "", mediaURL: "" });
      setError("");

      // Refresh posts
      const postsResponse = await axios.get(`http://localhost:8800/posts`, { 
        params: { CID: clubID } 
      });
      setPosts(postsResponse.data);
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
    }
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const response = await axios.post(`http://localhost:8800/comments`, {
        postId,
        userID,
        content: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1>{clubName} Posts</h1>
      </header>

      {isOwner && (
        <div style={styles.createPostSection}>
          <form onSubmit={handleCreatePost}>
            {error && <div style={styles.errorMessage}>{error}</div>}
            <input
              type="text"
              placeholder="Image URL (required)"
              value={newPost.mediaURL}
              onChange={(e) => setNewPost({...newPost, mediaURL: e.target.value})}
              style={styles.input}
              required
            />
            <textarea
              placeholder="Write a caption... (optional)"
              value={newPost.caption}
              onChange={(e) => setNewPost({...newPost, caption: e.target.value})}
              style={styles.textarea}
            />
            <button type="submit" style={styles.createButton}>
              Create Post
            </button>
          </form>
        </div>
      )}

      <div style={styles.postsGrid}>
        {posts.map((post) => (
          <div key={post.PID} style={styles.post}>
            <div style={styles.postHeader}>
              <span style={styles.username}>{post.username}</span>
              <span style={styles.timestamp}>
                {new Date(post.timestamp).toLocaleString()}
              </span>
            </div>
            {post.mediaURL && (
              <img 
                src={post.mediaURL} 
                alt="Post" 
                style={styles.postImage}
              />
            )}
            <div style={styles.postContent}>
              <p style={styles.caption}>{post.caption}</p>
            </div>
            <div>
              <h3>Comments ({comments.filter((comment) => comment.PID === post.PID).length})</h3>
              <div style={styles.commentForm}>
                <textarea
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button style={styles.commentButton} onClick={() => handleCommentSubmit(post.PID)}>
                  Comment
                </button>
              </div>

              {/* Display comments */}
              <div style={styles.commentsList}>
              {comments.filter((comment) => comment.PID === post.PID).length > 0 ? (
                  comments
                    .filter((comment) => comment.PID === post.PID)
                    .map((comment) => (
                      <div key={comment.CoID} style={styles.commentItem}>
                        <div style={styles.commentHeader}>
                          <span style={styles.commentUsername}>{comment.username}</span>
                          <span style={styles.commentTimestamp}>
                            {new Date(comment.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p style={styles.commentContent}>{comment.content}</p>
                      </div>
                    ))
                ) : (
                  <p style={styles.noComments}>
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    maxWidth: "935px",
    margin: "0 auto",
    padding: "20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  createPostSection: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "30px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #dbdbdb",
    borderRadius: "4px",
    fontSize: "14px",
    '&:required': {
      borderColor: "#0095f6",
    },
  },
  textarea: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #dbdbdb",
    borderRadius: "4px",
    minHeight: "100px",
    resize: "vertical",
  },
  createButton: {
    backgroundColor: "#0095f6",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
  },
  postsGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  post: {
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  postHeader: {
    padding: "12px",
    borderBottom: "1px solid #efefef",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  username: {
    fontWeight: "600",
  },
  timestamp: {
    color: "#8e8e8e",
    fontSize: "12px",
  },
  postImage: {
    width: "100%",
    height: "auto",
    display: "block",
  },
  postContent: {
    padding: "12px",
  },
  caption: {
    margin: "0",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  errorMessage: {
    color: "red",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "#ffebee",
    borderRadius: "4px",
    fontSize: "14px",
  },
  commentForm: {
    marginTop: "15px",
    marginBottom: "20px",
    marginLeft: "10px",
    marginRight: "35px",
  },
  commentInput: {
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
  commentButton: {
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
  commentsList: {
    marginTop: "20px",
  },
  commentItem: {
    padding: "15px",
    borderBottom: "1px solid #eee",
    marginBottom: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "4px",
  },
  commentHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  commentUsername: {
    fontWeight: "600",
    color: "#1a1a1b",
  },
  commentTimestamp: {
    color: "#787c7e",
    fontSize: "12px",
  },
  commentContent: {
    fontSize: "14px",
    lineHeight: "1.5",
    color: "#1a1a1b",
    margin: 0,
  },
  noComments: {
    textAlign: "center",
    color: "#787c7e",
    fontStyle: "italic",
    padding: "20px 0",
  },
};

export default PostPage; 