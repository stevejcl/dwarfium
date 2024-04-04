import { useContext, useState } from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Formik } from "formik";

import { ConnectionContext } from "@/stores/ConnectionContext";
import { modeManual, modeAuto } from "dwarfii_api";
import { saveAstroSettingsDb } from "@/db/db_utils";
import { validateAstroSettings } from "@/components/imaging/form_validations";
import { AstroSettings } from "@/types";
import AstroSettingsInfo from "@/components/imaging/AstroSettingsInfo";
import { calculateImagingTime } from "@/lib/date_utils";
import {
  updateTelescopeISPSetting,
  getAllTelescopeISPSetting,
} from "@/lib/dwarf_utils";
import { getExposureDefault } from "@/lib/data_utils";
import {
  allowedExposures,
  allowedGains,
  getExposureValueByIndex,
} from "@/lib/data_utils";

type PropTypes = {
  setValidSettings: any;
  validSettings: boolean;
  setShowSettingsMenu: Dispatch<SetStateAction<boolean>>;
};

export default function TakeAstroPhoto(props: PropTypes) {
  const { setValidSettings, setShowSettingsMenu } = props;
  let connectionCtx = useContext(ConnectionContext);
  const [showSettingsInfo, setShowSettingsInfo] = useState(false);

  function defaultValueHandler(settingName: keyof AstroSettings) {
    connectionCtx.setAstroSettings((prev) => {
      delete prev[settingName];
      if (settingName === "gain") {
        delete prev["gainMode"];
      }
      if (settingName === "exposure") {
        delete prev["exposureMode"];
      }
      return { ...prev };
    });
    saveAstroSettingsDb(settingName, undefined);
    if (settingName === "gain") {
      saveAstroSettingsDb("gainMode", undefined);
    }
    if (settingName === "exposure") {
      saveAstroSettingsDb("exposureMode", undefined);
    }
  }

  function changeGainHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    if (targetValue === "default") {
      defaultValueHandler("gain");
      return;
    }

    let value: number;
    let modeValue: number;

    if (targetValue === "auto") {
      modeValue = modeAuto;
      value = 0;
    } else {
      modeValue = modeManual;
      value = Number(targetValue);
    }

    connectionCtx.setAstroSettings((prev) => {
      prev["gainMode"] = modeValue;
      return { ...prev };
    });
    saveAstroSettingsDb("gainMode", modeValue.toString());
    updateTelescopeISPSetting("gainMode", modeValue, connectionCtx);

    setTimeout(() => {
      connectionCtx.setAstroSettings((prev) => {
        if (targetValue === "auto") {
          prev["gain"] = targetValue;
        } else {
          prev["gain"] = value;
        }
        return { ...prev };
      });
      saveAstroSettingsDb("gain", targetValue);
      updateTelescopeISPSetting("gain", value, connectionCtx);
    }, 1000);
  }

  function changeExposureHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    if (targetValue === "default") {
      defaultValueHandler("exposure");
      return;
    }

    let value: number;
    let modeValue: number;

    if (targetValue === "auto") {
      modeValue = modeAuto;
      value = Number(getExposureDefault);
    } else {
      modeValue = modeManual;
      value = Number(targetValue);
    }

    connectionCtx.setAstroSettings((prev) => {
      prev["exposureMode"] = modeValue;
      return { ...prev };
    });
    saveAstroSettingsDb("exposureMode", modeValue.toString());
    updateTelescopeISPSetting("exposureMode", modeValue, connectionCtx);

    // modify Gain to 0 if Old Exposure was Auto and now set to Manual
    if (
      connectionCtx.astroSettings.exposureMode == modeAuto &&
      modeValue == modeManual
    ) {
      connectionCtx.setAstroSettings((prev) => {
        prev["gain"] = 0;
        return { ...prev };
      });
      saveAstroSettingsDb("gain", "0");
      updateTelescopeISPSetting("gain", 0, connectionCtx);
    }

    setTimeout(() => {
      connectionCtx.setAstroSettings((prev) => {
        if (targetValue === "auto") {
          prev["exposure"] = targetValue;
        } else {
          prev["exposure"] = value;
        }
        return { ...prev };
      });
      saveAstroSettingsDb("exposure", targetValue);
      if (targetValue != "auto")
        updateTelescopeISPSetting("exposure", value, connectionCtx);
    }, 500);
  }

  function changeIRHandler(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "default") {
      defaultValueHandler("IR");
      return;
    }

    let value = Number(e.target.value);
    connectionCtx.setAstroSettings((prev) => {
      prev["IR"] = value;
      return { ...prev };
    });
    saveAstroSettingsDb("IR", e.target.value);
    updateTelescopeISPSetting("IR", value, connectionCtx);
  }

  function changeBinningHandler(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "default") {
      defaultValueHandler("binning");
      return;
    }

    let value = Number(e.target.value);
    connectionCtx.setAstroSettings((prev) => {
      prev["binning"] = value;
      return { ...prev };
    });
    saveAstroSettingsDb("binning", e.target.value);
    updateTelescopeISPSetting("binning", value, connectionCtx);
  }

  function changeFileFormatHandler(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "default") {
      defaultValueHandler("fileFormat");
      return;
    }

    let value = Number(e.target.value);
    connectionCtx.setAstroSettings((prev) => {
      prev["fileFormat"] = value;
      return { ...prev };
    });
    saveAstroSettingsDb("fileFormat", e.target.value);
    updateTelescopeISPSetting("fileFormat", value, connectionCtx);
  }

  function changeCountHandler(e: ChangeEvent<HTMLInputElement>) {
    if (Number(e.target.value) < 1) {
      defaultValueHandler("fileFormat");
      return;
    }

    let value = Number(e.target.value);
    connectionCtx.setAstroSettings((prev) => {
      prev["count"] = value;
      return { ...prev };
    });
    saveAstroSettingsDb("count", e.target.value);
    updateTelescopeISPSetting("count", value, connectionCtx);
  }

  function changeQualityHandler(e: ChangeEvent<HTMLInputElement>) {
    if (Number(e.target.value) < 1) {
      defaultValueHandler("quality");
      return;
    }
    if (Number(e.target.value) > 100) {
      e.target.value = "100";
      return;
    }

    let value = Number(e.target.value);
    connectionCtx.setAstroSettings((prev) => {
      prev["quality"] = value;
      return { ...prev };
    });
    saveAstroSettingsDb("quality", e.target.value);
    updateTelescopeISPSetting("quality", value, connectionCtx);
  }

  function setImagingTime(
    count: number | undefined,
    exposure: number | string | undefined
  ) {
    if (typeof exposure === "string") {
      return;
    }

    let data = calculateImagingTime(count, exposure);
    if (data) {
      if (data["hours"]) {
        return `${data["hours"]}h ${data["minutes"]}m ${data["seconds"]}s`;
      } else if (data["minutes"]) {
        return `${data["minutes"]}m ${data["seconds"]}s`;
      } else {
        return `${data["seconds"]}s`;
      }
    }
  }

  function toggleShowSettingsInfo() {
    setShowSettingsInfo(!showSettingsInfo);
  }

  const allowedExposuresOptions = allowedExposures.values.map(
    ({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    )
  );

  const allowedGainsOptions = allowedGains.values.map(({ index, name }) => (
    <option key={index} value={index}>
      {name}
    </option>
  ));

  if (showSettingsInfo) {
    return <AstroSettingsInfo onClick={toggleShowSettingsInfo} />;
  }
  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          gain: connectionCtx.astroSettings.gain,
          exposureMode: connectionCtx.astroSettings.exposureMode,
          exposure: connectionCtx.astroSettings.exposure,
          IR: connectionCtx.astroSettings.IR,
          binning: connectionCtx.astroSettings.binning,
          fileFormat: connectionCtx.astroSettings.fileFormat,
          count: connectionCtx.astroSettings.count || 0,
          rightAscension: connectionCtx.astroSettings.rightAscension,
          declination: connectionCtx.astroSettings.declination,
          quality: connectionCtx.astroSettings.quality,
          target: connectionCtx.astroSettings.target,
          status: connectionCtx.astroSettings.status,
        }}
        validate={(values) => {
          let errors = validateAstroSettings(values);
          if (Object.keys(errors).length === 0) {
            setValidSettings(true);
          } else {
            setValidSettings(false);
          }
          return errors;
        }}
        onSubmit={() => {}}
      >
        {({ values, errors, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="row mb-md-2 mb-sm-1">
              <div className="fs-5 mb-2">
                Camera Settings{" "}
                <i
                  className="bi bi-info-circle"
                  role="button"
                  onClick={toggleShowSettingsInfo}
                ></i>
              </div>

              <div className="col-4">
                <label htmlFor="gain" className="form-label">
                  Gain
                </label>
              </div>
              <div className="col-8">
                <select
                  name="gain"
                  onChange={(e) => {
                    handleChange(e);
                    changeGainHandler(e);
                  }}
                  onBlur={handleBlur}
                  value={values.gain}
                >
                  <option value="default">Select</option>
                  {allowedGainsOptions}
                </select>
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-4">
                <label htmlFor="exposure" className="form-label">
                  Exposure
                </label>
              </div>
              <div className="col-8">
                <select
                  name="exposure"
                  onChange={(e) => {
                    handleChange(e);
                    changeExposureHandler(e);
                  }}
                  onBlur={handleBlur}
                  value={
                    values.exposureMode == modeAuto ? "auto" : values.exposure
                  }
                >
                  <option value="default">Select</option>
                  <option value="auto">Auto</option>
                  {allowedExposuresOptions}
                </select>
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-4">
                <label htmlFor="ir" className="form-label">
                  IR
                </label>
              </div>
              <div className="col-8">
                <select
                  name="IR"
                  onChange={(e) => {
                    handleChange(e);
                    changeIRHandler(e);
                  }}
                  onBlur={handleBlur}
                  value={values.IR}
                >
                  <option value="default">Select</option>
                  <option value="0">Cut</option>
                  <option value="1">Pass</option>
                </select>
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-4">
                <label htmlFor="binning" className="form-label">
                  Binning
                </label>
              </div>
              <div className="col-8">
                <select
                  name="binning"
                  onChange={(e) => {
                    handleChange(e);
                    changeBinningHandler(e);
                  }}
                  onBlur={handleBlur}
                  value={values.binning}
                >
                  <option value="default">Select</option>
                  <option value="0">4k</option>
                  <option value="1">2k</option>
                </select>
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-4">
                <label htmlFor="fileFormat" className="form-label">
                  Format
                </label>
              </div>
              <div className="col-8">
                <select
                  name="fileFormat"
                  onChange={(e) => {
                    handleChange(e);
                    changeFileFormatHandler(e);
                  }}
                  onBlur={handleBlur}
                  value={values.fileFormat}
                >
                  <option value="default">Select</option>
                  <option value="0">FITS</option>
                  <option value="1">TIFF</option>
                </select>
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-4">
                <label htmlFor="count" className="form-label">
                  Count
                </label>
              </div>
              <div className="col-8">
                <input
                  type="number"
                  className="form-control"
                  name="count"
                  max="999"
                  placeholder="1"
                  min="1"
                  onChange={(e) => {
                    handleChange(e);
                    changeCountHandler(e);
                  }}
                  onBlur={handleBlur}
                  value={values.count}
                />
              </div>
              {errors.count && <p className="text-danger">{errors.count}</p>}
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-4">
                <label htmlFor="quality" className="form-label">
                  Quality
                </label>
              </div>
              <div className="col-8">
                <input
                  type="number"
                  className="form-control"
                  name="quality"
                  placeholder="0"
                  min="0"
                  onChange={(e) => {
                    handleChange(e);
                    changeQualityHandler(e);
                  }}
                  onBlur={handleBlur}
                  value={values.quality}
                />
              </div>
              {errors.quality && (
                <p className="text-danger">{errors.quality}</p>
              )}
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-4">Total time</div>
              <div className="col-8">
                {setImagingTime(
                  connectionCtx.astroSettings.count,
                  getExposureValueByIndex(connectionCtx.astroSettings.exposure)
                )}
              </div>
            </div>
            <div className="row mb">
              <div className="col-md-auto">
                <button
                  onClick={() => setShowSettingsMenu(false)}
                  className="btn btn-more02"
                >
                  Close
                </button>
              </div>
              <div className="col-md text-end">
                <button
                  onClick={() => getAllTelescopeISPSetting(connectionCtx)}
                  className="btn btn-more02"
                >
                  Read Values
                </button>
              </div>
            </div>
            {/* {JSON.stringify(values)} */}
          </form>
        )}
      </Formik>
    </div>
  );
}
