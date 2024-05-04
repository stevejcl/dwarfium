import Link from "next/link";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/i18n";

export default function About() {
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
          <br />
          <br />
          <br />
          <br />
          <br />
          <h2>
            <u>{t("pAbout")}</u>
          </h2>
          <br />
          <p>
            {t("pAboutInfo")}{" "}
            <Link
              href="https://github.com/DwarfTelescopeUsers/dwarfii-stellarium-goto"
              target="_blank"
            >
              Github repo.
            </Link>
          </p>
          <br />
          <h2>
            <u>{t("pAboutDataCredit")}</u>
          </h2>
          <ul>
            <li>{t("pAboutDataCreditInfo")}</li>
            <li>
              {t("pAboutDataCreditDSO")}{" "}
              <Link
                href="https://github.com/mattiaverga/OpenNGC"
                target="_blank"
              >
                OpenNGC objects database
              </Link>
              .
            </li>
            <li>{t("pAboutDataCreditDSOAuth")}</li>
            <li>
              {t("pAboutDataCreditDSOStars")}{" "}
              <Link
                href="https://github.com/astronexus/HYG-Database"
                target="_blank"
              >
                HYG Stellar database
              </Link>
              .
            </li>
            <li>
              {t("pAboutDataCreditVisual")}{" "}
              <Link
                href="https://en.wikipedia.org/wiki/Apparent_magnitude"
                target="_blank"
              >
                Wikipedia.
              </Link>
            </li>
            <li>
              {t("pAboutDataCreditConstellationData")}{" "}
              <Link
                href="https://en.wikipedia.org/wiki/IAU_designated_constellations"
                target="_blank"
              >
                Wikipedia.
              </Link>
            </li>
            <li>
              {t("pAboutDataCreditJuypterThe")}{" "}
              <Link
                href="https://github.com/DwarfTelescopeUsers/dwarfii-stellarium-goto/tree/main/notebooks"
                target="_blank"
              >
                Jupyter notebooks
              </Link>{" "}
              {t("pAboutDataCreditJuypterText")}
            </li>
            <li>
              {t("pAboutDataCreditCode")}{" "}
              <Link
                href="https://github.com/commenthol/astronomia"
                target="_blank"
              >
                Astronomia
              </Link>{" "}
              and{" "}
              <Link href="https://www.celestialprogramming.com" target="_blank">
                celestialprogramming.com
              </Link>{" "}
              to perform astronomical calculations.
            </li>
          </ul>
          <br />
          <h2>
            <u>{t("pAboutUserData")}</u>
          </h2>
          <p>{t("pAboutUserDataDesc")}</p>
          <br />
          <h2>
            <u>{t("pAboutAdditional")}</u>
          </h2>
          <p>
            {t("pAboutAdditionalWeatherData")}{" "}
            <Link href="https://openweathermap.org/" target="_blank">
              OpenWeather
            </Link>
            .
          </p>
          <p>
            {t("pAboutAdditionalRSSData")}{" "}
            <Link
              href="https://in-the-sky.org/rss.php?feed=deepsky"
              target="_blank"
            >
              in-the-sky.org
            </Link>
            .
          </p>
          <p>
            {t("pAboutAdditionalWitmotion")}{" "}
            <Link
              href="https://github.com/LiDline/witmotion_wt901blecl_ts"
              target="_blank"
            >
              LiDLine Node integration
            </Link>
            .
          </p>
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
        </div>{" "}
      </section>
    </div>
  );
}
