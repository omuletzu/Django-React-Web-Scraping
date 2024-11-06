import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const SettingsPanel = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  })

  // useEffect(() => {
  //   document.body.setAttribute("data-theme", theme)
  // }, [theme])

  const handleLogout = async () => {
    try {
      navigate("/logout");
    } catch (error) {
      console.log(e);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark" 
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "8vh",
        width: "100%",
        height: "75vh",
        justifyItems: "center",
      }}
    >
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
        <button style={{ flex: "1", margin: "2vw" }} onClick={() => toggleTheme()}>Light</button>
        <button style={{ flex: "1", margin: "2vw", filter: "invert(100%)" }}  onClick={() => toggleTheme()}>
          Dark
        </button>
      </div>

      <button clas style={{ margin: "2vw" }} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default SettingsPanel;
