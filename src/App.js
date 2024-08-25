import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import Logo from "../public/devad-logo.png";
import "./App.css";

function App() {
  const [apiKey, setApiKey] = useState("");
  const [query, setQuery] = useState("");
  const [promotResponse, setPromotResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedApiKey = process.env.REACT_APP_GEMINI_API_KEY;
    setApiKey(storedApiKey);
  }, []);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const getResponseForGivenPrompt = async () => {
    if (!apiKey) {
      setError("Please provide a valid Gemini API key");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(query);
      const response = await result.response;
      setPromotResponse([response]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setError(
        "An Error occurred while fetching the response, Please Try Again later"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="gpi-container">
      <div className="img-logo">
        <img height="50px" src="/devad-logo.png" alt="dev-ad-logo" />
      </div>
      <h3 className="dev-ad-text">Dev@d Gemini GPI</h3>
      <form onSubmit={getResponseForGivenPrompt}>
        <label htmlFor="query">Enter your query:</label>
        <textarea
          className="chat-bot-textarea"
          type="text"
          id="query"
          value={query}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button
          type="button"
          disabled={isLoading}
          onClick={getResponseForGivenPrompt}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {promotResponse.length > 0 && (
        <div>
          {promotResponse.map((response, responseIndex) => {
            const { candidates } = response;
            return (
              <div key={responseIndex}>
                {candidates.map((candidate, candidateIndex) => (
                  <div className="category" key={candidateIndex}>
                    <div className="code-block" style={{ color: "white" }}>
                      {candidate.content.parts[0].text
                        .split("\n\n")
                        .map((section, i) => {
                          if (section.startsWith("**")) {
                            return (
                              <h3
                                style={{ color: "white" }}
                                key={i}
                                className="language-title"
                              >
                                {section.replace(/\*\*/g, "")}{" "}
                              </h3>
                            );
                          } else if (section.startsWith("* **")) {
                            return (
                              <div
                                style={{ color: "white" }}
                                key={i}
                                className="language-feature"
                              >
                                <h4 style={{ color: "#00ffe6" }}>
                                  {section.split(":")[0].replace(/\*\*/g, "")}:
                                </h4>
                                <p style={{ color: "#00ffe6" }}>
                                  {section.split(":")[1]}
                                </p>
                              </div>
                            );
                          } else {
                            return (
                              <p style={{ color: "#00ffe6" }} key={i}>
                                {section}
                              </p>
                            );
                          }
                        })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
