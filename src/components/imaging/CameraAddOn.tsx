import React, { useState, useContext, useRef } from "react";
import SlidingPane from "react-sliding-pane";
import JoystickController from "joystick-controller";
import CircularSlider from "@fseehawer/react-circular-slider";
import { ConnectionContext } from "@/stores/ConnectionContext";
import {
  messageStepMotorServiceJoystick,
  messageStepMotorServiceJoystickStop,
  messageStepMotorServiceJoystickFixedAngle,
  WebSocketHandler,
} from "dwarfii_api";

type PropTypes = {
  showModal: boolean;
};

export default function CameraAddOn(props: PropTypes) {
  const { showModal } = props;

  const [joystickId, setJoystickId] = useState(undefined);
  const joystickSpeed = useRef(2.2);

  let gLastTimeMotorCmd = Date.now();
  let gMotorState = false;

  let connectionCtx = useContext(ConnectionContext);

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
          hideContextMenu: true,
        },
        ({ x, y, leveledX, leveledY, distance, angle }) => {
          console.debug(x, y, leveledX, leveledY, distance, angle);
          console.debug("joystickSpeed", joystickSpeed.current);
          let newTimeMotorCmd = Date.now();
          let elapsedTime = newTimeMotorCmd - gLastTimeMotorCmd;
          let newMotorState = distance > 0;
          // Stop ?
          if (
            newMotorState === false &&
            gMotorState != newMotorState &&
            elapsedTime > 50
          ) {
            gMotorState = newMotorState;
            gLastTimeMotorCmd = newTimeMotorCmd;
            // Send Stop command
            console.debug("stop_motor");
            stop_motor();
          } else if (newMotorState && elapsedTime > 400) {
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
            move_joystick(angle_dec, vector, joystickSpeed.current);
          } else {
            console.debug("command motor not send", elapsedTime);
          }
        }
      );
      setJoystickId(staticJoystick);

      // Define the idString variable
      let idString = staticJoystick.id;

      // Construct the CSS class selectors using the idString
      let containerSelector = ".joystick-container-" + idString;

      // Get the elements matching the constructed selectors
      let containerElement = document.querySelector(
        containerSelector
      ) as HTMLElement;

      // Check if the elements exist
      if (containerElement) {
        // Modify CSS properties of the elements
        containerElement.style.position = "relative"; // fixed
        containerElement.style.right = "10px"; // 80%
        containerElement.style.left = "10px"; // 80%
        containerElement.style.bottom = "75px"; //  11% 75%
        containerElement.style.transform = "translate(0%,50%)"; //translate(50%,-50%)
      }

      let joystickContainer = staticJoystick.container;
      let newParent = document.getElementById("main_SlidingPane");

      if (joystickContainer && newParent) {
        // Remove joystickContainer from its current parent
        joystickContainer.parentNode.removeChild(joystickContainer);

        // Insert joystickContainer as the first child of the new parent
        if (newParent.firstChild) {
          newParent.insertBefore(joystickContainer, newParent.firstChild);
        } else {
          console.debug("no firstChild");
          newParent.appendChild(joystickContainer);
        }
        staticJoystick.recenterJoystick();

        // Create buttons div element
        create_button_joystick(
          joystickContainer,
          "Up",
          "joystick-button-up",
          90,
          "bi bi-arrow-up-circle"
        );
        create_button_joystick(
          joystickContainer,
          "Down",
          "joystick-button-down",
          270,
          "bi bi-arrow-down-circle"
        );
        create_button_joystick(
          joystickContainer,
          "Left",
          "joystick-button-left",
          180,
          "bi bi-arrow-left-circle"
        );
        create_button_joystick(
          joystickContainer,
          "Right",
          "joystick-button-right",
          0,
          "bi bi-arrow-right-circle"
        );
      }
    }
  }

  function updateNewSpeed(value) {
    joystickSpeed.current = value;
  }

  function create_button_joystick(
    divJoystickContainer,
    title,
    className,
    angle,
    icon
  ) {
    // Create a button div element
    const newDiv = document.createElement("div");
    // Set attributes and classes for the new div
    newDiv.title = title;
    newDiv.className = className;
    // Create the inner content (icon)
    const iconElement = document.createElement("i");
    iconElement.className = icon;
    // Add a mouseup event listener to the new div
    newDiv.addEventListener("mousedown", function (event) {
      // Handle the mousedown event here
      if (event.button == 0)
        move_joystick(angle, 0.8, joystickSpeed.current, false);
      // right click
      else move_joystick(angle, 0.8, joystickSpeed.current, true);
    });
    newDiv.addEventListener("mouseup", function () {
      stop_motor();
    });
    // Append the icon to the new div
    newDiv.appendChild(iconElement);
    // Append the new div into the joystickContainer
    divJoystickContainer.appendChild(newDiv);
  }

  function move_joystick(angle_dec, vector, motorspeed, fixed = false) {
    const webSocketHandler = connectionCtx.socketIPDwarf
      ? connectionCtx.socketIPDwarf
      : new WebSocketHandler(connectionCtx.IPDwarf);

    if (webSocketHandler.isConnected()) {
      let txtInfoCommand = "";
      console.debug("actual motorspeed: ", motorspeed);

      let speed_dwarf = ((motorspeed - 1) * 30) / 4;
      console.debug("new speed: ", speed_dwarf);
      let WS_Packet;
      if (!fixed) {
        WS_Packet = messageStepMotorServiceJoystick(
          angle_dec,
          vector,
          speed_dwarf
        );
      } else {
        WS_Packet = messageStepMotorServiceJoystickFixedAngle(
          angle_dec,
          vector,
          speed_dwarf
        );
      }
      txtInfoCommand = "Joystick";
      webSocketHandler.prepare(WS_Packet, txtInfoCommand);
    }
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
              initialValue={2.2}
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
                updateNewSpeed(value);
              }}
            />
          </div>
          <div className="containerCamera">
            <div className="pane">
              <div className="column">
                <div className="header">
                  <div className="title">Photo</div>
                </div>
                <div className="separator"></div>
                <img
                  src="/images/photocamera.png"
                  className="cameraAddon-image"
                />
                <div className="button-container">
                  <button className="button">Tele</button>
                  <button className="button">Wide</button>
                </div>
              </div>
              <div className="column">
                <div className="header">
                  <div className="title">Video</div>
                </div>
                <div className="separator"></div>
                <img
                  src="/images/photocamera.png"
                  className="cameraAddon-image"
                />
                <div className="button-container">
                  <button className="button-cent">Tele</button>
                </div>
              </div>
              <div className="column">
                <div className="header">
                  <div className="title">Panorama</div>
                </div>
                <div className="separator"></div>
                <img
                  src="/images/photocamera.png"
                  className="cameraAddon-image"
                />
                <div className="button-container">
                  <button className="button-cent">Tele</button>
                </div>
              </div>
              <div className="column">
                <div className="header">
                  <div className="title">Burst Photo</div>
                </div>
                <div className="separator"></div>
                <img
                  src="/images/photocamera.png"
                  className="cameraAddon-image"
                />
                <div className="button-container">
                  <button className="button">Tele</button>
                  <button className="button">Wide</button>
                </div>
              </div>
              <div className="column">
                <div className="header">
                  <div className="title">Time Laps</div>
                </div>
                <div className="separator"></div>
                <img
                  src="/images/photocamera.png"
                  className="cameraAddon-image"
                />
                <div className="button-container">
                  <button className="button">Tele</button>
                  <button className="button">Wide</button>
                </div>
              </div>
              <div className="column">
                <div className="header">
                  <div className="title">Settings</div>
                </div>
                <div className="separator"></div>
                <img
                  src="/images/photocamera.png"
                  className="cameraAddon-image"
                />
                <div className="button-container">
                  <button className="button-cent">Wide</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SlidingPane>
    </div>
  );
}
