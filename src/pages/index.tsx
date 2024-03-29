export default function Home() {
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
          <h1><u>Dwarf II App</u></h1>
          <br/>
          <p>
            This website allows you to control parts of the Dwarf II using the
            Dwarf API.
          </p>
          <br/>
          <b>Features:</b>
          <ul>
            <li> 1. Object list with over 250 objects.</li>
            <li> 2. Import objects lists from Telescopius.</li>
            <li> 3. Import Mosaic lists from Telescopius.</li>
            <li>
               4. Connect to Stellarium planeterium app to help select targets.
            </li>
            <li> 5. Take Astro photos.</li>
            <li> 6. 1x1 binning for astro photos.</li>
          </ul>
           <br/>
          <p>
            This website and the Dwarf API are in beta phase. The API
            hasn&apos;t been officially released, and the API doesn&apos;t have
            all the features of the mobile app, therefore this app has a very
            limited list of features. Only use this app if you are comfortable
            with being testers for beta software.
          </p>
          <br/>
          <b>Bugs:</b>
          <ul>
            <li>
              Dwarf II&apos;s internal date url does not work in the browser
              because of CORS (http://DWARF_IP:8092/date?date=).
            </li>
            <li>
              To get it working, you need CORS: Access-Control-Allow-Origin
              Plugin on Chrome
            </li>
            <li>
              Restriction : as this website use only http mode to communicate
              with the dwarf, it can not detect your location.
            </li>
          </ul>
        </div>
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
      </section>
    </div>
  );
}
