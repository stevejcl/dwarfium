import { useState, useContext, useEffect, useMemo } from "react";

import { ConnectionContext } from "@/stores/ConnectionContext";
import { AstroObject } from "@/types";
import {
  renderLocalRiseSetTime,
  computeRaDecToAltAz,
  convertAzToCardinal,
} from "@/lib/astro_utils";
import { centerHandler, startGotoHandler } from "@/lib/goto_utils";
import eventBus from "@/lib/event_bus";
import {
  convertHMSToDecimalDegrees,
  convertDMSToDecimalDegrees,
} from "@/lib/math_utils";
import { toIsoStringInLocalTime } from "@/lib/date_utils";

import GotoModal from "./GotoModal";

type AstronomyObjectPropType = {
  object: AstroObject;
};
type Message = {
  [k: string]: string;
};
export default function DSOObject(props: AstronomyObjectPropType) {
  const { object } = props;

  let connectionCtx = useContext(ConnectionContext);
  const [errors, setErrors] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [gotoMessages, setGotoMessages] = useState<Message[]>([] as Message[]);

  useEffect(() => {
    eventBus.on("clearErrors", () => {
      setErrors(undefined);
    });
    eventBus.on("clearSuccess", () => {
      setSuccess(undefined);
    });
  }, []);

  const [forceUpdate, setForceUpdate] = useState(false);

  // Recalculate all data
  const handleRefreshClick = () => {
    setForceUpdate((prev) => !prev);
  };

  // Memorize the calculated data using useMemo
  const riseSetTime = useMemo(() => renderRiseSetTime(), [forceUpdate]);
  const altAz = useMemo(() => renderAltAz(), [forceUpdate]);
  const raDec = useMemo(() => renderRADec(), [forceUpdate]);

  function renderRiseSetTime() {
    if (connectionCtx.latitude && connectionCtx.longitude) {
      let times = renderLocalRiseSetTime(
        object,
        connectionCtx.latitude,
        connectionCtx.longitude
      );

      if (times?.error) {
        return <span>{times.error}</span>;
      }

      if (times) {
        return (
          <span>
            Rises: {times.rise}, Sets: {times.set}
          </span>
        );
      }
    }
  }

  function renderAltAz() {
    let raDecimal: undefined | number;
    let decDecimal: undefined | number;
    if (object.ra) {
      raDecimal = convertHMSToDecimalDegrees(object.ra);
    }
    if (object.dec) {
      decDecimal = convertDMSToDecimalDegrees(object.dec);
    }

    if (
      connectionCtx.latitude &&
      connectionCtx.longitude &&
      raDecimal &&
      decDecimal
    ) {
      let today = new Date();

      let results = computeRaDecToAltAz(
        connectionCtx.latitude,
        connectionCtx.longitude,
        raDecimal,
        decDecimal,
        toIsoStringInLocalTime(today),
        connectionCtx.timezone
      );

      if (results) {
        return (
          <span>
            Alt: {results.alt.toFixed(0)}°, Az: {results.az.toFixed(0)}°{" "}
            {convertAzToCardinal(results.az)}
          </span>
        );
      }
    }
  }

  function renderRADec() {
    if (
      connectionCtx.latitude &&
      connectionCtx.longitude &&
      object.ra &&
      object.dec
    ) {
      return (
        <span>
          RA: {object.ra}, Dec: {object.dec}
        </span>
      );
    }
  }

  function gotoFn() {
    setShowModal(true);
    startGotoHandler(
      connectionCtx,
      setErrors,
      setSuccess,
      undefined,
      object.ra,
      object.dec,
      object.displayName,
      (options) => {
        setGotoMessages((prev) => prev.concat(options));
      }
    );
  }

  return (
    <div className="border-bottom p-2">
      <h3 className="fs-5 mb-0">{object.displayName}</h3>
      <div className="mb-2">{object.alternateNames}</div>
      <div className="row">
        <div className="col-md-4">
          {object.type} {object.constellation && " in " + object.constellation}
          <br />
          Size: {object.size}
          <br />
          Magnitude: {object.magnitude}
        </div>
        <div className="col-md-5">
          {riseSetTime}
          <br></br>
          {altAz}{" "}
          <button className="btn-refresh" onClick={handleRefreshClick}>
            <i className="fa fa-refresh" aria-hidden="true"></i>
          </button>
          <br></br>
          {raDec}
        </div>
        <div className="col-md-3">
          <button
            className={`btn ${
              connectionCtx.connectionStatusStellarium
                ? "btn-more02"
                : "btn-secondary"
            } me-2 mb-2`}
            onClick={() => centerHandler(object, connectionCtx, setErrors)}
            disabled={!connectionCtx.connectionStatusStellarium}
          >
            Center
          </button>
          <button
            className={`btn ${
              connectionCtx.connectionStatus ? "btn-more02" : "btn-secondary"
            } me-2 mb-2`}
            onClick={gotoFn}
            disabled={!connectionCtx.connectionStatus}
          >
            Goto
          </button>
          <br />
          <GotoModal
            object={object}
            showModal={showModal}
            setShowModal={setShowModal}
            messages={gotoMessages}
            setMessages={setGotoMessages}
          />
          {errors && <span className="text-danger">{errors}</span>}
          {success && <span className="text-success">{success}</span>}
        </div>
      </div>
    </div>
  );
}
