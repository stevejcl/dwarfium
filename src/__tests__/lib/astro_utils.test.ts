import {
  getRiseSetTime,
  getRiseSetTimeLocal,
  getRiseSetTimePlanet,
  computeRaDecToAltAz,
  computealtAzToHADec,
} from "@/lib/astro_utils";

import { ConvertStrDeg, ConvertStrHours } from "@/lib/math_utils";

import { AstroObject } from "@/types";
import { julian } from "astronomia";

let Vega: AstroObject = {
  dec: "+38°47'01.0\"",
  designation: "Vega",
  displayName: "",
  type: "",
  typeCategory: "",
  ra: "18h36m56.00s",
  magnitude: "",
  catalogue: "",
  objectNumber: 0,
  constellation: "",
  alternateNames: "",
  notes: "",
};
// NYC -4, HK +8
let lat_NYC = 40.7128;
let lon_NYC = -74.006;
let lat_HK = 22.3964;
let lon_HK = 114.1095;
let lat_BUK = 52.5;
let lon_BUK = -1.9166667;

describe("getRiseSetTime", () => {
  // https://github.com/commenthol/astronomia/blob/master/test/rise.test.js
  it("works for example posted in astronomia", () => {
    let object: AstroObject = {
      dec: "+18°26'27.3\"",
      designation: "",
      displayName: "",
      type: "",
      typeCategory: "",
      ra: "2h46m55.51s",
      magnitude: "",
      catalogue: "",
      objectNumber: 0,
      constellation: "",
      alternateNames: "",
      notes: "",
    };
    let expected = {
      rise: {
        hours: 12,
        minutes: 26,
        seconds: 9,
      },
      transit: {
        hours: 19,
        minutes: 40,
        seconds: 17,
      },
      set: {
        hours: 2,
        minutes: 54,
        seconds: 26,
      },
    };
    const jd = julian.CalendarGregorianToJD(1988, 3, 20);
    let res = getRiseSetTime(object, 42.3333, -71.0833, jd);

    expect(res).toEqual(expected);
  });

  it("returns rise and set times for a object with negative longitude", () => {
    let object = Vega;
    let lat = lat_NYC;
    let lon = lon_NYC;
    let expected = {
      rise: {
        hours: 21,
        minutes: 51,
        seconds: 46,
      },
      set: {
        hours: 15,
        minutes: 52,
        seconds: 29,
      },
      transit: {
        hours: 6,
        minutes: 52,
        seconds: 8,
      },
    };

    const jd = julian.CalendarGregorianToJD(2023, 6, 2);
    let res = getRiseSetTime(object, lat, lon, jd);

    expect(res).toEqual(expected);
  });

  it("returns rise and set times for a object with positive longitude", () => {
    let object = Vega;
    let lat = lat_HK;
    let lon = lon_HK;
    let expected = {
      rise: {
        hours: 10,
        minutes: 58,
        seconds: 58,
      },
      set: {
        hours: 1,
        minutes: 40,
        seconds: 22,
      },
      transit: {
        hours: 18,
        minutes: 19,
        seconds: 40,
      },
    };

    const jd = julian.CalendarGregorianToJD(2023, 6, 2);
    let res = getRiseSetTime(object, lat, lon, jd);

    expect(res).toEqual(expected);
  });
});

describe("getRiseSetTimeLocal", () => {
  it("returns local rise and set times for a object with negative longitude", () => {
    let object = Vega;
    let lat = lat_NYC;
    let lon = lon_NYC;
    let timezone = "America/New_York";
    let expected = {
      rise: "4:51 PM",
      set: "10:52 AM",
      transit: "1:52 AM",
    };

    const jd = julian.CalendarGregorianToJD(2023, 6, 2);
    let res = getRiseSetTimeLocal(object, lat, lon, jd, timezone);

    expect(res).toEqual(expected);
  });

  it("returns local rise and set times for a object with positive longitude", () => {
    let object = Vega;
    let lat = lat_HK;
    let lon = lon_HK;
    let timezone = "Asia/Hong_Kong";
    let expected = {
      rise: "6:58 PM",
      set: "9:40 AM",
      transit: "2:19 AM",
    };

    const jd = julian.CalendarGregorianToJD(2023, 6, 2);
    let res = getRiseSetTimeLocal(object, lat, lon, jd, timezone);

    expect(res).toEqual(expected);
  });

  it("returns local rise and set times for daylight savings", () => {
    let object = Vega;
    let lat = lat_NYC;
    let lon = lon_NYC;
    let timezone = "America/New_York";
    let useDaylightSavings = true;
    let expected = {
      rise: "5:51 PM",
      set: "11:52 AM",
      transit: "2:52 AM",
    };

    const jd = julian.CalendarGregorianToJD(2023, 6, 2);
    let res = getRiseSetTimeLocal(
      object,
      lat,
      lon,
      jd,
      timezone,
      useDaylightSavings
    );

    expect(res).toEqual(expected);
  });

  it("returns local rise and set times for 24 hour format", () => {
    let object = Vega;
    let lat = lat_NYC;
    let lon = lon_NYC;
    let timezone = "America/New_York";
    let useDaylightSavings = false;
    let use24Hour = true;
    let expected = {
      rise: "16:51",
      set: "10:52",
      transit: "01:52",
    };

    const jd = julian.CalendarGregorianToJD(2023, 6, 2);
    let res = getRiseSetTimeLocal(
      object,
      lat,
      lon,
      jd,
      timezone,
      useDaylightSavings,
      use24Hour
    );

    expect(res).toEqual(expected);
  });
});

describe("getRiseSetTimePlanet", () => {
  it("returns rise and set times for a given planet", () => {
    const date = new Date(0);
    date.setUTCFullYear(1988);
    date.setUTCMonth(3 - 1);
    date.setUTCDate(20);
    let object: AstroObject = {
      designation: "Venus",
      dec: "",
      displayName: "",
      type: "",
      typeCategory: "",
      ra: "",
      magnitude: "",
      catalogue: "",
      objectNumber: 0,
      constellation: "",
      alternateNames: "",
      notes: "",
    };
    let expected = {
      rise: { hours: 12, minutes: 26, seconds: 9 },
      transit: { hours: 19, minutes: 40, seconds: 17 },
      set: { hours: 2, minutes: 54, seconds: 25 },
    };

    let res = getRiseSetTimePlanet(object, 42.333333, -71.083333, date);
    expect(res).toEqual(expected);
  });
});

describe("computeRaDecToAltAz", () => {
  it("returns alt Az data for a given RA and Dec", () => {
    let lat = 48.8604;
    let lon = -2.3416;
    let ra = 155.74407; // 10.382938 * 15;
    let dec = 249.382988;
    let date = new Date("2023-09-03T11:48:00.000Z").toISOString();
    let expected = {
      alt: -65.21173910755353,
      az: 23.872691425100033,
      lst: 126.9358037863104,
      H: -28.808266213689613,
    };
    // Alt:-065° 12' 42.26"
    // Az: +023° 52' 21.69"

    let res = computeRaDecToAltAz(lat, lon, ra, dec, date, "Europe/Paris");

    expect(res).toEqual(expected);
  });
});

describe("computeRaDecToAltAz2", () => {
  it("returns alt Az data for a given RA and Dec", () => {
    let lat = lat_BUK;
    let lon = lon_BUK;
    let ra = 250.425; //16.695 * 15;
    let dec = 36.466667;
    let date = new Date("1998-08-10T23:10:00.000Z").toISOString();
    let expected = {
      alt: 66.59556592349702,
      az: 236.426219940173,
      lst: 274.72590996099535,
      H: 24.300909960995305,
    };
    // Alt:+066° 35' 44.04"
    // Az: +236° 25' 34.39"

    let res = computeRaDecToAltAz(lat, lon, ra, dec, date, "Europe/London");

    expect(res).toEqual(expected);
  });
});

describe("computeRaDecToAltAz3", () => {
  it("returns alt Az data for a given RA and Dec", () => {
    let lat = lat_NYC;
    let lon = lon_NYC;
    let ra = 250.43;
    let dec = 36.462;
    let date = new Date("2023-07-02T00:00:00.000Z").toISOString();
    let expected = {
      alt: 33.2365033470588,
      az: 68.06958033581921,
      lst: 175.69100956021043,
      H: -74.73899043978955,
    };

    let res = computeRaDecToAltAz(lat, lon, ra, dec, date, "America/New_York");

    expect(res).toEqual(expected);
  });
});

describe("computealtAzToHADec", () => {
  it("returns Ra and Dec data for a given lat, alt, Az end lst", () => {
    let lat = lat_NYC;
    let lon = lon_NYC;
    let alt = 33.2365033470588;
    let az = 68.06958033581921;
    let date = new Date("2023-07-02T00:00:00.000Z").toISOString();

    let expected = {
      ra: 250.43,
      dec: 36.46200000000001,
      lst: 175.69100956021043,
      H: -74.73899043978955,
    };

    let res = computealtAzToHADec(lat, lon, alt, az, date, "America/New_York");

    expect(res).toEqual(expected);
  });
});

describe("computeRaDecToAltAz4", () => {
  it("returns alt Az data for a given RA and Dec", () => {
    let lat = 47.3289982886079;
    let lon = -1.69547918589427;
    let ra = 18.615638666 * 15; //279,23457999; //18h 36m 56.3
    let dec = 38.783692; //+38° 47' 01.29
    let date = new Date("2023-09-15T18:27:00.000Z").toISOString();
    let expected = {
      alt: 60.05001962489055,
      az: 91.81046846830218,
      lst: 239.43279957904966,
      H: -39.80178041095034,
    };

    let res = computeRaDecToAltAz(lat, lon, ra, dec, date, "Europe/Paris");
    console.log("alt:" + ConvertStrDeg(res.alt));
    console.log("az:" + ConvertStrDeg(res.az));

    expect(res).toEqual(expected);
  });
});

describe("computealtAzToHADec4", () => {
  it("returns Ra and Dec data for a given lat, alt, Az end lst", () => {
    let lat = 47.3289982886079;
    let lon = -1.69547918589427;
    let alt = 60.05001962489055;
    let az = 91.81046846830218;
    let date = new Date("2023-09-15T18:27:00.000Z").toISOString();

    let expected = {
      ra: 279.23457999,
      dec: 38.783692,
      lst: 239.43279957904966,
      H: -39.80178041095034,
    };

    let res = computealtAzToHADec(lat, lon, alt, az, date, "Europe/Paris");
    console.log("RA:" + ConvertStrHours(res.ra / 15));
    console.log("DEC:" + ConvertStrDeg(res.dec));

    expect(res).toEqual(expected);
  });
});
