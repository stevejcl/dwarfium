import React from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Formik } from "formik";
import { useContext } from "react";
import { ConnectionContext } from "@/stores/ConnectionContext";
import { allowedCountBurst, allowedIntervalBurst } from "@/lib/data_utils";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/i18n";

type PropTypes = {
  countValue: number;
  setCountValue: Dispatch<SetStateAction<number>>;
  intervalValue: number;
  setIntervalValue: Dispatch<SetStateAction<number>>;
  setShowSettingsMenu: Dispatch<SetStateAction<boolean>>;
};

export default function CameraPanoSettings(props: PropTypes) {
  let connectionCtx = useContext(ConnectionContext);
  const {
    countValue,
    setCountValue,
    intervalValue,
    setIntervalValue,
    setShowSettingsMenu,
  } = props;

  function changeCountHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    setCountValue(parseInt(targetValue, 10));
  }

  function changeIntervalHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    setIntervalValue(parseInt(targetValue, 10));
  }

  // Function to generate options for a specific Dwarf model
  const generateCountBurstOptions = (DwarfModelId = 1) => {
    const countBurst = allowedCountBurst[DwarfModelId];
    return countBurst.values.map(({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    ));
  };
  const allowedCountBurstOptions = generateCountBurstOptions(
    connectionCtx.typeIdDwarf
  ); //DwarfModelId

  // Function to generate options for a specific Dwarf model
  const generateIntervalBurstOptions = (DwarfModelId = 1) => {
    const intervalBurst = allowedIntervalBurst[DwarfModelId];
    return intervalBurst.values.map(({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    ));
  };
  const allowedIntervalBurstOptions = generateIntervalBurstOptions(
    connectionCtx.typeIdDwarf
  ); //DwarfModelId

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

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          count: String(countValue),
          interval: String(intervalValue),
        }}
        onSubmit={() => {}}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-6">
                <label htmlFor="count">{t("cCameraBurstSettingsCount")}</label>
              </div>
              <div className="col-4 me-2">
                <select
                  id="count"
                  name="count"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changeCountHandler(e);
                  }}
                  value={values.count}
                >
                  {allowedCountBurstOptions}
                </select>
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-6">
                <label htmlFor="interval">
                  {t("cCameraBurstSettingsinterval")}
                </label>
              </div>
              <div className="col-4 me-2">
                <select
                  id="interval"
                  name="interval"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changeIntervalHandler(e);
                  }}
                  value={values.interval}
                >
                  {allowedIntervalBurstOptions}
                </select>
              </div>
            </div>
            <div>
              <button
                onClick={() => setShowSettingsMenu(false)}
                className="btn btn-more02"
              >
                Close
              </button>
            </div>
            {/* {JSON.stringify(values)} */}
          </form>
        )}
      </Formik>
    </div>
  );
}
