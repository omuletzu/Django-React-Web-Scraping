import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/SettingsPanel.css"

const SettingsPanel = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light"
  })

  // useEffect(() => {
  //   document.body.setAttribute("data-theme", theme)
  // }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    try {
      navigate("/logout");
    } catch (error) {
      console.log(e);
    }
  };

  const toggleTheme = (t) => {
    let newTheme = ""
    if (t === "dark") {
      newTheme = "dark";
    }
    if (t === "light") {
      newTheme = "light"
    }
    // const newTheme = theme === "dark" ? "light" : "dark"
    console.log("data-theme set to: " + newTheme)
    document.documentElement.setAttribute('data-theme', newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
  }

  document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  });

  return (
    <div className="panel"
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
        <button className="light-button" onClick={() => toggleTheme("light")}>Light</button>
        <button className="dark-button" onClick={() => toggleTheme("dark")}>Dark</button>
      </div>

      <button clas style={{ margin: "2vw" }} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default SettingsPanel;
