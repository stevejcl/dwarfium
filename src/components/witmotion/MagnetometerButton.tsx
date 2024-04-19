import * as React from "react";
import { CardMagnetometerCalibration } from "./CardMagnetometerCalibration";
import { useApplication } from "./ApplicationProvider";
import MenuItem from "@mui/material/MenuItem";
import Backdrop from "@mui/material/Backdrop";

// Кнопка Magnetometer calibration
export function MagnetometerBackdrop() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
  };
  const { magnetometerCalibration } = useApplication();

  return (
    <div>
      <MenuItem
        onClick={() => {
          handleOpen();
          magnetometerCalibration("start");
        }}
      >
        Magnetometer calibration
      </MenuItem>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CardMagnetometerCalibration handleClose={handleClose} />
      </Backdrop>
    </div>
  );
}
