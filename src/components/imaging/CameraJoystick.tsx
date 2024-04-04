/* eslint no-unused-vars: 0 */
import { useState, useContext } from "react";
import JoystickController from "joystick-controller";

import { ConnectionContext } from "@/stores/ConnectionContext";
import {
  Dwarfii_Api,
  messageStepMotorServiceJoystick,
  messageStepMotorServiceJoystickStop,
  WebSocketHandler,
} from "dwarfii_api";

export default function CameraJoystick() {
  const [motorState, setMotorState] = useState(false);
  const [lastTimeMotorCmd, setLastTimeMotorCmd] = useState(0);
  let connectionCtx = useContext(ConnectionContext);

  function joystick(angle_dec, vector) {
    const webSocketHandler = connectionCtx.socketIPDwarf
      ? connectionCtx.socketIPDwarf
      : new WebSocketHandler(connectionCtx.IPDwarf);

    if (webSocketHandler.isConnected()) {
      let txtInfoCommand = "";
      let WS_Packet = messageStepMotorServiceJoystick(angle_dec, vector, 10);
      txtInfoCommand = "Joystick";
      webSocketHandler.prepare(WS_Packet, txtInfoCommand);
    }
  }

  function stop_motor() {
    const webSocketHandler = connectionCtx.socketIPDwarf
      ? connectionCtx.socketIPDwarf
      : new WebSocketHandler(connectionCtx.IPDwarf);

    if (webSocketHandler.isConnected()) {
      let txtInfoCommand = "";
      let WS_Packet = messageStepMotorServiceJoystickStop();
      txtInfoCommand = "Joystick";
      webSocketHandler.prepare(WS_Packet, txtInfoCommand);
    }
  }

  let gLastTimeMotorCmd = Date.now();
  let gMotorState = false;

  const staticJoystick = new JoystickController(
    {
      maxRange: 70,
      level: 10,
      radius: 50,
      joystickRadius: 30,
      opacity: 0.5,
      leftToRight: false,
      bottomToUp: true,
      containerClass: "joystick-container",
      controllerClass: "joystick-controller",
      joystickClass: "joystick",
      distortion: true,
      x: "93%",
      y: "15%",
      mouseClickButton: "ALL",
      hideContextMenu: false,
    },
    ({ x, y, leveledX, leveledY, distance, angle }) => {
      console.error(x, y, leveledX, leveledY, distance, angle);
      let newTimeMotorCmd = Date.now();
      let elapsedTime = newTimeMotorCmd - gLastTimeMotorCmd;
      let newMotorState = distance > 0;
      // Stop ?
      if (
        newMotorState === false &&
        gMotorState != newMotorState &&
        elapsedTime > 100
      ) {
        setMotorState(newMotorState);
        setLastTimeMotorCmd(newTimeMotorCmd);
        gMotorState = newMotorState;
        gLastTimeMotorCmd = newTimeMotorCmd;
        // Send Stop command
        console.error("stop_motor");
        stop_motor();
      } else if (newMotorState && elapsedTime > 500) {
        setMotorState(newMotorState);
        setLastTimeMotorCmd(newTimeMotorCmd);
        gMotorState = newMotorState;
        gLastTimeMotorCmd = newTimeMotorCmd;
        let angle_dec = (angle * 180) / 3.14116;
        if (angle_dec < 0) {
          angle_dec = 360 + angle_dec;
        }
        angle_dec = 360 - angle_dec;
        let vector = Math.sqrt(leveledX * leveledX + leveledY * leveledY) / 10;
        console.error(elapsedTime, angle_dec, vector);
        joystick(angle_dec, vector);
      } else {
        console.error("command motor not send", elapsedTime);
      }
    }
  );

  function log(value) {
    console.log(value); //eslint-disable-line
  }

  return <div></div>;
}
