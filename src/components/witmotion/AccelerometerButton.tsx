import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { sleep } from "@/lib/witmotion/helper";
import { useApplication } from "./ApplicationProvider";
import MenuItem from "@mui/material/MenuItem";

export function AccelerometerBackdrop() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const { accelerometerCalibration } = useApplication();

  return (
    <div>
      <MenuItem
        onClick={async () => {
          accelerometerCalibration();
          handleOpen();
          await sleep(3100);
          handleClose();
        }}
      >
        Accelerometer calibration
      </MenuItem>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
