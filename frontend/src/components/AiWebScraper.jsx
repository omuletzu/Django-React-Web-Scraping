import React, { Fragment, useEffect, useState } from "react";
import ReactDom from "react-dom";
import api from "../api";
import { ClimbingBoxLoader } from "react-spinners";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaHistory } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import HistoryPanel from "./HistoryPanel";
import SettingsPanel from "./SettingsPanel";
import { Transition } from "@headlessui/react";
import AutosizeTextarea from "react-autosize-textarea";
import "../output.css";

const AiWebScraper = () => {
  const [url, setUrl] = useState("");
  const [lastScrappedUrl, setLastScrappedUrl] = useState("");
  const [domContent, setDomContent] = useState("");
  const [parseDescription, setParseDescription] = useState("");
  const [parsedResult, setParsedResult] = useState("");
  const [loadingScrap, setLoadingScrap] = useState(false);
  const [loadingParse, setLoadingParse] = useState(false);
  const [domContentVisible, setDomContentVisibile] = useState(false);
  const [isHistoryPaneOpen, setIsHistoryPaneOpen] = useState(false);
  const [isSettingsPaneOpen, setIsSettingsPaneOpen] = useState(false);
  const [isUserPaneOpen, setIsUserPaneOpen] = useState(false);

  let buttonsDivHeight = "10vh";
  
  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, [parsedResult]);

  const handleScrape = async (e) => {
    e.preventDefault();
    setLoadingScrap(true);
    console.log(localStorage.getItem(ACCESS_TOKEN))
    try {
      const res = await api.post("/api/scrape/", { url });
      setDomContent(res.data.dom_content_cleaned);
    } catch (error) {
      alert(
        "Error scraping the website: " +
          error +
          " Maybe the website is not accessible or the URL is invalid."
      );
    } finally {
      setLoadingScrap(false);
      setLastScrappedUrl(url);
    }
  };

  const handleParse = async (e) => {
    e.preventDefault();
    setLoadingParse(true);

    try {
      const res = await api.post("/api/parse/", {
        dom_content: domContent,
        parse_description: parseDescription,
        url: lastScrappedUrl,
      });
      setParsedResult(res.data.parsed_content);
    } catch (error) {
      alert("Error parsing the content: " + error);
    } finally {
      setLoadingParse(false);
    }
  };

  const toggleDomContentVisible = () => {
    setDomContentVisibile(!domContentVisible);
  };

  const presetValues = async (note) => {
    setIsHistoryPaneOpen(false)
    setUrl(note.url)
    setLastScrappedUrl(note.url)
    setParseDescription(note.prompt)

    const res = await api.post("/api/get_dom_content/", { search_url : note.url });
    setDomContent(res.data.result)
  }

  return (
    <div
      className="no-scroll"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        boxSizing: "border-box",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div style={{ flex: "1" }}>
        <h1
          className="text-3xl font-bold underline text-blue-600"
          style={{ textAlign: "center", padding: "10vh" }}
        >
          AI Web Scraper
        </h1>

        <div className="scrollable" style={{ textAlign: "center" }}>
          <label style={{ padding: "10vh" }}>Enter Website URL:</label>
          <input
            style={{ width: "50vw", borderRadius: "20px", padding: "0.5vw" }}
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
          />

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {loadingScrap && (
                <ClimbingBoxLoader color="#eb761c" size={9}></ClimbingBoxLoader>
              )}

              <button
                style={{
                  margin: "4vh",
                  padding: "2vh",
                  backgroundColor: "#f1f1f1",
                }}
                onClick={handleScrape}
                disabled={loadingParse || loadingScrap}
              >
                {loadingScrap ? "Scraping..." : "Scrape content"}
              </button>
            </div>

            {domContent && (
              <button
                style={{
                  margin: "4vh",
                  padding: "2vh",
                  borderColor: domContentVisible ? "#eb761c" : "#f9f9f9",
                  outline: "none",
                  backgroundColor: "#f1f1f1",
                }}
                onClick={toggleDomContentVisible}
              >
                {domContentVisible ? "Hide DOM content" : "Show DOM content"}
              </button>
            )}
          </div>
        </div>

        {domContentVisible && domContent && (
          <div
            style={{
              margin: "10vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h2 style={{ margin: "1vh" }}>View DOM Content</h2>
            <textarea
              readOnly
              value={domContent}
              rows="10"
              style={{
                width: "100%",
                padding: "1.5vh",
                borderWidth: "1px",
                borderRadius: "10px",
              }}
            />
          </div>
        )}

        {domContent && (
          <div
            style={{
              margin: "10vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <label style={{ margin: "1vh" }}>
              Describe what you want to parse:
            </label>
            <AutosizeTextarea
              value={parseDescription}
              onChange={(e) => setParseDescription(e.target.value)}
              placeholder="Your description"
              style={{
                width: "100%",
                padding: "1.5vh",
                borderWidth: "1px",
                borderRadius: "10px",
              }}
            />

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <button
                style={{
                  margin: "2vh",
                  padding: "2vh",
                  backgroundColor: "#f1f1f1",
                }}
                onClick={handleParse}
                disabled={loadingParse || loadingScrap}
              >
                {loadingParse ? "Parsing..." : "Parse content"}
              </button>

              {loadingParse && (
                <ClimbingBoxLoader color="#eb761c" size={9}></ClimbingBoxLoader>
              )}
            </div>
          </div>
        )}

        {parsedResult && (
          <div style={{ margin: "20vh", fontWeight: "bold", borderWidth: "1px", borderRadius: "10px", padding: "1.5vh" }}>
            <h2>Parsed Result</h2>
            {
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {parsedResult}
              </ReactMarkdown>
            }
          </div>
        )}
      </div>

      <Transition
        show={isHistoryPaneOpen}
        enter="transition-transform transform duration-300 ease-in-out"
        enterFrom="-translate-x-full opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transition-transform transform duration-300 ease-in-out"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="-translate-x-full opacity-0"
      >
        <div
          className="fixed top-0 left-0 h-full w-semi bg-opacity-95 shadow-lg p-4 z-10"
          style={{
            height: `calc(100vh - ${buttonsDivHeight})`,
            justifyItems: "center",
          }}
        >
          <button
            className="fixed top-4 left-4"
            onClick={() => setIsHistoryPaneOpen(false)}
            style={{ backgroundColor: "white" }}
          >
            <IoCloseOutline />
          </button>

          <h1 className="text-3xl" style={{ textAlign: "center" }}>
            Your history
          </h1>

          <HistoryPanel presetValues={presetValues} />
        </div>
      </Transition>

      <Transition
        show={isSettingsPaneOpen}
        enter="transition-transform transform duration-300 ease-in-out"
        enterFrom="translate-x-full opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transition-transform transform duration-300 ease-in-out"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="translate-x-full opacity-0"
      >
        <div
          className="fixed top-0 right-0 h-full w-semi bg-opacity-95 shadow-lg p-4 z-10"
          style={{
            height: `calc(100vh - ${buttonsDivHeight})`,
            justifyItems: "center",
          }}
        >
          <button
            className="fixed top-4 right-4"
            onClick={() => setIsSettingsPaneOpen(false)}
            style={{ backgroundColor: "white" }}
          >
            <IoCloseOutline />
          </button>

          <h1 className="text-3xl" style={{ textAlign: "center" }}>
            Your history
          </h1>

          <SettingsPanel />
        </div>
      </Transition>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#f1f1f1",
          height: buttonsDivHeight,
          zIndex: "10",
        }}
      >
        <button
          style={{
            margin: "1vw",
            flex: "1",
            justifyContent: "center",
            display: "flex",
            backgroundColor: "#f1f1f1",
          }}
          onClick={() => {
            setIsHistoryPaneOpen(!isHistoryPaneOpen);
            setIsSettingsPaneOpen(false);
            setIsUserPaneOpen(false);
          }}
        >
          <FaHistory size={22.5} />
          History
        </button>

        <button
          style={{
            margin: "1vw",
            flex: "1",
            justifyContent: "center",
            display: "flex",
            backgroundColor: "#f1f1f1",
          }}
          onClick={() => {
            setIsHistoryPaneOpen(false);
            setIsSettingsPaneOpen(false);
            setIsUserPaneOpen(!isUserPaneOpen);
          }}
        >
          {localStorage.getItem("current_username")}
        </button>

        <button
          style={{
            margin: "1vw",
            flex: "1",
            justifyContent: "center",
            display: "flex",
            backgroundColor: "#f1f1f1",
          }}
          onClick={() => {
            setIsHistoryPaneOpen(false);
            setIsSettingsPaneOpen(!isSettingsPaneOpen);
            setIsUserPaneOpen(false);
          }}
        >
          <IoMdSettings size={22.5} />
          Settings
        </button>
      </div>
    </div>
  );
};

export default AiWebScraper;
