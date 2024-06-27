import { AsteroidData } from "@/components/asteroids/api/types";
import { comparisonSize } from "@/components/asteroids/functions/comparison";
import Image from "next/image";
import React from "react";
import { useEffect, useRef, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { statusPath, parseStellariumData } from "@/lib/stellarium_utils";
import { AstroObject, ParsedStellariumData } from "@/types";
import {
  centerHandler,
  startGotoHandler,
  stellariumErrorHandler,
} from "@/lib/goto_utils";
import { convertHMSToDwarfRA, convertDMSToDwarfDec } from "@/lib/math_utils";
import eventBus from "@/lib/event_bus";

import imgBullet from "/public/images/rifle-bullet.png";

type AsteroidProps = {
  data: AsteroidData;
  setErrors: Dispatch<SetStateAction<string | undefined>>;
  setSuccess: Dispatch<SetStateAction<string | undefined>>;
};

export const Asteroid: React.FC<AsteroidProps> = ({
  data,
  setErrors,
  setSuccess,
}) => {
  const asteroidEstimatedSize = Math.round(
    ((data.estimated_diameter?.meters?.estimated_diameter_max || 0) +
      (data.estimated_diameter?.meters?.estimated_diameter_min || 0)) /
      2
  );
  let connectionCtx = useContext(ConnectionContext);
  let currentObjectName = useRef("");

  const asteroidApproachTime =
    data.close_approach_data?.[0]?.close_approach_date_full?.split(" ")[1];

  const asteroidSpeed = Math.round(
    data.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second || 0
  );

  const asteroidMissDistance =
    Math.round(
      (data.close_approach_data?.[0]?.miss_distance?.astronomical || 0) * 100
    ) / 100;

  const compareSize = comparisonSize(asteroidEstimatedSize);

  useEffect(() => {
    eventBus.on("clearErrors", () => {
      setErrors(undefined);
    });
    eventBus.on("clearSuccess", () => {
      setSuccess(undefined);
    });
  }, [currentObjectName.current]);

  function noObjectSelectedHandler() {
    setErrors("`Asteroid not found in Stellarium database`).");
    currentObjectName.current = "";
  }

  function validDataHandler(objectData: ParsedStellariumData) {
    let parsedRA = convertHMSToDwarfRA(objectData.RA);
    if (!parsedRA) {
      setErrors("Invalid RA: " + objectData.RA);
    }

    let parsedDeclination = convertDMSToDwarfDec(objectData.declination);
    if (!parsedDeclination) {
      setErrors("Invalid Declination: " + objectData.declination);
    }
    if (parsedRA && parsedDeclination && currentObjectName.current) {
      startGotoHandler(
        connectionCtx,
        setErrors,
        setSuccess,
        undefined,
        parsedRA,
        parsedDeclination,
        currentObjectName.current
      );
    }
  }

  function resetData() {
    setErrors(undefined);
    setSuccess(undefined);
    currentObjectName.current = "";
  }

  function fetchStellariumData() {
    console.log("start fetchStellariumData...");
    let url = connectionCtx.urlStellarium;
    if (url) {
      fetch(`${url}${statusPath}`, {
        signal: AbortSignal.timeout(2000),
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              noObjectSelectedHandler();
            } else {
              setErrors("Error when connecting to Stellarium");
            }
            return;
          }

          return response.json();
        })
        .then((data) => {
          if (data.selectioninfo === "") {
            noObjectSelectedHandler();
          } else {
            console.log(data.selectioninfo);
            const objectData = parseStellariumData(data.selectioninfo);
            console.error(objectData);
            if (objectData) {
              validDataHandler(objectData);
            }
          }
        })
        .catch((err) => stellariumErrorHandler(err, setErrors));
    } else {
      setErrors("App is not connect to Stellarium.");
    }
  }

  const handleGotoClick = () => {
    resetData();
    const asteroidName = data.name?.match(/\(([^)]+)\)/)?.[1] || "";
    try {
      let objectAsteroid: AstroObject = {
        designation: asteroidName,
        displayName: "",
        type: "Asteroid",
        typeCategory: "",
        dec: "",
        ra: "",
        magnitude: "",
        catalogue: "",
        objectNumber: 0,
        constellation: "",
        alternateNames: "",
        notes: "",
        favorite: false,
      };
      currentObjectName.current = asteroidName;
      console.log("select asteroid by name in stellarium... : ", asteroidName);
      centerHandler(
        objectAsteroid,
        connectionCtx,
        setErrors,
        fetchStellariumData
      );
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        setErrors(error.message);
      } else {
        setErrors(String(error));
      }
    }
  };

  return (
    <div className="asteroid">
      <div className="container">
        <div className="details">
          <h3 className="name">{data.name?.match(/\(([^)]+)\)/)?.[1] || ""}</h3>
          <p>Estimated Size - {asteroidEstimatedSize} м</p>
          <p>Approach Time - {asteroidApproachTime} UTC</p>
          <p>Distance - {asteroidMissDistance} au</p>
          <p>Speed - {asteroidSpeed} KM/Sec</p>
          {data.is_potentially_hazardous_asteroid ? (
            <div className="dangerous">Potentially Dangerous</div>
          ) : (
            <div className="notDangerous">Not Dangerous</div>
          )}
          <button
            className={`btn ${
              connectionCtx.connectionStatusStellarium
                ? "btn btn-more02"
                : "btn-more02"
            } me-4 mt-3`}
            onClick={handleGotoClick}
            disabled={!connectionCtx.connectionStatusStellarium}
          >
            Goto
          </button>
        </div>
        <div className="comparison">
          <Image
            className="comparisonSizeImage"
            src={compareSize.img || ""}
            alt={compareSize.text}
          />
          <div>{compareSize.text}</div>
        </div>
        <div className="comparison">
          <Image
            className="comparisonSpeedImage"
            src={imgBullet}
            alt={"Asteroid speed"}
          />
          <div>{asteroidSpeed > 1 && `${asteroidSpeed}X`} Bullet speed</div>
        </div>
      </div>
    </div>
  );
};

export default Asteroid;
