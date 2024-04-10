import React from "react";
import PIP from "./PIP";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import classes from "./ResizablePIP.module.css";

const ResizablePIP = ({
  children,
  width = 500,
  height = 500,
  minConstraints = [300, 300],
  maxConstraints = [800, 800],
}) => {
  return (
    <div>
      <PIP>
        <ResizableBox
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          className={classes.pipResizableContent}
          width={width}
          height={height}
          minConstraints={minConstraints}
          maxConstraints={maxConstraints}
        >
          {children}
        </ResizableBox>
      </PIP>
    </div>
  );
};

export default ResizablePIP;
