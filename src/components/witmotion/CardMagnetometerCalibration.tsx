import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useApplication } from "./ApplicationProvider";

interface MagnetometerBackdropInterface {
  handleClose: () => void;
}

export const CardMagnetometerCalibration: React.FC<
  MagnetometerBackdropInterface
> = ({ handleClose }) => {
  const { magnetometerCalibration } = useApplication();

  return (
    <Card sx={{ maxWidth: 400 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          Magnetometer calibration
        </Typography>
        <br />
        <Typography variant="body2">
          To calibrate the magnetometer, it is necessary to rotate the sensor
          along EACH axis (starting with OZ) by 360 degrees 3 times.
          <br />
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            handleClose();
            magnetometerCalibration("stop");
          }}
        >
          End calibration
        </Button>
      </CardActions>
    </Card>
  );
};
