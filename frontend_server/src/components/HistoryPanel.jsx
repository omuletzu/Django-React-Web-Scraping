import React, { useEffect, useState } from "react";
import api from "../api";

const HistoryPanel = ({ presetValues }) => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  useEffect(() => {
    handle_url_update()
  }, [])

  useEffect(() => {
    const handler = setTimeout(() => {
      handle_url_update();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [url]);

  const truncateDescription = (text) => {
    let max_length = window.innerWidth / 15;

    if (text.length <= max_length) {
      return text;
    }

    return text.slice(0, max_length) + "...";
  };

  const handle_url_update = async () => {
    setLoading(true);
    try {
      const res = await api.post("http://20.223.114.24:80" + "/api/retreive_notes/", { search_url: url });
      setResults(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "2vw" }}>
      <input
        style={{
          width: "40vw",
          borderRadius: "20px",
          padding: "0.5vw",
          backgroundColor: "#f5f5f5",
          textAlign: "center",
        }}
        type="text"
        onChange={(e) => {
          setUrl(e.target.value);
        }}
        placeholder="Search for a link"
      />
  
      <ul style={{ overflowY: "auto", height: "70vh" }}>
        {results.map((note) =>
          note.prompt ? (
            <li key={note.id}>
              <button
                style={{
                  display: "flex",
                  flexDirection: "row",
                  margin: "3vh",
                  borderWidth: "1px",
                  borderRadius: "10px",
                }}
                onClick={() => presetValues(note)}
              >
                <div style={{ margin: "0.5vh", fontWeight: "bold" }}>
                  {note.url}
                </div>

                <div style={{ margin: "0.5vh" }}>
                  {truncateDescription(note.prompt)}
                </div>
              </button>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
};

export default HistoryPanel;
