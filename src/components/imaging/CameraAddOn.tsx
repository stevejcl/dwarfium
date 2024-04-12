import React, { useState, useContext, useRef, useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
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
  setShowModal: Dispatch<SetStateAction<boolean>>;
};
// Define a generic event handler type that can handle events from both HTMLButtonElement and HTMLImageElement
type GenericMouseEventHandler<T extends HTMLElement> =
  React.MouseEventHandler<T>;

export default function CameraAddOn(props: PropTypes) {
  const { showModal, setShowModal } = props;

  const [joystickId, setJoystickId] = useState(undefined);
  const joystickSpeed = useRef(2.2);

  const [activeAction, setActiveAction] = useState<string | undefined>(
    undefined
  ); // State to track active action
  const [activeBtnPhoto, setActiveBtnPhoto] = useState("tele"); // State to track active button
  const [activeBtnVideo, setActiveBtnVideo] = useState("tele"); // State to track active button
  const [activeBtnPano, setActiveBtnPano] = useState("tele"); // State to track active button
  const [activeBtnBurst, setActiveBtnBurst] = useState("tele"); // State to track active button
  const [activeBtnTimeLapse, setActiveBtnTimeLapse] = useState("tele"); // State to track active button
  const [activeBtnSettings, setActiveBtnSettings] = useState("wide"); // State to track active button

  // Size > 1500
  let closePane = useRef(true);
  let ChangeWindowSize = useRef(window.innerWidth);
  let maxRange = useRef(70);
  let radius = useRef(75);
  let joystickRadius = useRef(45);
  let xValue = useRef("80%");
  let yValue = useRef("11%");
  let rightContainer = useRef("10px");
  let leftContainer = useRef("10px");
  let bottomContainer = useRef("75px");
  let WidthSlidePane = useRef("1500px");
  let WidthCircularSlider = useRef(150);
  let trackSize = useRef(24);

  useEffect(() => {
    const handleResize = () => {
      //setWindowWidth(window.innerWidth);
      update_control();
    };
    update_control();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const PhotosModeActions = [
    "Photo",
    "Video",
    "Panorama",
    "Burst",
    "Time Lapse",
    "Settings",
  ];

  const handleBtnPhotoClick = (buttonName) => {
    // Update state to set the active button
    setActiveBtnPhoto(
      buttonName === activeBtnPhoto
        ? buttonName === "tele"
          ? "wide"
          : "tele"
        : buttonName
    );
  };
  const handleBtnVideoClick = (buttonName) => {
    // Update state to set the active button
    setActiveBtnVideo(buttonName);
  };
  const handleBtnPanoClick = (buttonName) => {
    // Update state to set the active button
    setActiveBtnPano(buttonName);
  };
  const handleBtnBurstClick = (buttonName) => {
    // Update state to set the active button
    setActiveBtnBurst(
      buttonName === activeBtnBurst
        ? buttonName === "tele"
          ? "wide"
          : "tele"
        : buttonName
    );
  };
  const handleBtnTimeLapseClick = (buttonName) => {
    // Update state to set the active button
    setActiveBtnTimeLapse(
      buttonName === activeBtnTimeLapse
        ? buttonName === "tele"
          ? "wide"
          : "tele"
        : buttonName
    );
  };
  const handleBtnSettingsClick = (buttonName) => {
    // Update state to set the active button
    setActiveBtnSettings(buttonName);
  };
  // action Click   Image
  const handleClickActionPhoto: GenericMouseEventHandler<
    HTMLImageElement
  > = () => {
    // Update state to set the active button
    setActiveAction(PhotosModeActions[0].toString());

    // Simulate an action delay or any other operations
    setTimeout(() => {
      setActiveAction(undefined); // Reset activeAction to undefined after some delay
    }, 1000); // Example: Reset after 1 second (1000 milliseconds)
    setActiveAction(undefined);
  };

  const handleClickActionBurstPhoto: GenericMouseEventHandler<
    HTMLImageElement
  > = () => {
    // Update state to set the active button
    setActiveAction(PhotosModeActions[3]);

    setActiveAction(undefined);
  };

  function update_control() {
    if (window.innerWidth > 1500) {
      maxRange.current = 70;
      radius.current = 75;
      joystickRadius.current = 45;
      xValue.current = "80%";
      yValue.current = "11%";
      rightContainer.current = "10px";
      leftContainer.current = "10px";
      bottomContainer.current = "75px";
      WidthSlidePane.current = "1500px";
      WidthCircularSlider.current = 150;
      trackSize.current = 24;
      if (ChangeWindowSize.current < 1500) {
        setShowModal(false);
      }
      ChangeWindowSize.current = window.innerWidth;
    } else if (window.innerWidth > 1300 && window.innerWidth <= 1500) {
      maxRange.current = 60;
      radius.current = 55;
      joystickRadius.current = 30;
      xValue.current = "60%";
      yValue.current = "10%";
      rightContainer.current = "7px";
      leftContainer.current = "7px";
      bottomContainer.current = "57px";
      WidthSlidePane.current = "1250px";
      WidthCircularSlider.current = 110;
      trackSize.current = 24;
      if (ChangeWindowSize.current <= 1300 || ChangeWindowSize.current > 1500) {
        setShowModal(false);
      }
      ChangeWindowSize.current = window.innerWidth;
    } else if (window.innerWidth > 1200 && window.innerWidth <= 1300) {
      maxRange.current = 60;
      radius.current = 55;
      joystickRadius.current = 30;
      xValue.current = "60%";
      yValue.current = "5%";
      rightContainer.current = "7px";
      leftContainer.current = "7px";
      bottomContainer.current = "57px";
      WidthSlidePane.current = "1100px";
      WidthCircularSlider.current = 110;
      trackSize.current = 24;
      if (ChangeWindowSize.current <= 1200 || ChangeWindowSize.current > 1300) {
        setShowModal(false);
      }
      ChangeWindowSize.current = window.innerWidth;
    } else {
      maxRange.current = 55;
      radius.current = 50;
      joystickRadius.current = 25;
      xValue.current = "50%";
      yValue.current = "1%";
      rightContainer.current = "5px";
      leftContainer.current = "5px";
      bottomContainer.current = "50px";
      WidthSlidePane.current = "1060px";
      WidthCircularSlider.current = 100;
      trackSize.current = 12;
      if (ChangeWindowSize.current > 1200) {
        setShowModal(false);
      }
      ChangeWindowSize.current = window.innerWidth;
    }
  }

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
          maxRange: maxRange.current,
          level: 10,
          radius: radius.current,
          joystickRadius: joystickRadius.current,
          opacity: 0.5,
          leftToRight: false,
          bottomToUp: true,
          containerClass: "joystick-container",
          controllerClass: "joystick-controller",
          joystickClass: "joystick",
          distortion: true,
          x: xValue.current,
          y: yValue.current,
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
        containerElement.style.right = rightContainer.current; // 80%
        containerElement.style.left = leftContainer.current; // 80%
        containerElement.style.bottom = bottomContainer.current; //  11% 75%
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
    if (joystick_id) {
      joystick_id.destroy();
      setJoystickId(undefined);
    }
  }

  return (
    <div>
      <SlidingPane
        className="some-custom-class"
        overlayClassName="slide-pane__overlay_hide"
        isOpen={showModal && closePane.current}
        title="Camera Add On"
        hideHeader={true}
        from="bottom"
        width={WidthSlidePane.current}
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
              width={WidthCircularSlider.current}
              min={1.1}
              max={5}
              initialValue={2.2}
              label="SPEED"
              labelColor="#005a58"
              knobColor="#005a58"
              progressColorFrom="#00bfbd"
              progressColorTo="#009c9a"
              progressSize={trackSize.current}
              trackColor="#eeeeee"
              trackSize={trackSize.current}
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
                  alt="Take Burst Photos"
                  onClick={
                    activeAction === undefined
                      ? handleClickActionPhoto
                      : undefined
                  }
                  style={{ cursor: "pointer" }}
                />
                <div className="button-container">
                  <button
                    className={`button ${
                      activeBtnPhoto === "tele" ? "active" : ""
                    }`}
                    onClick={() => handleBtnPhotoClick("tele")}
                  >
                    Tele
                  </button>
                  <button
                    className={`button ${
                      activeBtnPhoto === "wide" ? "active" : ""
                    }`}
                    onClick={() => handleBtnPhotoClick("wide")}
                  >
                    Wide
                  </button>
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
                  <button
                    className={`button-cent ${
                      activeBtnVideo === "tele" ? "active" : ""
                    }`}
                    onClick={() => handleBtnVideoClick("tele")}
                  >
                    Tele
                  </button>
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
                  <button
                    className={`button-cent ${
                      activeBtnPano === "tele" ? "active" : ""
                    }`}
                    onClick={() => handleBtnPanoClick("tele")}
                  >
                    Tele
                  </button>
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
                  onClick={
                    activeAction === undefined
                      ? handleClickActionBurstPhoto
                      : undefined
                  }
                  style={{ cursor: "pointer" }}
                />
                <div className="button-container">
                  <button
                    className={`button ${
                      activeBtnBurst === "tele" ? "active" : ""
                    }`}
                    onClick={() => handleBtnBurstClick("tele")}
                  >
                    Tele
                  </button>
                  <button
                    className={`button ${
                      activeBtnBurst === "wide" ? "active" : ""
                    }`}
                    onClick={() => handleBtnBurstClick("wide")}
                  >
                    Wide
                  </button>
                </div>
              </div>
              <div className="column">
                <div className="header">
                  <div className="title">Time Lapse</div>
                </div>
                <div className="separator"></div>
                <img
                  src="/images/photocamera.png"
                  className="cameraAddon-image"
                />
                <div className="button-container">
                  <button
                    className={`button ${
                      activeBtnTimeLapse === "tele" ? "active" : ""
                    }`}
                    onClick={() => handleBtnTimeLapseClick("tele")}
                  >
                    Tele
                  </button>
                  <button
                    className={`button ${
                      activeBtnTimeLapse === "wide" ? "active" : ""
                    }`}
                    onClick={() => handleBtnTimeLapseClick("wide")}
                  >
                    Wide
                  </button>
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
                  <button
                    className={`button-cent ${
                      activeBtnSettings === "wide" ? "active" : ""
                    }`}
                    onClick={() => handleBtnSettingsClick("wide")}
                  >
                    Wide
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SlidingPane>
    </div>
  );
}
