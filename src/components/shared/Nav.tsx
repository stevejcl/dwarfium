import Link from "next/link";

import React, { useState } from "react";

export default function Nav() {
  const [modalOpen, setModalOpen] = useState(false);
  const versionNumber = "2.1.1";

  const handleToggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <a className="navbar-brand">
            <img alt="logo" src="/DWARFLAB_LOGO_Green.png" />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarSupportedContent"
            data-toggle="collapse"
            data-bs-target="#navbarSupportedContent.show"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
                    href="/construction"
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
                    Version
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Version modal */}
      <div
        className={`modal-version fade${modalOpen ? " show" : ""}`}
        id="versionModal"
        tabIndex={0}
        data-bs-backdrop="false"
      >
        <div className="modal-dialog-version">
          <div className="modal-content-version">
            <div className="modal-header">
              <h5 className="modal-title-version">Version</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal-version"
                aria-label="Close"
                onClick={handleToggleModal}
              ></button>
            </div>
            <div className="modal-body-version">
              <p>Version Number: {versionNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
