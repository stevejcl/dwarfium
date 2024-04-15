import { useSetupConnection } from "@/hooks/useSetupConnection";
import { useLoadIntialValues } from "@/hooks/useLoadIntialValues";

export default function AstroCalendar() {
  useSetupConnection();
  useLoadIntialValues();

  return (
    <section className="daily-horp d-inline-block w-100">
      <div className="container">
        <br />
        <br />
        <br />
        <br />
        <div className="comon-heading text-center">
          <h2 className="comon-heading mt-2 mb-3">
            {" "}
            Astronomy Calendar of Celestial Events
          </h2>
          <h1 className="text-white sub-heading mt-2 mb-3">
            {" "}
            Calendar Year 2024{" "}
          </h1>
        </div>

        <ul
          className="nav nav-pills mb-3 mt-5 justify-content-center"
          role="tablist"
        >
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              data-bs-toggle="pill"
              data-bs-target="#pills-hop01"
              type="button"
              role="tab"
              aria-selected="false"
            >
              {" "}
              Meteor Shower
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              data-bs-toggle="pill"
              data-bs-target="#pills-hop02"
              type="button"
              role="tab"
              aria-selected="false"
            >
              Conjunction{" "}
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link "
              data-bs-toggle="pill"
              data-bs-target="#pills-hop03"
              type="button"
              role="tab"
              aria-selected="true"
            >
              Planetary Event{" "}
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              data-bs-toggle="pill"
              data-bs-target="#pills-hop04"
              type="button"
              role="tab"
              aria-selected="true"
            >
              Astronomy Event{" "}
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              data-bs-toggle="pill"
              data-bs-target="#pills-hop05"
              type="button"
              role="tab"
              aria-selected="true"
            >
              Solar Event{" "}
            </button>
          </li>
        </ul>
        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade active show"
            id="pills-hop01"
            role="tabpanel"
          >
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="meteor-shower" src="/images/meteor-shower.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    {" "}
                    <span> Quadrantids Meteor Shower </span>{" "}
                    <span>January 3, 4</span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    The Quadrantids is an above average shower, with up to 40
                    meteors per hour at its peak. The shower runs annually from
                    January 1-5.
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="meteor-shower" src="/images/meteor-shower.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    {" "}
                    <span> Lyrids Meteor Shower </span>{" "}
                    <span>April 22, 23</span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    The Lyrids is an average shower, usually producing about 20
                    meteors per hour at its peak. It peaks this year on the
                    night of the night of the 22nd and morning of the 23rd.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
            <div className="comin-divu-main d-grid align-content-center">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="meteor-shower" src="/images/meteor-shower.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    {" "}
                    <span> Eta Aquarids Meteor Shower </span>{" "}
                    <span>May 6, 7</span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    The Eta Aquarids is an above average shower, capable of 60
                    meteors per hour at its peak.The shower runs annually from
                    April 19 to May 28. It peaks this year on the night of May 6
                    and the morning of the May 7. The nearly new moon means dark
                    skies for what should be an excellent show this year.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="pills-hop02" role="tabpanel">
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="conjunction" src="/images/conjunction.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    {" "}
                    <span> Lorem Ipsum </span> <span>Date</span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industrys
                    standard dummy text ever since the 1500s, when an unknown.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="conjunction" src="/images/conjunction.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    {" "}
                    <span> Lorem Ipsum </span> <span>Date</span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industrys
                    standard dummy text ever since the 1500s, when an unknown.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="conjunction" src="/images/conjunction.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    {" "}
                    <span> Lorem Ipsum </span> <span>Date</span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industrys
                    standard dummy text ever since the 1500s, when an unknown.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="pills-hop03" role="tabpanel">
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="planets" src="/images/planets.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    {" "}
                    <span> Mercury at Greatest Western Elongation </span>{" "}
                    <span>January 12</span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    The planet Mercury reaches greatest western elongation of
                    23.5 degrees from the Sun. This is the best time to view
                    Mercury since it will be at its highest point above the
                    horizon in the morning sky. Look for the planet low in the
                    eastern sky just before sunrise.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="planets" src="/images/planets.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    <span> Mercury at Greatest Eastern Elongation </span>{" "}
                    <span>March 24</span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    The planet Mercury reaches greatest eastern elongation of
                    18.7 degrees from the Sun. This is the best time to view
                    Mercury since it will be at its highest point above the
                    horizon in the evening sky. Look for the planet low in the
                    western sky just after sunset.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="planets" src="/images/planets.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    {" "}
                    <span> Mercury at Greatest Western Elongation </span>{" "}
                    <span>May 9</span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    The planet Mercury reaches greatest western elongation of
                    26.4 degrees from the Sun. This is the best time to view
                    Mercury since it will be at its highest point above the
                    horizon in the morning sky. Look for the planet low in the
                    eastern sky just before sunrise.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="pills-hop04" role="tabpanel">
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="astronomy" src="/images/astronomy.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    {" "}
                    <span> Lorem Ipsum </span> <span>Date</span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industrys
                    standard dummy text ever since the 1500s, when an unknown.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="astronomy" src="/images/astronomy.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    <span> Lorem Ipsum </span> <span>Date</span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industrys
                    standard dummy text ever since the 1500s, when an unknown.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="astronomy" src="/images/astronomy.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    {" "}
                    <span> Lorem Ipsum </span> <span>Date</span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industrys
                    standard dummy text ever since the 1500s, when an unknown.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="tab-pane fade" id="pills-hop05" role="tabpanel">
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="sun" src="/images/sun-events.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    {" "}
                    <span> March Equinox </span> <span>March 20 </span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    The March equinox occurs at 03:01 UTC. The Sun will shine
                    directly on the equator and there will be nearly equal
                    amounts of day and night throughout the world. This is also
                    the first day of spring (vernal equinox) in the Northern
                    Hemisphere and the first day of fall (autumnal equinox) in
                    the Southern Hemisphere.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="sun" src="/images/sun-events.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    <span> June Solstice </span> <span>June 20</span>{" "}
                  </h5>
                  <p className="mt-2">
                    {" "}
                    The June solstice occurs at 20:46 UTC. The North Pole of the
                    earth will be tilted toward the Sun, which will have reached
                    its northernmost position in the sky and will be directly
                    over the Tropic of Cancer at 23.44 degrees north latitude.
                    This is the first day of summer (summer solstice) in the
                    Northern Hemisphere and the first day of winter (winter
                    solstice) in the Southern Hemisphere.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="sun" src="/images/sun-events.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    {" "}
                    <span> September Equinox </span> <span>September 22</span>{" "}
                  </h5>
                  <p className="mt-2">
                    The September equinox occurs at 12:39 UTC. The Sun will
                    shine directly on the equator and there will be nearly equal
                    amounts of day and night throughout the world. This is also
                    the first day of fall (autumnal equinox) in the Northern
                    Hemisphere and the first day of spring (vernal equinox) in
                    the Southern Hemisphere.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
            <div className="comin-divu-main d-grid align-content-center w-100">
              <div className="row align-items-center">
                <div className="col-lg-2">
                  <figure className="mx-auto mb-lg-0">
                    <img alt="sun" src="/images/sun-events.png" />
                  </figure>
                </div>
                <div className="col-lg-10">
                  <h5 className="text-white">
                    {" "}
                    <span> December Solstice </span> <span>December 21</span>{" "}
                  </h5>
                  <p className="mt-2">
                    The December solstice occurs at 09:17 UTC. The South Pole of
                    the earth will be tilted toward the Sun, which will have
                    reached its southernmost position in the sky and will be
                    directly over the Tropic of Capricorn at 23.44 degrees south
                    latitude. This is the first day of winter (winter solstice)
                    in the Northern Hemisphere and the first day of summer
                    (summer solstice) in the Southern Hemisphere.{" "}
                  </p>
                  <a href="#" className="btn btn-more mt-2">
                    {" "}
                    Read more..
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
