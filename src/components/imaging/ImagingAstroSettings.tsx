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
  telephotoCamera,
  wideangleCamera,
  updateTelescopeISPSetting,
  getAllTelescopeISPSetting,
} from "@/lib/dwarf_utils";
import { getExposureDefault } from "@/lib/data_utils";
import {
  allowedExposures,
  allowedGains,
  getExposureValueByIndex,
  allowedIRs,
} from "@/lib/data_utils";
import { getWideExposureDefault } from "@/lib/data_wide_utils";
import { allowedWideExposures, allowedWideGains } from "@/lib/data_wide_utils";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import i18n from "@/i18n";

type PropTypes = {
  setValidSettings: any;
  validSettings: boolean;
  setShowSettingsMenu: Dispatch<SetStateAction<boolean>>;
};

export default function TakeAstroPhoto(props: PropTypes) {
  const { setValidSettings, setShowSettingsMenu } = props;
  let connectionCtx = useContext(ConnectionContext);
  const [showSettingsInfo, setShowSettingsInfo] = useState(false);
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, []);

  function defaultValueHandler(settingName: keyof AstroSettings) {
    connectionCtx.setAstroSettings((prev) => {
      delete prev[settingName];
      if (settingName === "gain") {
        delete prev["gainMode"];
      }
      if (settingName === "exposure") {
        delete prev["exposureMode"];
      }
      if (settingName === "wideExposure") {
        delete prev["wideExposureMode"];
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
    if (settingName === "wideExposure") {
      saveAstroSettingsDb("wideExposureMode", undefined);
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
      value = Number(getExposureDefault(connectionCtx.typeIdDwarf));
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

  function changeAiEnhanceHandler(e: ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "default") {
      defaultValueHandler("AiEnhance");
      return;
    }

    let value = Number(e.target.value);
    connectionCtx.setAstroSettings((prev) => {
      prev["AiEnhance"] = value;
      return { ...prev };
    });
    saveAstroSettingsDb("AiEnhance", e.target.value);
    updateTelescopeISPSetting("AiEnhance", value, connectionCtx);
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

  function changeWideGainHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    if (targetValue === "default") {
      defaultValueHandler("wideGain");
      return;
    }

    let value = Number(targetValue);

    setTimeout(() => {
      connectionCtx.setAstroSettings((prev) => {
        prev["wideGain"] = value;
        return { ...prev };
      });
      saveAstroSettingsDb("wideGain", targetValue);
      updateTelescopeISPSetting("wideGain", value, connectionCtx);
    }, 1000);
  }

  function changeWideExposureHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    if (targetValue === "default") {
      defaultValueHandler("wideExposure");
      return;
    }

    let value: number;
    let modeValue: number;

    if (targetValue === "auto") {
      modeValue = modeAuto;
      value = Number(getWideExposureDefault(connectionCtx.typeIdDwarf));
    } else {
      modeValue = modeManual;
      value = Number(targetValue);
    }

    connectionCtx.setAstroSettings((prev) => {
      prev["wideExposureMode"] = modeValue;
      return { ...prev };
    });
    saveAstroSettingsDb("wideExposureMode", modeValue.toString());
    updateTelescopeISPSetting("wideExposureMode", modeValue, connectionCtx);

    setTimeout(() => {
      connectionCtx.setAstroSettings((prev) => {
        if (targetValue === "auto") {
          prev["wideExposure"] = targetValue;
        } else {
          prev["wideExposure"] = value;
        }
        return { ...prev };
      });
      saveAstroSettingsDb("wideExposure", targetValue);
      if (targetValue != "auto")
        updateTelescopeISPSetting("wideExposure", value, connectionCtx);
    }, 500);
  }

  function toggleShowSettingsInfo() {
    setShowSettingsInfo(!showSettingsInfo);
  }

  // Function to generate options for a specific Dwarf model
  const generateExposureOptions = (DwarfModelId = 1) => {
    const exposures = allowedExposures[DwarfModelId];
    return exposures.values.map(({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    ));
  };
  const allowedExposuresOptions = generateExposureOptions(
    connectionCtx.typeIdDwarf
  ); //DwarfModelId

  const generateGainOptions = (DwarfModelId = 1) => {
    const gains = allowedGains[DwarfModelId];
    return gains.values.map(({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    ));
  };
  const allowedGainsOptions = generateGainOptions(connectionCtx.typeIdDwarf); //DwarfModelId

  const generateIROptions = (DwarfModelId = 1) => {
    const iR = allowedIRs[DwarfModelId];
    return iR.values.map(({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    ));
  };
  const allowedIROptions = generateIROptions(connectionCtx.typeIdDwarf); //DwarfModelId

  // Function to generate options for a specific Dwarf model
  const generateWideExposureOptions = (DwarfModelId = 1) => {
    const exposures = allowedWideExposures[DwarfModelId];
    return exposures.values.map(({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    ));
  };
  const allowedWideExposuresOptions = generateWideExposureOptions(
    connectionCtx.typeIdDwarf
  ); //DwarfModelId

  const generateWideGainOptions = (DwarfModelId = 1) => {
    const gains = allowedWideGains[DwarfModelId];
    return gains.values.map(({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    ));
  };
  const allowedWideGainsOptions = generateWideGainOptions(
    connectionCtx.typeIdDwarf
  ); //DwarfModelId

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
          AiEnhance: connectionCtx.astroSettings.AiEnhance,
          target: connectionCtx.astroSettings.target,
          status: connectionCtx.astroSettings.status,
          wideGain: connectionCtx.astroSettings.wideGain,
          wideExposureMode: connectionCtx.astroSettings.wideExposureMode,
          wideExposure: connectionCtx.astroSettings.wideExposure,
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
            {connectionCtx.currentAstroCamera == telephotoCamera && (
              <div className="row mb-md-2 mb-sm-1">
                <div className="fs-5 mb-2">
                  {t("cAstroSettings")}{" "}
                  <i
                    className="bi bi-info-circle"
                    role="button"
                    onClick={toggleShowSettingsInfo}
                  ></i>
                </div>
              </div>
            )}
            {connectionCtx.currentAstroCamera == wideangleCamera && (
              <div className="row mb-md-2 mb-sm-1">
                <div className="fs-5 mb-2">
                  {t("cAstroSettingsWide")}{" "}
                  <i
                    className="bi bi-info-circle"
                    role="button"
                    onClick={toggleShowSettingsInfo}
                  ></i>
                </div>
              </div>
            )}
            {connectionCtx.currentAstroCamera == telephotoCamera && (
              <div>
                <div className="row mb-md-2 mb-sm-1">
                  <div className="col-4">
                    <label htmlFor="gain" className="form-label">
                      {t("cAstroSettingsGain")}{" "}
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
                      <option value="default">
                        {t("cAstroSettingsSelect")}
                      </option>
                      {allowedGainsOptions}
                    </select>
                  </div>
                </div>
                <div className="row mb-md-2 mb-sm-1">
                  <div className="col-4">
                    <label htmlFor="exposure" className="form-label">
                      {t("cAstroSettingsExposure")}{" "}
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
                        values.exposureMode == modeAuto
                          ? "auto"
                          : values.exposure
                      }
                    >
                      <option value="default">
                        {t("cAstroSettingsSelect")}
                      </option>
                      <option value="auto">Auto</option>
                      {allowedExposuresOptions}
                    </select>
                  </div>
                </div>
                <div className="row mb-md-2 mb-sm-1">
                  <div className="col-4">
                    <label htmlFor="ir" className="form-label">
                      {t("cAstroSettingsIR")}{" "}
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
                      {allowedIROptions}
                    </select>
                  </div>
                </div>
                <div className="row mb-md-2 mb-sm-1">
                  <div className="col-4">
                    <label htmlFor="binning" className="form-label">
                      {t("cAstroSettingsBinning")}{" "}
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
                      <option value="default">
                        {t("cAstroSettingsSelect")}
                      </option>
                      <option value="0">4k</option>
                      <option value="1">2k</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
            {connectionCtx.currentAstroCamera == wideangleCamera && (
              <div>
                <div className="row mb-md-2 mb-sm-1">
                  <div className="col-4">
                    <label htmlFor="gain" className="form-label">
                      {t("cAstroSettingsWideGain")}{" "}
                    </label>
                  </div>
                  <div className="col-8">
                    <select
                      name="wideGain"
                      onChange={(e) => {
                        handleChange(e);
                        changeWideGainHandler(e);
                      }}
                      onBlur={handleBlur}
                      value={values.wideGain}
                    >
                      <option value="default">
                        {t("cAstroSettingsSelect")}
                      </option>
                      {allowedWideGainsOptions}
                    </select>
                  </div>
                </div>
                <div className="row mb-md-2 mb-sm-1">
                  <div className="col-4">
                    <label htmlFor="wideExposure" className="form-label">
                      {t("cAstroSettingsWideExposure")}{" "}
                    </label>
                  </div>
                  <div className="col-8">
                    <select
                      name="wideExposure"
                      onChange={(e) => {
                        handleChange(e);
                        changeWideExposureHandler(e);
                      }}
                      onBlur={handleBlur}
                      value={
                        values.wideExposureMode == modeAuto
                          ? "auto"
                          : values.wideExposure
                      }
                    >
                      <option value="default">
                        {t("cAstroSettingsSelect")}
                      </option>
                      <option value="auto">Auto</option>
                      {allowedWideExposuresOptions}
                    </select>
                  </div>
                </div>
              </div>
            )}
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-4">
                <label htmlFor="fileFormat" className="form-label">
                  {t("cAstroSettingsFormat")}{" "}
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
                  <option value="default">{t("cAstroSettingsSelect")}</option>
                  <option value="0">FITS</option>
                  <option value="1">TIFF</option>
                </select>
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-4">
                <label htmlFor="AiEnhance" className="form-label">
                  {t("cAstroSettingsAIEnhance")}{" "}
                </label>
              </div>
              <div className="col-8">
                <select
                  name="AiEnhance"
                  onChange={(e) => {
                    handleChange(e);
                    changeAiEnhanceHandler(e);
                  }}
                  onBlur={handleBlur}
                  value={values.AiEnhance}
                >
                  <option value="default">{t("cAstroSettingsSelect")}</option>
                  <option value="0">{t("cAstroSettingsAIEnhanceOFF")}</option>
                  <option value="1">{t("cAstroSettingsAIEnhanceON")}</option>
                </select>
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-4">
                <label htmlFor="count" className="form-label">
                  {t("cAstroSettingsCount")}{" "}
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
            {connectionCtx.typeNameDwarf == "Dwarf II" && (
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
                    max="100"
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
            )}
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-4">Total time</div>
              <div className="col-8">
                {setImagingTime(
                  connectionCtx.astroSettings.count,
                  getExposureValueByIndex(
                    connectionCtx.astroSettings.exposure,
                    connectionCtx.typeIdDwarf
                  )
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
