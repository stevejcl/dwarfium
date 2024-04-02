import Link from "next/link";

export default function Nav() {
  return (
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

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
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
              </div>
            </div>

            {/* <div className="dropdownmega">
              <button className="dropbtnmega">
                Stellarium <i className="fa fa-caret-down"></i>
              </button>
              <div className="dropdownmega-content">
                <div className="rowmega">
                  <div className="columnmega">
                    <h3 className="class1">Category 1</h3>
                    <Link
                      className="nav-link active drop"
                      aria-current="page"
                      href="/"
                    >
                      Link
                    </Link>
                    <Link
                      className="nav-link active drop"
                      aria-current="page"
                      href="/"
                    >
                      Link
                    </Link>
                    <Link
                      className="nav-link active drop"
                      aria-current="page"
                      href="/"
                    >
                      Link
                    </Link>
                  </div>
                  <div className="columnmega">
                    <h3 className="class1">Category 2</h3>
                    <Link
                      className="nav-link active drop"
                      aria-current="page"
                      href="/"
                    >
                      Link
                    </Link>
                    <Link
                      className="nav-link active drop"
                      aria-current="page"
                      href="/"
                    >
                      Link
                    </Link>
                    <Link
                      className="nav-link active drop"
                      aria-current="page"
                      href="/"
                    >
                      Link
                    </Link>
                  </div>
                  <div className="columnmega">
                    <h3 className="class1">Category 3</h3>
                    <Link
                      className="nav-link active drop"
                      aria-current="page"
                      href="/"
                    >
                      Link
                    </Link>
                    <Link
                      className="nav-link active drop"
                      aria-current="page"
                      href="/"
                    >
                      Link
                    </Link>
                    <Link
                      className="nav-link active drop"
                      aria-current="page"
                      href="/"
                    >
                      Link
                    </Link>
                  </div>
                </div>
              </div>
            </div> */}

            <div className="dropdown">
              <button className="dropbtn">
                Weather <i className="fa fa-caret-down"></i>
              </button>
              <div className="dropdown-content">
                <Link
                  className="nav-link active drop"
                  aria-current="page"
                  href="/construction"
                >
                  Forecast
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
            {/*<ul>
              <li>
                <a
                  data-bs-toggle="modal"
                  href="#registerModal"
                  className="btn consult-btn"
                >
                  {" "}
                  Modal popup{" "}
                </a>
              </li>
            </ul>*/}
          </div>
        </div>
      </div>
    </nav>
  );
}
