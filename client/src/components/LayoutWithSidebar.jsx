import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideNavBar from "./SideNavBar";

const LayoutWithSidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed((prev) => !prev);
    };

    return (
        <div style={{ display: "flex" }}>
            {/* Sidebar */}
            <SideNavBar
                isCollapsed={isCollapsed}
                toggleSidebar={toggleSidebar}
            />
            {/* Main Content */}
            <div
                className={`main-content ${isCollapsed ? "collapsed" : "expanded"}`}
                style={{
                    display: "flex",
                    flex: 1,
                    padding: "20px",
                    transition: "margin-left 0.3s ease",
                }}
            >
                <div style={{ flex: 1 }}>
                    <Outlet /> {/* Child routes render here */}
                </div>
            </div>
        </div>
    );
};

export default LayoutWithSidebar;
