import React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AlgorithmTransition from "./AlgorithmTransition";
import { Divider } from "@mui/material";
import RateSelect from "./SelectRate";
import { AccelerometerBackdrop } from "./AccelerometerButton";
import { MagnetometerBackdrop } from "./MagnetometerButton";

interface BasicMenuInterface {
  dis: boolean;
}
type ButtonLogic = "contained" | "outlined";

const MenuSettings = ({ dis }: BasicMenuInterface) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const buttonLogic: ButtonLogic[] = ["contained", "outlined"];
  // Button render
  if (dis) {
    return null; // Don't render the button if 'dis' is true
  }
  return (
    <div>
      <Button
        disabled={dis}
        variant={buttonLogic[Number(dis)]}
        id="btn-more02"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        className="btn-more02"
        sx={{
          backgroundColor: "#00B280", // Set background color
          "&:hover": {
            backgroundColor: "#00B280",
          },
        }}
      >
        Settings
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <AccelerometerBackdrop />
        <MagnetometerBackdrop />
        <Divider />
        <AlgorithmTransition />
        <Divider />
        <RateSelect />
      </Menu>
    </div>
  );
};

export default MenuSettings;
