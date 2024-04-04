import React, { useEffect } from "react";

export default function SkyMap() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("aladin-lite").then((A) => {
        A.default.init.then(() => {
          // eslint-disable-next-line no-unused-vars
          let aladin = A.default.aladin("#aladin-lite-div", {
            target: "M42",
            fov: 3,
            projection: "AIT",
            cooFrame: "equatorial",
            showCooGridControl: true,
            showSimbadPointerControl: true,
            showCooGrid: true,
          });
        });
      });
    }
  }, []);

  return (
    <section className="daily-horp d-inline-block w-100">
      <div
        className="container"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <div
          id="aladin-lite-div"
          style={{ width: "800px", height: "800px", marginTop: "100px" }}
        ></div>
      </div>
    </section>
  );
}
