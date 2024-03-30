import Link from "next/link";

export default function About() {
  return (
    <div>
      <section className="daily-horp-userlist d-inline-block w-100">
        <div className="container">
          {" "}
          <br />
          <br />
          <br />
          <br />
          <br />
          <h1><u>About</u></h1>
          <br/>
          <p>
            The project is made by Wai-Yin Kwan with the help of JC LESAINT This
            website is a side project to combine their interest in coding,
            astronomy and the Dwarf II API. To report bugs or view the original
            code, visit his{" "}
                      <Link href="https://github.com/DwarfTelescopeUsers/dwarfii-stellarium-goto" target="_blank">
              Github repo.
            </Link>
          </p><br/>
          <h2><u>Data Credits</u></h2>
          <p>The data for the objects lists comes from several sources.</p>
          <ul>
            <li>
              The data about the DSO comes from{" "}
                          <Link href="https://github.com/mattiaverga/OpenNGC" target="_blank">
                OpenNGC objects database
              </Link>
              .
            </li>
            <li>
              Dr Michael Camilleri, Auckland Astronomical Society, New Zealand
              provided object names and sizes for the DSO that are 15 arc
              minutes or larger.
            </li>
            <li>
              The data about the stars comes from{" "}
                          <Link href="https://github.com/astronexus/HYG-Database" target="_blank">
                HYG Stellar database
              </Link>
              .
            </li>
            <li>
              The data about the visual magnitude of planets and Moon comes from{" "}
                          <Link href="https://en.wikipedia.org/wiki/Apparent_magnitude" target="_blank">
                Wikipedia.
              </Link>
            </li>
            <li>
              The constellation data comes from{" "}
                          <Link href="https://en.wikipedia.org/wiki/IAU_designated_constellations" target="_blank">
                Wikipedia.
              </Link>
            </li>
          </ul>
          <p>
            The{" "}
                      <Link href="https://github.com/DwarfTelescopeUsers/dwarfii-stellarium-goto/tree/main/notebooks" target="_blank">
              Jupyter notebooks
            </Link>{" "}
            in the Github repo shows the steps I took transform the raw data
            into the objects lists.
          </p>
          <p>
            This site use code from{" "}
                      <Link href="https://github.com/commenthol/astronomia" target="_blank">
              Astronomia
            </Link>{" "}
            and{" "}
                      <Link href="https://www.celestialprogramming.com" target="_blank">
              celestialprogramming.com
            </Link>{" "}
            to do the astronomical calculations.
          </p><br/>
          <h2><u>User Data</u></h2>
          <p>
            The info entered in by the users is stored in the browser&apos;s
            database (localStorage). Since the data is stored in your browser,
            other users of the site will not be able to access your data. This
            also means if a user uses multiple browsers or devices, the data can
            not be synced between the different browsers or devices.
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
        </div>{" "}
      </section>
    </div>
  );
}
