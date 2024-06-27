import React, { useState, useEffect } from "react";
import i18n from "@/i18n";
import { useTranslation } from "react-i18next";

const Modal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [fontSize, setFontSize] = useState<number>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const storedFontSize = localStorage.getItem("fontSize");
      return storedFontSize ? parseInt(storedFontSize, 10) : 20;
    }
    return 20;
  });
  const [backgroundImage, setBackgroundImage] = useState<string>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return (
        localStorage.getItem("backgroundImage") ||
        "/backgrounds/bg-bannerpic.jpg"
      );
    }
    return "/backgrounds/bg-bannerpic.jpg";
  });

  const [selectedLanguage, setSelectedLanguage] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("language") || "en";
    }
    return "en";
  });

  const { t } = useTranslation();

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      setSelectedLanguage(storedLanguage);
      i18n.changeLanguage(storedLanguage);
    }
  }, []);

  const languages: { [key: string]: string } = {
    en: "English",
    fr: "Français",
    de: "Deutsch",
    es: "Español",
    it: "Italiano",
    nl: "Nederlands",
    pl: "Polish",
  };

  const availableLanguages = Object.keys(languages);

  const handleImageClick = (imageSrc: string) => {
    setBackgroundImage(imageSrc);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const applyBackground = () => {
    closeModal();
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem("backgroundImage", backgroundImage);
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    setBackgroundImage("/backgrounds/bg-bannerpic.jpg");
    localStorage.removeItem("backgroundImage");
  };

  const increaseFontSize = () => {
    const newSize = fontSize + 1;
    setFontSize(newSize);
  };

  const decreaseFontSize = () => {
    if (fontSize > 1) {
      const newSize = fontSize - 1;
      setFontSize(newSize);
    }
  };

  const resetFontSize = () => {
    const defaultFontSize = 16;
    setFontSize(defaultFontSize);
    localStorage.setItem("fontSize", defaultFontSize.toString());
  };

  const changeLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
      i18n.changeLanguage(lang);
    }
  };

  useEffect(() => {
    document.body.className = `${theme}-theme`;
    document.body.style.backgroundImage = `url(${backgroundImage})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center center";
    document.body.style.backgroundAttachment = "fixed";

    localStorage.setItem("fontSize", fontSize.toString());

    const paragraphs = Array.from(
      document.querySelectorAll("p")
    ) as HTMLElement[];
    const listItems = Array.from(
      document.querySelectorAll("li")
    ) as HTMLLIElement[];
    const headings = Array.from(
      document.querySelectorAll("h1, h2, h3")
    ) as HTMLElement[];
    const boldTexts = Array.from(
      document.querySelectorAll("b")
    ) as HTMLElement[];

    const elements = [...paragraphs, ...listItems, ...headings, ...boldTexts];

    elements.forEach((element: HTMLElement) => {
      element.style.fontSize = `${fontSize}px`;
    });
  }, [theme, backgroundImage, fontSize]);

  return (
    <div className={`modal-wrapper-theme${showModal ? " show" : ""}`}>
      <button
        className="cogwheel-button"
        onClick={() => setShowModal(!showModal)}
      >
        <i className="fas fa-cog"></i>
      </button>

      {showModal && (
        <div className="modal-overlay-theme">
          <div className="modal-content-theme">
            <h2 className="theme-header">{t("cThemeSettingsTitle")}</h2>
            <br />
            <div className="container-bg">
              <div className="row-bg">
                <div
                  className="box"
                  onClick={() =>
                    handleImageClick("/backgrounds/galaxybackground.jpg")
                  }
                >
                  <img src="/backgrounds/galaxybackground.jpg" alt="Image 1" />
                </div>
                <div
                  className="box"
                  onClick={() =>
                    handleImageClick(
                      "/backgrounds/high-resolution-earth_180484.jpg"
                    )
                  }
                >
                  <img
                    src="/backgrounds/high-resolution-earth_180484.jpg"
                    alt="Image 2"
                  />
                </div>
                <div
                  className="box"
                  onClick={() =>
                    handleImageClick("/backgrounds/starbackground.jpg")
                  }
                >
                  <img src="/backgrounds/starbackground.jpg" alt="Image 3" />
                </div>
              </div>
              <div className="row-bg">
                <div
                  className="box"
                  onClick={() =>
                    handleImageClick("/backgrounds/starrybackground.jpg")
                  }
                >
                  <img src="/backgrounds/starrybackground.jpg" alt="Image 4" />
                </div>
                <div
                  className="box"
                  onClick={() =>
                    handleImageClick("/backgrounds/bg-bannerpic.jpg")
                  }
                >
                  <img src="/backgrounds/bg-bannerpic.jpg" alt="Image 5" />
                </div>
                <div
                  className="box"
                  onClick={() => handleImageClick("/backgrounds/stars2.jpg")}
                >
                  <img src="/backgrounds/stars2.jpg" alt="Image 6" />
                </div>
              </div>
            </div>

            <h2 className="theme-header">{t("cThemeSettingsFontSize")}</h2>
            <div className="font-size-options">
              <button className="font-size-button" onClick={increaseFontSize}>
                <i className="fas fa-plus"></i>
              </button>
              <button className="font-size-button" onClick={decreaseFontSize}>
                <i className="fas fa-minus"></i>
              </button>
              <button
                className="font-size-reset-button"
                onClick={resetFontSize}
              >
                <i className="fas fa-sync-alt"></i>
              </button>
            </div>
            <br />
            <h2 className="theme-header">{t("cThemeSettingsColorTheme")}</h2>
            <div className="theme-con">
              <div className="theme-options">
                <button
                  className={`btn btn-more02 ${
                    theme === "light" ? "active" : ""
                  }`}
                  onClick={() => handleThemeChange("light")}
                >
                  {t("cThemeSettingsLightTheme")}
                </button>
                <button
                  className={`btn btn-more02 ${
                    theme === "dark" ? "active" : ""
                  }`}
                  onClick={() => handleThemeChange("dark")}
                >
                  {t("cThemeSettingsDarkTheme")}
                </button>
                <button
                  className={`btn btn-more02 ${
                    theme === "dark" ? "active" : ""
                  }`}
                  onClick={() => handleThemeChange("dark")}
                >
                  {t("cThemeSettingsAstroTheme")}
                  <br />({t("cThemeSettingsUnderconstruction")})
                </button>
              </div>
            </div>
            <br />

            <div className="language-options">
              <h2 className="theme-header">{t("cThemeSettingsLanguage")}</h2>

              <select
                className="language-select"
                value={selectedLanguage}
                onChange={(e) => changeLanguage(e.target.value)}
              >
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang} className="language-option">
                    {languages[lang]}
                  </option>
                ))}
              </select>
            </div>
            <br />
            <button className="apply-button" onClick={applyBackground}>
              {t("cThemeSettingsApply")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
