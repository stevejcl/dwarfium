import Grid2 from "@mui/material/Unstable_Grid2";
import { Inner } from "@/components/witmotion/Inner";
import { ApplicationProvider } from "@/components/witmotion/ApplicationProvider";
import { Application } from "@/lib/witmotion/Application";

export default function WitSensorData() {
  const application = new Application();

  return (
    <section className="daily-horp d-inline-block w-100">
      <div className="container">
        <ApplicationProvider application={application}>
          <div className="witsensor">
            <div className="witimage">
              <img src="/images/witmotion.png" alt="WitMotion" />
            </div>
            <Grid2 container spacing={2}>
              <Inner />
            </Grid2>
          </div>
              </ApplicationProvider>
              {""}
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
              <br />
      </div>
    </section>
  );
}
