import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const SettingsPanel = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      navigate('/logout')
    } catch (error) {
      console.log(e);
    }
  };
  
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "8vh", width: "100%", height: "75vh", justifyItems: "center" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <div style={{ flex: "1", fontWeight: "bold", margin: "2vw" }}>
          Theme
        </div>
        <button style={{ flex: "1", margin: "2vw" }}>Light</button>
        <button style={{ flex: "1", margin: "2vw" }}>Dark</button>
        <button style={{ flex: "1", margin: "2vw" }}>System</button>
      </div>

      <button style={{ margin: "2vw" }} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default SettingsPanel;
