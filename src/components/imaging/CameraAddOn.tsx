import React, { useState, useContext } from "react";
import SlidingPane from "react-sliding-pane";
import JoystickController from "joystick-controller";
import CircularSlider from "@fseehawer/react-circular-slider";
import { ConnectionContext } from "@/stores/ConnectionContext";
import {
  messageStepMotorServiceJoystick,
  messageStepMotorServiceJoystickStop,
  WebSocketHandler,
} from "dwarfii_api";

type PropTypes = {
  showModal: boolean;
};

export default function CameraAddOn(props: PropTypes) {
  const { showModal } = props;
  //  const [motorState, setMotorState] = useState(0);
  //  const [lastTimeMotorCmd, setLastTimeMotorCmd] = useState(0);
  const [joystickId, setJoystickId] = useState(undefined);
  const [speed, setSpeed] = useState(2.2);

  let connectionCtx = useContext(ConnectionContext);

  let gLastTimeMotorCmd = Date.now();
  let gMotorState = false;

  function joystick(angle_dec, vector) {
    const webSocketHandler = connectionCtx.socketIPDwarf
      ? connectionCtx.socketIPDwarf
      : new WebSocketHandler(connectionCtx.IPDwarf);

    if (webSocketHandler.isConnected()) {
      let txtInfoCommand = "";
      let speed_dwarf = ((speed - 1) * 30) / 4;
      let WS_Packet = messageStepMotorServiceJoystick(
        angle_dec,
        vector,
        speed_dwarf
      );
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

  function init_joystick() {
    if (!joystickId) {
      const staticJoystick = new JoystickController(
        {
          maxRange: 70,
          level: 10,
          radius: 75,
          joystickRadius: 45,
          opacity: 0.5,
          leftToRight: false,
          bottomToUp: true,
          containerClass: "joystick-container",
          controllerClass: "joystick-controller",
          joystickClass: "joystick",
          distortion: true,
          x: "80%",
          y: "11%",
          mouseClickButton: "ALL",
          hideContextMenu: false,
        },
        ({ x, y, leveledX, leveledY, distance, angle }) => {
          console.debug(x, y, leveledX, leveledY, distance, angle);
          let newTimeMotorCmd = Date.now();
          let elapsedTime = newTimeMotorCmd - gLastTimeMotorCmd;
          let newMotorState = distance > 0;
          // Stop ?
          if (
            newMotorState === false &&
            gMotorState != newMotorState &&
            elapsedTime > 100
          ) {
            //setMotorState(newMotorState);
            //setLastTimeMotorCmd(newTimeMotorCmd);
            gMotorState = newMotorState;
            gLastTimeMotorCmd = newTimeMotorCmd;
            // Send Stop command
            console.debug("stop_motor");
            stop_motor();
          } else if (newMotorState && elapsedTime > 500) {
            //setMotorState(newMotorState);
            //setLastTimeMotorCmd(newTimeMotorCmd);
            gMotorState = newMotorState;
            gLastTimeMotorCmd = newTimeMotorCmd;
            let angle_dec = (angle * 180) / 3.14116;
            if (angle_dec < 0) {
              angle_dec = 360 + angle_dec;
            }
            angle_dec = 360 - angle_dec;
            let vector =
              Math.sqrt(leveledX * leveledX + leveledY * leveledY) / 10;
            console.debug(elapsedTime, angle_dec, vector);
            joystick(angle_dec, vector);
          } else {
            console.debug("command motor not send", elapsedTime);
          }
        }
      );
      setJoystickId(staticJoystick);

	  // Define the idString variable
      let idString = staticJoystick.id;

      // Construct the CSS class selectors using the idString
      let containerSelector = '.joystick-container-' + idString;

      // Get the elements matching the constructed selectors
      let containerElement = document.querySelector(containerSelector);

      // Check if the elements exist
      if (containerElement) {
          // Modify CSS properties of the elements
          containerElement.style.position = 'relative'; // fixed
          containerElement.style.right = '10px';  // 80%
          containerElement.style.left = '10px';  // 80%
          containerElement.style.bottom = '75px'; //  11%
          containerElement.style.transform =  'translate(0%,50%)'; //translate(50%,-50%)
      }
     
      let joystickContainer = staticJoystick.container
      let newParent = document.getElementById('main_SlidingPane');
        console.error(newParent);

      if (joystickContainer && newParent) {
        console.error("change Parent");
        // Remove joystickContainer from its current parent
        joystickContainer.parentNode.removeChild(joystickContainer);

        // Insert joystickContainer as the first child of the new parent
        if (newParent.firstChild) {
          console.error("change firstChild");
          newParent.insertBefore(joystickContainer, newParent.firstChild);
        } else {
          console.error("no firstChild");
          newParent.appendChild(joystickContainer);
        }
        console.error(newParent);
      }
      
    }
  }

  function setNewSpeed(value) {
    setSpeed(value);
  }

  function close_joystick(joystick_id) {
    if (joystickId) {
      joystick_id.destroy();
      setJoystickId(undefined);
    }
  }

  return (
    <div>
      <SlidingPane
        className="some-custom-class"
        overlayClassName="slide-pane__overlay_hide"
        isOpen={showModal}
        title="Camera Add On"
        hideHeader={true}
        from="bottom"
        width="80%"
        onAfterOpen={() => {
          setTimeout(init_joystick, 500);
        }}
        onAfterClose={() => {
          close_joystick(joystickId);
        }}
        onRequestClose={() => {}}
      >
	   <div id="main_SlidingPane" className="box-element">
        <div className="speed-meter">
          <CircularSlider
            width={150}
            min={1.1}
            max={5}
            initialValue={2}
            label="SPEED"
            labelColor="#005a58"
            knobColor="#005a58"
            progressColorFrom="#00bfbd"
            progressColorTo="#009c9a"
            progressSize={24}
            trackColor="#eeeeee"
            trackSize={24}
            data={[
              "1.1",
              "1.2",
              "1.4",
              "1.6",
              "1.8",
              "2.0",
              "2.2",
              "2.4",
              "2.6",
              "2.8",
              "3.0",
              "3.2",
              "3.4",
              "3.6",
              "3.8",
              "4.0",
              "4.2",
              "4.4",
              "4.6",
              "4.8",
              "5",
            ]}
            dataIndex={6}
            onChange={(value) => {
              setNewSpeed(value);
            }}
          />
        </div>
        </div>
      </SlidingPane>
    </div>
  );
}
