import styles from "@/components/imaging/AstroSettingsInfo.module.css";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import i18n from "@/i18n";

type PropTypes = {
  onClick: any;
};

export default function AstroSettingsInfo(props: PropTypes) {
  const { onClick } = props;

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
    <div className={styles.settings}>
      <div className="fs-5 mb-2" role="button" onClick={onClick}>
        <i className="bi bi-arrow-left-circle"></i>{" "}
        {t("cAstroSettingsInfoBack")}
      </div>
      <dl>
        <dt>{t("cAstroSettingsInfoGain")}</dt>
        <dd>{t("cAstroSettingsInfoGainDesc")}</dd>
        <dt>{t("cAstroSettingsInfoExposure")}</dt>
        <dd>{t("cAstroSettingsInfoExposureDesc")}</dd>
        <dt>{t("cAstroSettingsInfoIRPass")}</dt>
        <dd>{t("cAstroSettingsInfoIRPassDesc")}</dd>
        <dt>{t("cAstroSettingsInfoIRCut")}</dt>
        <dd>{t("cAstroSettingsInfoIRCutDesc")}</dd>
        <dt>{t("cAstroSettingsInfoBin1x1")}</dt>
        <dd>{t("cAstroSettingsInfoBin1x1Desc")}</dd>
        <dt>{t("cAstroSettingsInfoBin2x2")}</dt>
        <dd>{t("cAstroSettingsInfoBin2x2Desc")}</dd>
        <dt>{t("cAstroSettingsInfoFormatFITS")}</dt>
        <dd>{t("cAstroSettingsInfoFormatFITSDesc")}</dd>
        <dt>{t("cAstroSettingsInfoFormatTIFF")}</dt>
        <dd>{t("cAstroSettingsInfoFormatTIFFDesc")}</dd>
        <dt>{t("cAstroSettingsInfoAIEnhance")}</dt>
        <dd>{t("cAstroSettingsInfoAIEnhanceDesc")}</dd>
        <dt>{t("cAstroSettingsInfoQuality")}</dt>
        <dd>{t("cAstroSettingsInfoQualityDesc")}</dd>
        <dt>{t("cAstroSettingsInfoCount")}</dt>
        <dd>{t("cAstroSettingsInfoCountDesc")}</dd>
      </dl>
    </div>
  );
}
