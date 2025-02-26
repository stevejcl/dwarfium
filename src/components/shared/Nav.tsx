import React, { useState, useEffect } from "react";
import Link from "next/link";

import { useTranslation } from "react-i18next";

export default function Nav() {
    const [navbarOpen, setNavbarOpen] = useState(false);
    const [theme] = useState<"light" | "dark">("light");
    const [devState, setDevState] = useState(false);
    const [objectsOpen, setObjectsOpen] = useState(false);
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
        setObjectsOpen(false);
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light">
                <div className="container">
                    <a className="navbar-brand">
                        <div className={`light-logo ${theme === "light" ? "" : "dark-theme"}`}>
                            <img src="/DWARFLAB_LOGO_Green.png" alt="Light Logo" />
                        </div>
                        <div className={`dark-logo ${theme === "dark" ? "" : "dark-theme"}`}>
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

                    <div className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`}>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0" onClick={closeNavbar}>
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" href="/">
                                    {t("cNavHome")}
                                </Link>
                            </li>

                            <div className="dropdown">
                                <button className="dropbtn">
                                    Dwarf <i className="fa fa-caret-down"></i>
                                </button>
                                <div className="dropdown-content">
                                    <Link className="nav-link active drop" href="/setup-scope">
                                        {t("cNavSetup")}
                                    </Link>
                                    {/* Nieuw Objects submenu */}
                                    <div className="dropdown" onMouseEnter={() => setObjectsOpen(true)} onMouseLeave={() => setObjectsOpen(false)}>
                                        <Link className="nav-link active drop" href="/objects">
                                            {t("cNavObjects")} <i className="fa fa-caret-right"></i>
                                        </Link>
                                        {objectsOpen && (
                                            <div className="dropdown-content sub-menu">
                                                <Link className="nav-link active drop" href="/mozaikplanner">
                                                    Mozaïekplanner
                                                </Link>
                                                <Link className="nav-link active drop" href="/observatieplanner">
                                                    Observatieplanner
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    <Link className="nav-link active drop" href="/cameras">
                                        {t("cNavCamera")}
                                    </Link>
                                    <Link className="nav-link active drop" href="/image-session">
                                        {t("cNavSessionData")}
                                    </Link>
                                </div>
                            </div>

                            <div className="dropdown">
                                <button className="dropbtn">
                                    {t("cNavWeather")} <i className="fa fa-caret-down"></i>
                                </button>
                                <div className="dropdown-content">
                                    <Link className="nav-link active drop" href="/weather">
                                        {t("cNavWeather")}
                                    </Link>
                                    <Link className="nav-link active drop" href="/clouds">
                                        {t("cNavClouds")}
                                    </Link>
                                    <Link className="nav-link active drop" href="/moonphase">
                                        {t("cNavMoonphases")}
                                    </Link>
                                </div>
                            </div>

                            <li className="nav-item">
                                <Link className="nav-link active" href="/astro-calendar">
                                    {t("cNavAstronomyCalendar")}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" href="/polar-alignment" style={{ display: devState ? "block" : "block" }}>
                                    {t("cNavPolarAlignment")}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active" href="/about">
                                    {t("cNavAbout")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <a
                        href="https://github.com/stevejcl/dwarfium"
                        className="github-corner"
                        aria-label="View source on GitHub"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            width="60"
                            height="60"
                            viewBox="0 0 250 250"
                            style={{
                                fill: "#FD6C6C",
                                color: "#fff",
                                position: "absolute",
                                top: 0,
                                border: 0,
                                right: 0,
                            }}
                            aria-hidden="true"
                        >
                            <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
                            <path
                                d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
                                fill="currentColor"
                                style={{ transformOrigin: "130px 106px" }}
                                className="octo-arm"
                            ></path>
                            <path
                                d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
                                fill="currentColor"
                                className="octo-body"
                            ></path>
                        </svg>
                    </a>
                </div>
            </nav>
        </>
    );
}
