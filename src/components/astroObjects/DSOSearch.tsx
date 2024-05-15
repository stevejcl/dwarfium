import { useState, useContext } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";

export default function DSOSearch({ updateSearchText }) {
  let connectionCtx = useContext(ConnectionContext);
  const [searchTxtValue, setSearchTxtValue] = useState(connectionCtx.searchTxt);

  function searchHandler() {
    updateSearchText(searchTxtValue);
  }

  return (
    <div>
      <div className="row mb-3">
        <div className="col-lg-1 col-md-2">
          <button className="btn btn-more02" onClick={searchHandler}>
            Search
          </button>
        </div>
        <div className="col-lg-3	 col-md-10">
          <input
            pattern="^[\w\s]{0,255}$/i"
            className="form-control"
            placeholder=""
            id="search"
            name="search"
            value={searchTxtValue}
            onChange={(e) => setSearchTxtValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
