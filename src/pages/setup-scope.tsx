import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useEffect, useState } from "react";
import ConnectDwarfSTA from "@/components/setup/ConnectDwarfSTA";
import ConnectDwarf from "@/components/setup/ConnectDwarf";
import ConnectStellarium from "@/components/setup/ConnectStellarium";
import SetLocation from "@/components/setup/SetLocation";
import { useSetupConnection } from "@/hooks/useSetupConnection";
import StatusBar from "@/components/shared/StatusBar";
import { useLoadIntialValues } from "@/hooks/useLoadIntialValues";

export default function SetupScope() {
  useSetupConnection();
  useLoadIntialValues();
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
        <br /> <br /> <br /> <br />
        <StatusBar />
        <hr></hr>
        <h2>{t("pFirstSteps")}</h2>
        <p>{t("pFirstStepsContent")}.
        </p>
        <hr></hr>
        <SetLocation />
        <hr />
        <ConnectDwarfSTA />
        <hr />
        <ConnectDwarf />
        <hr />
        <ConnectStellarium />
      </div>
      <br />
      <br />
      <br />
      <br />
    </section>
  );
}
