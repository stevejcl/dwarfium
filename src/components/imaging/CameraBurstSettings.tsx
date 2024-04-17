import React from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Formik } from "formik";
import { allowedCountBurst, allowedIntervalBurst } from "@/lib/data_utils";

type PropTypes = {
  countValue: number;
  setCountValue: Dispatch<SetStateAction<number>>;
  intervalValue: number;
  setIntervalValue: Dispatch<SetStateAction<number>>;
  setShowSettingsMenu: Dispatch<SetStateAction<boolean>>;
};

export default function CameraPanoSettings(props: PropTypes) {
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

  const allowedCountBurstOptions = allowedCountBurst.values.map(
    ({ index, name }) => (
      <option key={index} value={index}>
        {name}
      </option>
    )
  );

  const allowedIntervalBurstOptions = allowedIntervalBurst.values.map(
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
          count: String(countValue),
          interval: String(intervalValue),
        }}
        onSubmit={() => {}}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-6">
                <label htmlFor="count">Count</label>
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
