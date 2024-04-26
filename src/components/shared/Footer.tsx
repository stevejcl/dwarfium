
import React from "react";


export default function Nav() {

    const versionNumber = "2.2.0";

    return (
    
    <div className="row">
      <div className="col-md-12 text-center">
        <div className="footer">
          <p>
            Copyright Dwarfium &copy; 2024. All rights reserved. Made with{" "}
            <span style={{ color: "red" }}>&#10084;</span> for the DwarfII.
                  </p><span className="version-text"> Version: {versionNumber}
                  </span>
                  
        </div>

      </div>
               
    
    </div>
  );
}
