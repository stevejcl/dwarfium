import React, { useState } from "react";

export default function Footer() {
  const versionNumber = "2.4.6";
  const [theme] = useState<"light" | "dark">("light");
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleFooter = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="footer-container">
      {!isMinimized ? (
        <div
          className="footer"
          style={{
            color:
              theme === "light"
                ? "var(--footer-color-light)"
                : "var(--footer-color-dark)",
          }}
        >
          <p>
            Copyright Dwarfium &copy; 2024. All rights reserved. Made with{" "}
            <span style={{ color: "red" }}>&#10084;</span> for the Dwarf Device.
          </p>
          <span className="version-text">Version: {versionNumber}</span>
          <button className="footer-toggle-btn" onClick={toggleFooter}>
            &#9660; {/* Down arrow icon */}
          </button>
        </div>
      ) : (
        <div className="footer-minimized">
          <button className="footer-toggle-btn" onClick={toggleFooter}>
            &#9650; {/* Up arrow icon */}
          </button>
        </div>
      )}
    </div>
  );
}
