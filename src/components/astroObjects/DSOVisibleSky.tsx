import { useState, useContext } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";

export default function DSOVisibleSky({ updateVisibleSkyLimit }) {
  let connectionCtx = useContext(ConnectionContext);
  const [visibleSkyLimitValue, setVisibleSkyLimitValue] = useState(
    connectionCtx.visibleSkyLimit
  );

  function setSkyLimitHandler() {
    updateVisibleSkyLimit(visibleSkyLimitValue);
  }

  return (
    <div>
      <div className="row mb-3">
        <div className="col-lg-1 col-md-2">
          <button className="btn btn-more02" onClick={setSkyLimitHandler}>
            Sky Limit
          </button>
        </div>
        <div className="col-lg-3 col-md-10">
          <input
            pattern="^[\w\s]{0,255}$/i"
            className="form-control"
            placeholder=""
            id="setLimit"
            name="setLimit"
            value={visibleSkyLimitValue}
            onChange={(e) => setVisibleSkyLimitValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
