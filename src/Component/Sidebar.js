import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location.pathname);

  return (
    <div className="container sidebar">
      <div className="d-flex justify-content-center">
        <img src="/logo.png" className="logo"></img>
      </div>
      <hr className="mb-5"/>
      <div className="links">
        <a>Overview</a>
        <a>Onboarding</a>
        <a
        // highlight the selected based on current pathname
        className={location.pathname === "/monitoring/pending" || location.pathname === "/monitoring/completed"? "active" : ""}
        onClick={() => navigate("monitoring/pending")}
        >
          Monitoring
        </a>
        <a>Flagging</a>
        <a>Source of Income</a>
        <a>UAR</a>
      </div>
    </div>
  );
};

export default Sidebar;
