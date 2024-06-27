import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Nav() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [theme] = useState<"light" | "dark">("light");
  const [devState, setDevState] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const devState = localStorage.getItem("devState");
    if (devState !== null) {
      setDevState(devState === "true");
    }
  }, []);

  const handleNavbarToggle = () => {
    setNavbarOpen(!navbarOpen);
  };

  const closeNavbar = () => {
    setNavbarOpen(false);
  };

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
                    href="/polar-alignment"
                    style={{ display: devState ? "block" : "none" }}
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
          </div>
        </div>
      </nav>
    </>
  );
}
