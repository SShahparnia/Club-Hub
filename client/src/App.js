import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { UserProvider } from "./context/UserContext";
import PrivateRoutes from "./utils/PrivateRoutes";
import "./styles.css";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ClubHomePage from "./pages/ClubHomePage";
import ThreadPage from "./pages/ThreadPage";
import CreateThreadPage from "./pages/CreateThreadPage";
import ChatRoomPage from "./pages/ChatRoomPage";
import Navbar from "./components/NavBar";
import LayoutWithSidebar from "./components/LayoutWithSidebar";
import IndividualThreadPage from "./pages/IndividualThreadPage";
import PostPage from "./pages/PostPage";
import EventPage from "./pages/EventPage";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <UserProvider>
      <ThemeProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<HomePage />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoutes />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/search" element={<SearchPage />} />

              {/* Sidebar Layout for Club Pages */}
              <Route element={<LayoutWithSidebar />}>
                <Route path="/club/:clubID" element={<ClubHomePage />} />
                <Route path="/club/:clubID/threads" element={<ThreadPage />} />
                <Route path="/club/:clubID/threads/create-thread" element={<CreateThreadPage />} />
                <Route path="/club/:clubID/chatroom/:chatroomID" element={<ChatRoomPage />} />
                <Route path="/club/:clubID/threads/thread/:threadID" element={<IndividualThreadPage />} />
                <Route path="/club/:clubID/posts" element={<PostPage />} />
                <Route path="/club/:clubID/events" element={<EventPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;
