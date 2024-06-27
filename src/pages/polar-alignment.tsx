import Grid2 from "@mui/material/Unstable_Grid2";
import { Inner } from "@/components/witmotion/Inner";
import { ApplicationProvider } from "@/components/witmotion/ApplicationProvider";
import { Application } from "@/lib/witmotion/Application";
//import PolarAlign from "@/components/shared/PolarAlign";
import DwarfCameras from "@/components/DwarfCameras";
//import ConnectDwarfII from "@/components/setup/ConnectDwarfII";
import { useEffect, useState } from "react";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

export default function WitSensorData() {
  const application = new Application();
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
      </div>
      <div className="polar-align-wit">
              {/*<PolarAlign />
        <ConnectDwarfII />*/}
      </div>
      <Grid2 container spacing={3}>
        <Grid2 md={6} xs={12} className="camera-container">
          <div className="camera-witmotion">
                      {/*<h3>{t("cWitmotionCamera")}</h3>*/}
                      <main className="camera-con">
                          
              <DwarfCameras
                showWideangle={false}
                useRawPreviewURL={false}
                showControls={false}
              />
              
            </main>
          </div>
        </Grid2>
        <Grid2 md={4} xs={12} sm={12} className="altitude-description-wit">
          <div className="camera-witmotion-content">
            <p>{t("cWitmotionPolaris1")}</p>
            <p>{t("cWitmotionPolaris2")}</p>
          </div>
        </Grid2>
      </Grid2>
      {""}
      <br />
      <br />
      <br />
    </section>
  );
}
