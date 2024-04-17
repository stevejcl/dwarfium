import React from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Formik } from "formik";
import {
  allowedIntervalTimeLapse,
  allowedTotalTimeTimeLapse,
} from "@/lib/data_utils";

type PropTypes = {
  intervalIndexValue: number;
  setIntervalIndexValue: Dispatch<SetStateAction<number>>;
  totalTimeIndexValue: number;
  setTotalTimeIndexValue: Dispatch<SetStateAction<number>>;
  setShowSettingsMenu: Dispatch<SetStateAction<boolean>>;
};

export default function CameraPanoSettings(props: PropTypes) {
  const {
    intervalIndexValue,
    setIntervalIndexValue,
    totalTimeIndexValue,
    setTotalTimeIndexValue,
    setShowSettingsMenu,
  } = props;

  function changeIntervalHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    setIntervalIndexValue(parseInt(targetValue, 10));
  }
  function changeTotalTimeHandler(e: ChangeEvent<HTMLSelectElement>) {
    let targetValue = e.target.value;
    setTotalTimeIndexValue(parseInt(targetValue, 10));
  }

  const allowedIntervalTimeLapseOptions = allowedIntervalTimeLapse.values.map(
    ({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    )
  );

  const allowedTotalTimeTimeLapseOptions = allowedTotalTimeTimeLapse.values.map(
    ({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    )
  );

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          interval: String(intervalIndexValue),
          totalTime: String(totalTimeIndexValue),
        }}
        onSubmit={() => {}}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-6">
                <label htmlFor="interval">Interval</label>
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
                  {allowedIntervalTimeLapseOptions}
                </select>
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-6">
                <label htmlFor="totalTime">Total Time</label>
              </div>
              <div className="col-4 me-2">
                <select
                  id="totalTime"
                  name="totalTime"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changeTotalTimeHandler(e);
                  }}
                  value={values.totalTime}
                >
                  {allowedTotalTimeTimeLapseOptions}
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
