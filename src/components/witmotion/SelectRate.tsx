import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useApplication } from "./ApplicationProvider";

export default function SelectAutoWidth() {
  const [age, setAge] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  const rateList = [0.2, 0.5, 1, 2, 5, 10, 20, 50];
  const { rateSelect } = useApplication();

  return (
    <div>
      <FormControl sx={{ m: 2, minWidth: 160 }}>
        <InputLabel id="demo-simple-select-autowidth-label">
          Rate [Hz]
        </InputLabel>
        <Select
          labelId="demo-simple-select-autowidth-label"
          id="demo-simple-select-autowidth"
          value={age}
          onChange={handleChange}
          autoWidth
          label="Rate [Hz]"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {rateList.map((rate) => {
            return (
              <MenuItem
                key={rate}
                value={rate}
                onClick={() => rateSelect(rate)}
              >
                {rate}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
}
