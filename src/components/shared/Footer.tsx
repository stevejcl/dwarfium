import React, { useState } from "react";
import packageJson from "../../../package.json";

export default function Footer() {
  const versionNumber = packageJson.version;
  const [theme] = useState<"light" | "dark">("light");

  return (
    <div className="row">
      <div className="col-md-12 text-center">
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
          <span className="version-text"> Version: {versionNumber}</span>
        </div>
      </div>
    </div>
  );
}
