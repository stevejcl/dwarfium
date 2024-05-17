import React, { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

export default function Nav() {
  const [modalOpen, setModalOpen] = useState(false);
  const [devEnabled, setDevEnabled] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [theme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const devState = localStorage.getItem("devState");
    setDevEnabled(devState === "true");
  }, []);

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

  const handleToggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleDevOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setDevEnabled(isChecked);
    localStorage.setItem("devState", isChecked.toString());
  };

  const handleNavbarToggle = () => {
    setNavbarOpen(!navbarOpen);
  };

  const closeNavbar = () => {
    setNavbarOpen(false);
  };
  useEffect(() => {
    document.body.className = `${theme}-theme`;
  }, [theme]);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <a className="navbar-brand">
            <div
              className={`light-logo ${theme === "light" ? "" : "dark-theme"}`}
            >
              <img src="/DWARFLAB_LOGO_Green.png" alt="Light Logo" />
            </div>
            <div
              className={`dark-logo ${theme === "dark" ? "" : "dark-theme"}`}
            >
              <img src="/DWARFLAB_LOGO_Blue.png" alt="Dark Logo" />
            </div>
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={handleNavbarToggle}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`}
          >
            <ul
              className="navbar-nav me-auto mb-2 mb-lg-0"
              onClick={closeNavbar}
            >
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" href="/">
                  {t("cNavHome")}
                </Link>
              </li>
              <div className="dropdown">
                <button className="dropbtn">
                  DwarfII <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/setup-scope"
                  >
                    {t("cNavSetup")}
                  </Link>
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/objects"
                  >
                    {t("cNavObjects")}
                  </Link>
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/cameras"
                  >
                    {t("cNavCamera")}
                  </Link>
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/image-session"
                  >
                    {t("cNavSessionData")}
                  </Link>
                </div>
              </div>

              <div className="dropdown">
                <button className="dropbtn">
                  {t("cNavWeather")} <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/weather"
                  >
                    {t("cNavWeather")}
                  </Link>
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/clouds"
                  >
                    {t("cNavClouds")}
                  </Link>
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/moonphase"
                  >
                    {t("cNavMoonphases")}
                  </Link>
                </div>
              </div>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  href="/astro-calendar"
                >
                  {t("cNavAstronomyCalendar")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  href="/wit-sensor"
                  style={{ display: devEnabled ? "block" : "none" }}
                >
                  {t("cNavPolarAlignment")}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  href="/about"
                >
                  {t("cNavAbout")}
                </Link>
              </li>
            </ul>
            <div className="d-none d-lg-block">
              <div className="right-menu">
                <ul>
                  <li>
                    <span
                      className="version-text"
                      onClick={handleToggleModal}
                      style={{ cursor: "pointer", zIndex: 1051 }}
                    >
                      Beta Witmotion
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Modal
        dialogClassName="modal-dialog-version"
        show={modalOpen}
        onHide={handleToggleModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="modal-title-version">Beta</div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="modal-body-version">
            <label className="checkbox-container">
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={devEnabled}
                onChange={handleDevOptionChange}
              />
              : Enable Witmotion Sensor
            </label>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
