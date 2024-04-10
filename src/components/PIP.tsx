import React from "react";
import Draggable from "react-draggable";
import classes from "./PIP.module.css";

const PIP = ({ children }) => {
  return (
    <div>
      <Draggable>
        <div className={classes.pipWindow}>{children}</div>
      </Draggable>
    </div>
  );
};

export default PIP;
