import Link from "next/link";
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

export default function Nav() {
  const [modalOpen, setModalOpen] = useState(false);
  const [devEnabled, setDevEnabled] = useState(false);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [theme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const devState = localStorage.getItem("devState");
    setDevEnabled(devState === "true");
  }, []);

  const handleToggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleDevOptionChange = (e) => {
    const isChecked = e.target.checked;
    setDevEnabled(isChecked);
    localStorage.setItem("devState", isChecked);
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
                      <div className={`light-logo ${theme === 'light' ? '' : 'dark-theme'}`}>
                          <img src="/DWARFLAB_LOGO_Green.png" alt="Light Logo" />
                      </div>
                      <div className={`dark-logo ${theme === 'dark' ? '' : 'dark-theme'}`}>
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
                  Home
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
                    Setup
                  </Link>
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/objects"
                  >
                    Objects
                  </Link>
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/cameras"
                  >
                    Camera
                  </Link>
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/image-session"
                  >
                    Session-Data
                  </Link>
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/skymap"
                  >
                    SkyMap
                  </Link>
                </div>
              </div>

              <div className="dropdown">
                <button className="dropbtn">
                  Weather <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/weather"
                  >
                    Weather
                  </Link>
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/clouds"
                  >
                    Clouds
                  </Link>
                  <Link
                    className="nav-link active drop"
                    aria-current="page"
                    href="/moonphase"
                  >
                    Moonphases
                  </Link>
                </div>
              </div>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  href="/astro-calendar"
                >
                  Astronomy calendar
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  href="/wit-sensor"
                  style={{ display: devEnabled ? "block" : "none" }}
                >
                  Sensor
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  aria-current="page"
                  href="/about"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
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
