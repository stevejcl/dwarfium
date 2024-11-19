import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useApplication } from "./ApplicationProvider";

export default function AlgorithmTransition() {
  const { dofSelect } = useApplication();

  return (
    <div className="ms-4 mt-2">
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label" className="Menu">
          <b>Algorithm transition</b>
        </FormLabel>
        <RadioGroup
          className="Menu"
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
        >
          <FormControlLabel
            onClick={() => dofSelect("6 DOF")}
            value="6 DOF"
            control={<Radio />}
            label="6 DOF"
          />
          <FormControlLabel
            onClick={() => dofSelect("9 DOF")}
            value="9 DOF"
            control={<Radio />}
            label="9 DOF"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}
