import React from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useContext } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { modeManual, modeAuto } from "dwarfii_api";
import { Formik } from "formik";
import {
  allowedWideExposures,
  allowedWideGains,
  allowedWideWBColorTemp,
} from "@/lib/data_wide_utils";

import { setWideAllParamsFn } from "@/lib/dwarf_utils";

type PropTypes = {
  wideExposureAuto: number | undefined;
  setWideExposureAuto: Dispatch<SetStateAction<number | undefined>>;
  wideExposureIndexValue: number | undefined;
  setWideExposureIndexValue: Dispatch<SetStateAction<number | undefined>>;
  wideGainIndexValue: number | undefined;
  setWideGainIndexValue: Dispatch<SetStateAction<number | undefined>>;
  wideWBAuto: number | undefined;
  setWideWBAuto: Dispatch<SetStateAction<number | undefined>>;
  wideWBColorTempIndexValue: number | undefined;
  setWideWBColorTempIndexValue: Dispatch<SetStateAction<number | undefined>>;
  wideBrightnessValue: number | undefined;
  setWideBrightnessValue: Dispatch<SetStateAction<number | undefined>>;
  wideContrastValue: number | undefined;
  setWideContrastValue: Dispatch<SetStateAction<number | undefined>>;
  wideHueValue: number | undefined;
  setWideHueValue: Dispatch<SetStateAction<number | undefined>>;
  wideSaturationValue: number | undefined;
  setWideSaturationValue: Dispatch<SetStateAction<number | undefined>>;
  wideSharpnessValue: number | undefined;
  setWideSharpnessValue: Dispatch<SetStateAction<number | undefined>>;
  setShowSettingsWideMenu: Dispatch<SetStateAction<boolean>>;
};

export default function CameraWideSettings(props: PropTypes) {
  let connectionCtx = useContext(ConnectionContext);

  const {
    wideExposureAuto,
    setWideExposureAuto,
    wideExposureIndexValue,
    setWideExposureIndexValue,
    wideGainIndexValue,
    setWideGainIndexValue,
    wideWBAuto,
    setWideWBAuto,
    //wideWBMode,
    //setWideWBMode,
    wideWBColorTempIndexValue,
    setWideWBColorTempIndexValue,
    //wideWBSceneValue,
    //setWideWBSceneValue,
    wideBrightnessValue,
    setWideBrightnessValue,
    wideContrastValue,
    setWideContrastValue,
    wideHueValue,
    setWideHueValue,
    wideSaturationValue,
    setWideSaturationValue,
    wideSharpnessValue,
    setWideSharpnessValue,
    setShowSettingsWideMenu,
  } = props;

  function changeExposureModeHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    setWideExposureAuto(parseInt(targetValue, 10));
  }
  function changeExposureHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    setWideExposureIndexValue(parseInt(targetValue, 10));
  }
  function changeGainHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    setWideGainIndexValue(parseInt(targetValue, 10));
  }
  function changeWBAutoHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    setWideWBAuto(parseInt(targetValue, 10));
  }
  function changeWBColorTempIndexValueHandler(
    e: ChangeEvent<HTMLSelectElement>
  ) {
    let targetValue = e.target.value;
    setWideWBColorTempIndexValue(parseInt(targetValue, 10));
  }
  function changeBrightnessValueHandler(e: ChangeEvent<HTMLInputElement>) {
    let targetValue = parseInt(e.target.value, 10);
    if (targetValue < -100) {
      targetValue = -100;
    } else if (targetValue > 100) {
      targetValue = 100;
    }

    e.target.value = targetValue.toString();
    setWideBrightnessValue(targetValue);
  }
  function changeContrastValueHandler(e: ChangeEvent<HTMLInputElement>) {
    let targetValue = parseInt(e.target.value, 10);
    if (targetValue < -100) {
      targetValue = -100;
    } else if (targetValue > 100) {
      targetValue = 100;
    }

    e.target.value = targetValue.toString();
    setWideContrastValue(targetValue);
  }
  function changeHueValueHandler(e: ChangeEvent<HTMLInputElement>) {
    let targetValue = parseInt(e.target.value, 10);
    if (targetValue < -180) {
      targetValue = -180;
    } else if (targetValue > 180) {
      targetValue = 180;
    }

    e.target.value = targetValue.toString();
    setWideHueValue(targetValue);
  }
  function changeSaturationValueHandler(e: ChangeEvent<HTMLInputElement>) {
    let targetValue = parseInt(e.target.value, 10);
    if (targetValue < -100) {
      targetValue = -100;
    } else if (targetValue > 100) {
      targetValue = 100;
    }

    e.target.value = targetValue.toString();
    setWideSaturationValue(targetValue);
  }
  function changeSharpnessValueHandler(e: ChangeEvent<HTMLInputElement>) {
    let targetValue = parseInt(e.target.value, 10);
    if (targetValue < 0) {
      targetValue = 0;
    } else if (targetValue > 100) {
      targetValue = 100;
    }

    e.target.value = targetValue.toString();
    setWideSharpnessValue(targetValue);
  }

  const allowedWideExposuresOptions = allowedWideExposures.values.map(
    ({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    )
  );

  const allowedWideGainsOptions = allowedWideGains.values.map(
    ({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    )
  );

  const allowedWideWBColorTempOptions = allowedWideWBColorTemp.values.map(
    ({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    )
  );

  function call_setWideAllParamsFn() {
    let WBindex: number | undefined = 0;
    /*
   if ( wideWBAuto == modeManual && wideWBMode == modeAuto)
     WBindex = wideWBColorTempIndexValue;
   if ( wideWBAuto == modeManual && wideWBMode == modeManual)
     WBindex = wideWBSceneValue;
   */
    if (wideWBAuto == modeManual) WBindex = wideWBColorTempIndexValue;

    setWideAllParamsFn(
      connectionCtx,
      wideExposureAuto,
      wideExposureIndexValue,
      wideGainIndexValue,
      wideWBAuto,
      WBindex,
      wideBrightnessValue,
      wideContrastValue,
      wideHueValue,
      wideSaturationValue,
      wideSharpnessValue
    );
  }

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          exposureMode: String(wideExposureAuto),
          exposure: String(wideExposureIndexValue),
          gain: String(wideGainIndexValue),
          wbAuto: String(wideWBAuto),
          wbTemp: String(wideWBColorTempIndexValue),
          brightness: String(wideBrightnessValue),
          contrast: String(wideContrastValue),
          hue: String(wideHueValue),
          saturation: String(wideSaturationValue),
          sharpness: String(wideSharpnessValue),
        }}
        onSubmit={() => {}}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-5">
                <label htmlFor="exposureMode">Ex. Mode</label>
              </div>
              <div className="col-4 me-2">
                <select
                  id="exposureMode"
                  name="exposureMode"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changeExposureModeHandler(e);
                  }}
                  value={values.exposureMode}
                >
                  <option key={modeAuto} value={modeAuto}>
                    Auto
                  </option>
                  <option key={modeManual} value={modeManual}>
                    Manual
                  </option>
                </select>
              </div>
            </div>
            {wideExposureAuto == modeManual && (
              <div className="row mb-md-2 mb-sm-1">
                <div className="col-5">
                  <label htmlFor="exposure">Exposure</label>
                </div>
                <div className="col-4 me-2">
                  <select
                    id="exposure"
                    name="exposure"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changeExposureHandler(e);
                    }}
                    value={values.exposure}
                  >
                    {allowedWideExposuresOptions}
                  </select>
                </div>
              </div>
            )}
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-5">
                <label htmlFor="gain">Gain</label>
              </div>
              <div className="col-4 me-2">
                <select
                  id="gain"
                  name="gain"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changeGainHandler(e);
                  }}
                  value={values.gain}
                >
                  {allowedWideGainsOptions}
                </select>
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-5">
                <label htmlFor="wbAuto">WB Auto</label>
              </div>
              <div className="col-4 me-2">
                <select
                  id="wbAuto"
                  name="wbAuto"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changeWBAutoHandler(e);
                  }}
                  value={values.wbAuto}
                >
                  <option key={modeAuto} value={modeAuto}>
                    Auto
                  </option>
                  <option key={modeManual} value={modeManual}>
                    Manual
                  </option>
                </select>
              </div>
            </div>
            {wideWBAuto == modeManual && (
              <div className="row mb-md-2 mb-sm-1">
                <div className="col-5">
                  <label htmlFor="wbTemp">WB Temp</label>
                </div>
                <div className="col-4 me-2">
                  <select
                    id="wbTemp"
                    name="wbTemp"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changeWBColorTempIndexValueHandler(e);
                    }}
                    value={values.wbTemp}
                  >
                    {allowedWideWBColorTempOptions}
                  </select>
                </div>
              </div>
            )}
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-5">
                <label htmlFor="brightness">Brightness</label>
              </div>
              <div className="col-4 me-2">
                <input
                  id="brightness"
                  name="brightness"
                  type="number"
                  min="-100"
                  max="100"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changeBrightnessValueHandler(e);
                  }}
                  value={values.brightness}
                />
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-5">
                <label htmlFor="contrast">Contrast</label>
              </div>
              <div className="col-4 me-2">
                <input
                  id="contrast"
                  name="contrast"
                  type="number"
                  min="-100"
                  max="100"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changeContrastValueHandler(e);
                  }}
                  value={values.contrast}
                />
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-5">
                <label htmlFor="hue">Hue</label>
              </div>
              <div className="col-4 me-2">
                <input
                  id="hue"
                  name="hue"
                  type="number"
                  min="-180"
                  max="180"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changeHueValueHandler(e);
                  }}
                  value={values.hue}
                />
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-5">
                <label htmlFor="saturation">Saturation</label>
              </div>
              <div className="col-4 me-2">
                <input
                  id="saturation"
                  name="saturation"
                  type="number"
                  min="-100"
                  max="100"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changeSaturationValueHandler(e);
                  }}
                  value={values.saturation}
                />
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-5">
                <label htmlFor="sharpness">Sharpness</label>
              </div>
              <div className="col-4 me-2">
                <input
                  id="sharpness"
                  name="sharpness"
                  type="number"
                  min="0"
                  max="100"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changeSharpnessValueHandler(e);
                  }}
                  value={values.sharpness}
                />
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  call_setWideAllParamsFn();
                  setShowSettingsWideMenu(false);
                }}
                className="btn btn-more02"
              >
                Update
              </button>
            </div>
            {/* {JSON.stringify(values)} */}
          </form>
        )}
      </Formik>
    </div>
  );
}
