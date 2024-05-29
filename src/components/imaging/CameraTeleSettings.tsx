import React from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useContext } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { modeManual, modeAuto, whiteBalanceScenesIDValue } from "dwarfii_api";
import { Formik } from "formik";
import { allowedWBColorTemp } from "@/lib/data_utils";

import { setTeleAllParamsFn } from "@/lib/dwarf_utils";

type PropTypes = {
  teleWBAuto: number | undefined;
  setTeleWBAuto: Dispatch<SetStateAction<number | undefined>>;
  teleWBMode: number | undefined;
  setTeleWBMode: Dispatch<SetStateAction<number | undefined>>;
  teleWBColorTempIndexValue: number | undefined;
  setTeleWBColorTempIndexValue: Dispatch<SetStateAction<number | undefined>>;
  teleWBSceneValue: number | undefined;
  setTeleWBSceneValue: Dispatch<SetStateAction<number | undefined>>;
  teleBrightnessValue: number | undefined;
  setTeleBrightnessValue: Dispatch<SetStateAction<number | undefined>>;
  teleContrastValue: number | undefined;
  setTeleContrastValue: Dispatch<SetStateAction<number | undefined>>;
  teleHueValue: number | undefined;
  setTeleHueValue: Dispatch<SetStateAction<number | undefined>>;
  teleSaturationValue: number | undefined;
  setTeleSaturationValue: Dispatch<SetStateAction<number | undefined>>;
  teleSharpnessValue: number | undefined;
  setTeleSharpnessValue: Dispatch<SetStateAction<number | undefined>>;
  setShowSettingsTeleMenu: Dispatch<SetStateAction<boolean>>;
};

export default function CameraTeleSettings(props: PropTypes) {
  let connectionCtx = useContext(ConnectionContext);

  const {
    teleWBAuto,
    setTeleWBAuto,
    teleWBMode,
    setTeleWBMode,
    teleWBColorTempIndexValue,
    setTeleWBColorTempIndexValue,
    teleWBSceneValue,
    setTeleWBSceneValue,
    teleBrightnessValue,
    setTeleBrightnessValue,
    teleContrastValue,
    setTeleContrastValue,
    teleHueValue,
    setTeleHueValue,
    teleSaturationValue,
    setTeleSaturationValue,
    teleSharpnessValue,
    setTeleSharpnessValue,
    setShowSettingsTeleMenu,
  } = props;

  function changeWBAutoHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    setTeleWBAuto(parseInt(targetValue, 10));
    if (teleWBMode == undefined) setTeleWBMode(modeAuto);
  }
  function changeWBModeHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    setTeleWBMode(parseInt(targetValue, 10));
  }
  function changeWBColorTempIndexValueHandler(
    e: ChangeEvent<HTMLSelectElement>
  ) {
    let targetValue = e.target.value;
    setTeleWBColorTempIndexValue(parseInt(targetValue, 10));
  }
  function changeWBSceneValueHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    setTeleWBSceneValue(parseInt(targetValue, 10));
  }
  function changeBrightnessValueHandler(e: ChangeEvent<HTMLInputElement>) {
    let targetValue = parseInt(e.target.value, 10);
    if (targetValue < -100) {
      targetValue = -100;
    } else if (targetValue > 100) {
      targetValue = 100;
    }

    e.target.value = targetValue.toString();
    setTeleBrightnessValue(targetValue);
  }
  function changeContrastValueHandler(e: ChangeEvent<HTMLInputElement>) {
    let targetValue = parseInt(e.target.value, 10);
    if (targetValue < -100) {
      targetValue = -100;
    } else if (targetValue > 100) {
      targetValue = 100;
    }

    e.target.value = targetValue.toString();
    setTeleContrastValue(targetValue);
  }
  function changeHueValueHandler(e: ChangeEvent<HTMLInputElement>) {
    let targetValue = parseInt(e.target.value, 10);
    if (targetValue < -180) {
      targetValue = -180;
    } else if (targetValue > 180) {
      targetValue = 180;
    }

    e.target.value = targetValue.toString();
    setTeleHueValue(targetValue);
  }
  function changeSaturationValueHandler(e: ChangeEvent<HTMLInputElement>) {
    let targetValue = parseInt(e.target.value, 10);
    if (targetValue < -100) {
      targetValue = -100;
    } else if (targetValue > 100) {
      targetValue = 100;
    }

    e.target.value = targetValue.toString();
    setTeleSaturationValue(targetValue);
  }
  function changeSharpnessValueHandler(e: ChangeEvent<HTMLInputElement>) {
    let targetValue = parseInt(e.target.value, 10);
    if (targetValue < 0) {
      targetValue = 0;
    } else if (targetValue > 100) {
      targetValue = 100;
    }

    e.target.value = targetValue.toString();
    setTeleSharpnessValue(targetValue);
  }

  const allowedTeleWBColorTempOptions = allowedWBColorTemp.values.map(
    ({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    )
  );

  const allowedTeleWBSceneOptions = Object.entries(
    whiteBalanceScenesIDValue
  ).map(([index, name]) => (
    <option key={index} value={index}>
      {name}
    </option>
  ));

  function call_setTeleAllParamsFn() {
    let WBindex: number | undefined = 0;
    if (teleWBAuto == modeManual && teleWBMode == modeAuto)
      WBindex = teleWBColorTempIndexValue;
    if (teleWBAuto == modeManual && teleWBMode == modeManual)
      WBindex = teleWBSceneValue;

    setTeleAllParamsFn(
      connectionCtx,
      teleWBAuto,
      teleWBMode,
      WBindex,
      teleBrightnessValue,
      teleContrastValue,
      teleHueValue,
      teleSaturationValue,
      teleSharpnessValue
    );
  }

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          wbAuto: String(teleWBAuto),
          wbMode: String(teleWBMode),
          wbTemp: String(teleWBColorTempIndexValue),
          wbScene: String(teleWBSceneValue),
          brightness: String(teleBrightnessValue),
          contrast: String(teleContrastValue),
          hue: String(teleHueValue),
          saturation: String(teleSaturationValue),
          sharpness: String(teleSharpnessValue),
        }}
        onSubmit={() => {}}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
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
            {teleWBAuto == modeManual && (
              <div className="row mb-md-2 mb-sm-1">
                <div className="col-5">
                  <label htmlFor="wbMode">WB Mode</label>
                </div>
                <div className="col-4 me-2">
                  <select
                    id="wbMode"
                    name="wbMode"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changeWBModeHandler(e);
                    }}
                    value={values.wbMode}
                  >
                    <option key={modeAuto} value={modeAuto}>
                      Color Temp
                    </option>
                    <option key={modeManual} value={modeManual}>
                      Scene
                    </option>
                  </select>
                </div>
              </div>
            )}
            {teleWBAuto == modeManual && teleWBMode == modeAuto && (
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
                    {allowedTeleWBColorTempOptions}
                  </select>
                </div>
              </div>
            )}
            {teleWBAuto == modeManual && teleWBMode == modeManual && (
              <div className="row mb-md-2 mb-sm-1">
                <div className="col-5">
                  <label htmlFor="wbScene">WB Scene</label>
                </div>
                <div className="col-4 me-2">
                  <select
                    id="wbScene"
                    name="wbScene"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changeWBSceneValueHandler(e);
                    }}
                    value={values.wbScene}
                  >
                    {allowedTeleWBSceneOptions}
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
                  call_setTeleAllParamsFn();
                  setShowSettingsTeleMenu(false);
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
