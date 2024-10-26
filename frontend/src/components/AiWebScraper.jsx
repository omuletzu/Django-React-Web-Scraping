import React, { useState } from 'react'
import api from '../api'


const AiWebScraper = () => {
    const [url, setUrl] = useState('');
    const [domContent, setDomContent] = useState('');
    const [parseDescription, setParseDescription] = useState('');
    const [parsedResult, setParsedResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleScrape = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await api.post('/api/scrape/', { url });
            setDomContent(res.data.html_content);
        } catch (error) {
            alert("Error scraping the website: " + error + " Maybe the website is not accessible or the URL is invalid.");
        } finally {
            setLoading(false);
        }
    };

    // const handleParse = async () => {
    //     if (!domContent || !parseDescription) return;
    //     setLoading(true);
    //     try {
    //         const response = await axios.post('/api/parse', { 
    //             dom_content: domContent, 
    //             description: parseDescription 
    //         });
    //         setParsedResult(response.data.result);
    //         setLoading(false);
    //     } catch (error) {
    //         console.error("Error parsing the content:", error);
    //         setLoading(false);
    //     }
    // };

    const handleParse = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const res = await api.post('/api/parse/', { dom_content: domContent, parse_description: parseDescription });
            setParsedResult(res.data.parsed_content);
        } catch (error) {
            alert("Error parsing the content: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>AI Web Scraper</h1>
            
            <div>
                <label>Enter Website URL:</label>
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                />
                <button onClick={handleScrape} disabled={loading}>
                    {loading ? "Scraping..." : "Scrape Website"}
                </button>
            </div>

            {domContent && (
                <div>
                    <h2>View DOM Content</h2>
                    <textarea 
                        readOnly 
                        value={domContent} 
                        rows="10" 
                        style={{ width: "100%" }}
                    />
                </div>
            )}

            {domContent && (
                <div>
                    <label>Describe what you want to parse:</label>
                    <textarea
                        value={parseDescription}
                        onChange={(e) => setParseDescription(e.target.value)}
                        rows="3"
                        style={{ width: "100%" }}
                    />
                    <button onClick={handleParse} disabled={loading}>
                        {loading ? "Parsing..." : "Parse Content"}
                    </button>
                </div>
            )}

            {parsedResult && (
                <div>
                    <h2>Parsed Result</h2>
                    <p>{parsedResult}</p>
                </div>
            )}
        </div>
    );
};

export default AiWebScraper;
