import React, { useState, useContext } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";

export default function DSOVisibleSky({ updateVisibleSkyLimit }) {
  let connectionCtx = useContext(ConnectionContext);
  const [visibleSkyLimitValue, setVisibleSkyLimitValue] = useState(
    connectionCtx.visibleSkyLimit
  );
  const [showTooltip, setShowTooltip] = useState(false);

  function setSkyLimitHandler() {
    updateVisibleSkyLimit(visibleSkyLimitValue);
  }

  return (
    <div className="sky_object">
      <div className="row mb-3">
        <div className="col-lg-2 col-md-3 col-sm-4 col-12 mb-2 mb-md-0">
          <button className="btn btn-more02 w-100" onClick={setSkyLimitHandler}>
            Sky Limit
          </button>
        </div>
        <div className="col-lg-5 col-md-9 col-sm-8 col-12">
          <div className="tooltip-container">
            <input
              pattern="^[\\w\\s]{0,255}$/i"
              className="form-control"
              placeholder=""
              id="setLimit"
              name="setLimit"
              value={visibleSkyLimitValue}
              onChange={(e) => setVisibleSkyLimitValue(e.target.value)}
            />
            <span className={`tooltip-text-SK ${showTooltip ? "show" : ""}`}>
              Enter the sky limit value. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. Integer ac nisl magna. Quisque iaculis massa ac
              diam facilisis tempor. Sed.
            </span>
          </div>
        </div>
        <div className="col-lg-2 col-md-3 col-sm-4 col-12 mb-2 mb-md-0">
          <i
            className="bi bi-info-circle"
            role="button"
            onClick={() => setShowTooltip(!showTooltip)}
          ></i>
        </div>
      </div>
    </div>
  );
}
