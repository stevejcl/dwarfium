import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/i18n";

export default function Home() {
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
      <section className="daily-horp d-inline-block w-100">
        <div className="container">
          {" "}
          <br />
          <br />
          <br />
          <br />
          <h1>
            <b>
              <u>Dwarfium</u>
            </b>
          </h1>
          <br />
          <p>{t("pIndexDescription")}.</p>
          <br />
          <b>{t("pIndexFeature")}:</b>
          <ul>
            <li> {t("pIndexFeature1")} </li>
            <li> {t("pIndexFeature2")} </li>
            <li> {t("pIndexFeature3")} </li>
            <li> {t("pIndexFeature4")} </li>
            <li> {t("pIndexFeature5")} </li>
            <li> {t("pIndexFeature6")} </li>
          </ul>
          <br />
          <p> {t("pIndexClaimer")} </p>
          <br />
          <b> {t("pIndexBugsHeader")} </b>
          <ul>
            <li> {t("pIndexBug1")} </li>
            <li> {t("pIndexBug2")} </li>
            <li> {t("pIndexBug3")} </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
