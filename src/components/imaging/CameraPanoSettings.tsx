import React from "react";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Formik } from "formik";

type PropTypes = {
  colValue: number;
  setColValue: Dispatch<SetStateAction<number>>;
  rowValue: number;
  setRowValue: Dispatch<SetStateAction<number>>;
  setShowSettingsMenu: Dispatch<SetStateAction<boolean>>;
};

export default function CameraPanoSettings(props: PropTypes) {
  const { colValue, setColValue, rowValue, setRowValue, setShowSettingsMenu } =
    props;

  function changeRowHandler(e: ChangeEvent<HTMLInputElement>) {
    let targetValue = parseInt(e.target.value, 10);
    if (targetValue < 3) {
      targetValue = 3;
    } else if (targetValue > 30) {
      targetValue = 30;
    }

    e.target.value = targetValue.toString();
    setRowValue(targetValue);
  }
  function changeColHandler(e: ChangeEvent<HTMLInputElement>) {
    let targetValue = parseInt(e.target.value, 10);
    if (targetValue < 3) {
      targetValue = 3;
    } else if (targetValue > 30) {
      targetValue = 30;
    }

    e.target.value = targetValue.toString();
    setColValue(targetValue);
  }

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          row: String(rowValue),
          col: String(colValue),
        }}
        onSubmit={() => {}}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-4">
                <label htmlFor="row">Row</label>
              </div>
              <div className="col-2 me-2">
                <input
                  id="row"
                  name="row"
                  type="number"
                  min="3"
                  max="30"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changeRowHandler(e);
                  }}
                  value={values.row}
                />
              </div>
            </div>
            <div className="row mb-md-2 mb-sm-1">
              <div className="col-4">
                <label htmlFor="col">Col</label>
              </div>
              <div className="col-2 me-2">
                <input
                  id="col"
                  name="col"
                  type="number"
                  min="3"
                  max="30"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    handleChange(e);
                    changeColHandler(e);
                  }}
                  value={values.col}
                />
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
