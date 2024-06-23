import vsop87Bearth from "astronomia/data/vsop87Bearth";
import vsop87Bjupiter from "astronomia/data/vsop87Bjupiter";
import vsop87Bmars from "astronomia/data/vsop87Bmars";
import vsop87Bmercury from "astronomia/data/vsop87Bmercury";
import vsop87Bneptune from "astronomia/data/vsop87Bneptune";
import vsop87Bsaturn from "astronomia/data/vsop87Bsaturn";
import vsop87Buranus from "astronomia/data/vsop87Buranus";
import vsop87Bvenus from "astronomia/data/vsop87Bvenus";
import { julian } from "astronomia";
var SunCalc = require("suncalc");

import {
  globe,
  rise,
  sunrise,
  sidereal,
  sexagesimal as sexa,
  planetposition,
} from "astronomia";

const { Sunrise } = sunrise;

import { AstroObject } from "@/types";
import { extractHMSValues, extractDMSValues } from "@/lib/math_utils";
import { isDstObserved } from "@/lib/date_utils";
import { padNumber } from "@/lib/math_utils";

type RiseSetTransit = {
  rise: TimeParts | null;
  set: TimeParts | null;
  transit: TimeParts | null;
};

type RiseSetTransitLocalTime = {
  rise: string | null;
  set: string | null;
  transit: string | null;
};

type TimeParts = {
  hours: number;
  minutes: number;
  seconds: number;
};

function notLocalPlanet(object: AstroObject) {
  return object.typeCategory !== "moon_planets";
}

export function getRiseSetTime(
  object: AstroObject,
  lat: number,
  lon: number,
  jd: number
): RiseSetTransit | undefined {
  if (object.ra === null) {
    return;
  }
  if (object.dec === null) {
    return;
  }

  const coord = {
    lat: new sexa.Angle(...sexa.degToDMS(lat)),
    lon: new sexa.Angle(...sexa.degToDMS(lon * -1)),
  };
  const h0 = rise.stdh0Stellar();

  let raParts = extractHMSValues(object.ra);
  const α = new sexa.RA(raParts?.hour, raParts?.minute, raParts?.second).rad();

  let decParts = extractDMSValues(object.dec);
  const δ = new sexa.Angle(
    decParts?.negative,
    decParts?.degree,
    decParts?.minute,
    decParts?.second
  ).rad();

  const p = new globe.Coord(coord.lat.rad(), coord.lon.rad());
  const Th0 = sidereal.apparent0UT(jd);
  const rs = rise.approxTimes(p, h0, Th0, α, δ);

  setVisibility(
    object,
    createDateFromTime(rs.rise),
    createDateFromTime(rs.set)
  );

  return {
    rise: formatTimeParts(rs.rise),
    transit: formatTimeParts(rs.transit),
    set: formatTimeParts(rs.set),
  };
}

function formatTimeParts(date: any): TimeParts {
  let time = new sexa.Time(date).toHMS();
  return {
    hours: time[1],
    minutes: time[2],
    seconds: Math.round(time[3]),
  };
}

function createDateFromTime(date: any) {
  // Create a new Date object with the current date
  const currentDate = new Date();

  let time = new sexa.Time(date).toHMS();

  // Set the time components (hours, minutes, seconds) of the Date object
  currentDate.setHours(time[1]);
  currentDate.setMinutes(time[2]);
  currentDate.setSeconds(Math.round(time[3]));
  currentDate.setMilliseconds(0); // Reset milliseconds to zero

  // Return the Date object
  return currentDate;
}

function compareTime(date1, date2) {
  const hour1 = date1.getUTCHours();
  const minute1 = date1.getUTCMinutes();
  const second1 = date1.getUTCSeconds();

  const hour2 = date2.getUTCHours();
  const minute2 = date2.getUTCMinutes();
  const second2 = date2.getUTCSeconds();

  if (hour1 === hour2 && minute1 === minute2 && second1 === second2) {
    return 0; // Hours are equal
  } else if (
    hour1 > hour2 ||
    (hour1 === hour2 && minute1 > minute2) ||
    (hour1 === hour2 && minute1 === minute2 && second1 > second2)
  ) {
    return 1; // date1 is later than date2
  } else {
    return -1; // date1 is earlier than date2
  }
}

function setVisibility(object, date_rise, date_set) {
  // check visibility
  let currentDate = new Date();

  if (date_rise === null && date_set === null) return;

  if (date_rise === null && compareTime(currentDate, date_set) < 1) {
    object.visible = true;
    return;
  }

  if (date_set === null && compareTime(date_rise, currentDate) < 1) {
    object.visible = true;
    return;
  }
  if (
    compareTime(date_rise, currentDate) < 1 &&
    compareTime(currentDate, date_set) < 1
  ) {
    object.visible = true;
    return;
  }

  object.visible = false;

  return;
}

export function getRiseSetTimePlanet(
  object: AstroObject,
  lat: number,
  lon: number,
  date: Date
): RiseSetTransit {
  let planetData: any = {};
  switch (object.designation) {
    case "Jupiter":
      planetData = vsop87Bjupiter;
      break;
    case "Mars":
      planetData = vsop87Bmars;
      break;
    case "Mercury":
      planetData = vsop87Bmercury;
      break;
    case "Neptune":
      planetData = vsop87Bneptune;
      break;
    case "Saturn":
      planetData = vsop87Bsaturn;
      break;
    case "Uranus":
      planetData = vsop87Buranus;
      break;
    case "Venus":
      planetData = vsop87Bvenus;
      break;
    default:
      planetData = vsop87Bvenus;
      break;
  }

  let return_data;

  if (object.designation == "Sun") {
    const sun_data = new Sunrise(new julian.Calendar(date), lat, lon * -1);
    setVisibility(object, sun_data.rise().toDate(), sun_data.set().toDate());

    return_data = {
      rise: formatTimePartsPlanet(sun_data.rise().toDate()),
      transit: formatTimePartsPlanet(sun_data.noon().toDate()),
      set: formatTimePartsPlanet(sun_data.set().toDate()),
    };
  } else if (object.designation == "Moon") {
    const rs = SunCalc.getMoonTimes(date, lat, lon, false);

    if (rs.alwaysUp) throw new Error("always above horizon");
    if (rs.alwaysDown) throw new Error("always below horizon");

    setVisibility(object, rs.rise, rs.set);

    return_data = {
      rise: rs.rise !== null ? formatTimePartsPlanet(rs.rise) : null,
      transit: null,
      set: rs.set !== null ? formatTimePartsPlanet(rs.set) : null,
    };
  } else {
    const earth = new planetposition.Planet(vsop87Bearth);
    const targetPlanet = new planetposition.Planet(planetData);

    const rs = new rise.PlanetRise(date, lat, lon * -1, earth, targetPlanet, {
      date: true,
    }).approxTimes();

    setVisibility(object, rs.rise, rs.set);

    return_data = {
      rise: formatTimePartsPlanet(rs.rise),
      transit: formatTimePartsPlanet(rs.transit),
      set: formatTimePartsPlanet(rs.set),
    };
  }

  return return_data;
}

function formatTimePartsPlanet(date: Date): TimeParts {
  return {
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
    seconds: date.getUTCSeconds(),
  };
}

export function getRiseSetTimeLocal(
  object: AstroObject,
  lat: number,
  lon: number,
  jd: number,
  timezone: string,
  useDaylightSavings = false,
  use24Hour = false
): RiseSetTransitLocalTime {
  let results: RiseSetTransitLocalTime = {
    rise: null,
    set: null,
    transit: null,
  };
  let tmp = {} as RiseSetTransit;

  if (notLocalPlanet(object)) {
    let timesObject = getRiseSetTime(object, lat, lon, jd);
    if (timesObject) {
      tmp = timesObject;
    }
  } else {
    let date = new Date();
    tmp = getRiseSetTimePlanet(object, lat, lon, date);
  }

  if (tmp.rise !== null) {
    results.rise = convertTimePartsToString(
      tmp.rise,
      timezone,
      useDaylightSavings,
      use24Hour
    );
  }
  if (tmp.transit !== null) {
    results.transit = convertTimePartsToString(
      tmp.transit,
      timezone,
      useDaylightSavings,
      use24Hour
    );
  }
  if (tmp.set !== null) {
    results.set = convertTimePartsToString(
      tmp.set,
      timezone,
      useDaylightSavings,
      use24Hour
    );
  }

  return results;
}

export function convertTimePartsToString(
  timeParts: TimeParts,
  timezone: string,
  useDaylightSavings: boolean,
  use24Hour: boolean
): string {
  if (useDaylightSavings) {
    timeParts.hours += 1;
  }
  let hour = padNumber(timeParts.hours);
  let minute = padNumber(timeParts.minutes);
  // HACK: 60 seconds will cause invalid date error. Set 60 seconds to 59
  // to avoid invalid date and avoid incrementing minute and hour.
  let second = padNumber(timeParts.seconds === 60 ? 59 : timeParts.seconds);

  // control only for today
  if (parseInt(hour, 10) >= 24) {
    return "-";
  }
  // convert utc time to local time for a given timezone
  let options: any = {
    timeZone: timezone,
    year: undefined,
    month: undefined,
    day: undefined,
    hour: "numeric",
    minute: "numeric",
    hour12: !use24Hour,
  };

  let formatter = new Intl.DateTimeFormat([], options);
  let utc = new Date(`2001-02-03T${hour}:${minute}:${second}.000Z`);
  return formatter.format(utc);
}

export function renderLocalRiseSetTime(
  object: AstroObject,
  latitude: number,
  longitude: number
) {
  // TODO: add component to let user set the time and save time in context
  let date = new Date();
  let jd = julian.CalendarGregorianToJD(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
  let timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let timesObject = { rise: "--", set: "--", error: null };
  let useDaylightSavings = isDstObserved(date);

  try {
    let result = getRiseSetTimeLocal(
      object,
      latitude,
      longitude,
      jd,
      timezone,
      useDaylightSavings
    );
    if (result.rise) {
      timesObject.rise = result.rise;
    }
    if (result.set) {
      timesObject.set = result.set;
    }
  } catch (err: any) {
    if (err.message === "always above horizon") {
      timesObject.error = err.message;
      object.visible = true;
    } else if (err.message === "always below horizon") {
      timesObject.error = err.message;
      object.visible = false;
    } else {
      console.error("err", err);
    }
  }

  return timesObject;
}

// Unit : Deg for alt and az, Hours for lst and H
type AltAsData = {
  alt: number;
  az: number;
  lst: number;
  H: number;
};

type RaDecHData = {
  ra: number;
  dec: number;
  lst: number;
  H: number;
};

function earthRotationAngle(jd: number) {
  //IERS Technical Note No. 32

  const t = jd - 2451545.0;
  const f = jd % 1.0;

  let theta = 2 * Math.PI * (f + 0.779057273264 + 0.00273781191135448 * t); //eq 14
  theta %= 2 * Math.PI;
  if (theta < 0) theta += 2 * Math.PI;

  return theta;
}

function greenwichMeanSiderealTime(jd: number): number {
  //"Expressions for IAU 2000 precession quantities" N. Capitaine1,P.T.Wallace2, and J. Chapront
  const t = (jd - 2451545.0) / 36525.0;

  let gmst =
    earthRotationAngle(jd) +
    (((0.014506 +
      4612.156534 * t +
      1.3915817 * t * t -
      0.00000044 * t * t * t -
      0.000029956 * t * t * t * t -
      0.0000000368 * t * t * t * t * t) /
      60.0 /
      60.0) *
      Math.PI) /
      180.0; //eq 42
  gmst %= 2 * Math.PI;
  if (gmst < 0) gmst += 2 * Math.PI;

  return gmst;
}

function localSiderealTime(jd: number, lon: number): number {
  //Meeus 13.5 and 13.6, modified so West longitudes are negative and 0 is North
  const gmst = greenwichMeanSiderealTime(jd);
  let localSiderealTime = (gmst + lon) % (2 * Math.PI);

  return localSiderealTime;
}

function calc_jd(date: string, timeZone: string = "") {
  let now = new Date(date);
  let offsetTimeZone = 0;

  console.debug("DATE: " + now.toString());

  if (timeZone) {
    let timeZoneLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.debug("timeZoneLocal: " + timeZoneLocal);

    // Get Offset TimeZone
    let d = new Date();

    let a = d
      .toLocaleString("en-US", {
        timeZone: timeZoneLocal,
        timeZoneName: "short",
      })
      .split(/GMT/g)[1];
    console.debug("time a :" + a);
    let b = d
      .toLocaleString("en-US", {
        timeZone: timeZone,
        timeZoneName: "short",
      })
      .split(/GMT/g)[1];
    console.debug("time b :" + b);
    let offsetTimeZone = Number(b) - Number(a);
    console.debug("Offset: " + offsetTimeZone);
  }

  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  const day = now.getUTCDate();
  const hours = now.getUTCHours() + offsetTimeZone;
  const minutes = now.getUTCMinutes();
  const seconds = now.getUTCSeconds();
  const milliseconds = now.getUTCMilliseconds();

  console.debug("year: " + year);
  console.debug("month: " + month);
  console.debug("day: " + day);
  console.debug("hours: " + hours);
  console.debug("minutes: " + minutes);
  console.debug("seconds: " + seconds);

  const now_UTC = new Date(
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    milliseconds
  );

  let jd_ut = julian.DateToJD(now_UTC);

  console.debug(jd_ut); // -> '2456617.949335'
  console.debug(julian.JDToDate(jd_ut));

  return jd_ut;
}

//All input and output angles are in radians, jd is Julian Date in UTC
function raDecToAltAz(
  ra: number,
  dec: number,
  lat: number,
  lon: number,
  jd_ut: number
): AltAsData {
  let lst = localSiderealTime(jd_ut, lon);

  let H = lst - ra;
  if (H < 0) {
    H += 2 * Math.PI;
  }
  if (H > Math.PI) {
    H = H - 2 * Math.PI;
  }

  let az = Math.atan2(
    Math.sin(H),
    Math.cos(H) * Math.sin(lat) - Math.tan(dec) * Math.cos(lat)
  );
  let a = Math.asin(
    Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(H)
  );
  az -= Math.PI;

  if (az < 0) {
    az += 2 * Math.PI;
  }
  return { alt: a, az: az, lst: lst, H: H };
}

//Greg Miller (gmiller@gregmiller.net) 2021
//Released as public domain
//http://www.celestialprogramming.com/

// Return Unit : Deg
export function computeRaDecToAltAz(
  lat: number,
  lon: number,
  raDecimal: number,
  decDecimal: number,
  date: string,
  timeZone: string = ""
): AltAsData {
  let jd_ut = calc_jd(date, timeZone);

  // convert to RAD

  let toRad = Math.PI / 180;

  let ra_rad = raDecimal * toRad;
  let dec_rad = decDecimal * toRad;
  let lat_rad = lat * toRad;
  let lon_rad = lon * toRad;

  let data_rad = raDecToAltAz(ra_rad, dec_rad, lat_rad, lon_rad, jd_ut);

  // convert to DEG
  let toDeg = 180 / Math.PI;

  let data: AltAsData = {
    alt: data_rad.alt * toDeg,
    az: data_rad.az * toDeg,
    lst: data_rad.lst * toDeg,
    H: data_rad.H * toDeg,
  };
  console.debug(data.alt);
  console.debug(data.az);
  console.debug(data.lst);
  console.debug(data.H);

  return data;
}

//Greg Miller (gmiller@gregmiller.net) 2022
//Released as public domain
//www.celestialprogramming.com

//Converts Alt/Az to Hour Angle and Declination
//Modified from Meeus so that 0 Az is North
//All angles are in radians
function altAzToHADec(
  alt: number,
  az: number,
  lat: number,
  lon: number,
  jd_ut: number
) {
  let lst = localSiderealTime(jd_ut, lon);

  let H = Math.atan2(
    -Math.sin(az),
    Math.tan(alt) * Math.cos(lat) - Math.cos(az) * Math.sin(lat)
  );

  console.debug("H1 rad: " + H);

  if (H < 0) {
    H += Math.PI * 2;
  }

  if (H > Math.PI) {
    H = H - 2 * Math.PI;
  }
  console.debug("H2 rad: " + H);

  let ra = lst - H;
  console.debug("raH rad: " + ra);
  if (ra < 0) {
    ra = ra + 2 * Math.PI;
  }
  if (ra > 2 * Math.PI) {
    ra = ra - 2 * Math.PI;
  }

  const dec = Math.asin(
    Math.sin(lat) * Math.sin(alt) + Math.cos(lat) * Math.cos(alt) * Math.cos(az)
  );

  let data: RaDecHData = {
    ra: ra,
    dec: dec,
    lst: lst,
    H: H,
  };

  return data;
}

// Return Unit : Deg
export function computealtAzToHADec(
  lat: number,
  lon: number,
  alt: number,
  az: number,
  date: string,
  timeZone: string = ""
): RaDecHData {
  let jd_ut = calc_jd(date, timeZone);

  // convert to RAD
  let toRad = Math.PI / 180;

  let lat_rad = lat * toRad;
  let lon_rad = lon * toRad;
  let alt_rad = alt * toRad;
  let az_rad = az * toRad;

  let data_rad = altAzToHADec(alt_rad, az_rad, lat_rad, lon_rad, jd_ut);

  // convert to DEG
  let toDeg = 180 / Math.PI;

  let data: RaDecHData = {
    ra: data_rad.ra * toDeg,
    dec: data_rad.dec * toDeg,
    lst: data_rad.lst * toDeg,
    H: data_rad.H * toDeg,
  };

  console.debug(data.ra);
  console.debug(data.dec);
  console.debug(data.lst);
  console.debug(data.H);

  return data;
}

// Old functions
// https://stackoverflow.com/a/14779469
// get difference for local timezone and with day-light saving awareness.
function diffDays(date1: Date, date2: Date): number {
  var utc1 = Date.UTC(
    date1.getFullYear(),
    date1.getMonth(),
    date1.getDate(),
    date1.getHours(),
    date1.getMinutes(),
    date1.getSeconds(),
    date1.getMilliseconds()
  );
  var utc2 = Date.UTC(
    date2.getFullYear(),
    date2.getMonth(),
    date2.getDate(),
    date2.getHours(),
    date2.getMinutes(),
    date2.getSeconds(),
    date2.getMilliseconds()
  );

  return (utc1 - utc2) / 86400000;
}

export function computeRaDecToAltAzOld(
  lat: number,
  lon: number,
  raDecimal: number,
  decDecimal: number,
  date: Date
) {
  // https://www.cloudynights.com/topic/446389-alt-az-calculator-spreadsheet/
  // http://www.stargazing.net/kepler/altaz.html

  let toRad = Math.PI / 180;

  function calculateLST(longitudeDecimal: number, date: Date) {
    let past = new Date("2000-01-01T00:00:00.000Z");
    let daysSinceJ2000 = diffDays(date, past) - 0.2;
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let offset = date.getTimezoneOffset() / 60;
    let UT_diff = offset > 0 ? offset * -1 : offset;

    let UT = (hour + minute / 60 + second / 3600 - UT_diff) % 24;
    let LST =
      (100.46 + 0.985647 * daysSinceJ2000 + longitudeDecimal + 15 * UT) % 360;
    return LST;
  }

  function calculateHA(raDecimal: number, LST: number) {
    return LST - raDecimal;
  }

  function calculateAlt(
    latitude: number,
    decDegree: number,
    decMinute: number,
    HA: number
  ) {
    return (
      Math.asin(
        Math.sin(toRad * (decDegree + decMinute / 60)) * Math.sin(toRad * lat) +
          Math.cos(toRad * (decDegree + decMinute / 60)) *
            Math.cos(toRad * latitude) *
            Math.cos(toRad * HA)
      ) / toRad
    );
  }

  function calculateAz(
    latitudeDecimal: number,
    decDegree: number,
    decMinute: number,
    HA: number,
    alt: number
  ) {
    let azTemp =
      Math.acos(
        (Math.sin(toRad * (decDegree + decMinute / 60)) -
          Math.sin(toRad * alt) * Math.sin(toRad * latitudeDecimal)) /
          (Math.cos(toRad * alt) * Math.cos(toRad * latitudeDecimal))
      ) / toRad;

    return Math.sin(toRad * HA) < 0 ? azTemp : 360 - azTemp;
  }

  let decDegree =
    decDecimal > 0 ? Math.floor(decDecimal) : Math.ceil(decDecimal);
  let decMinute = decDecimal - decDegree;

  let LST = calculateLST(lon, date);
  let HA = calculateHA(raDecimal, LST);
  let alt = calculateAlt(lat, decDegree, decMinute, HA);
  let az = calculateAz(lat, decDegree, decMinute, HA, alt);

  return { alt, az };
}

export function convertAzToCardinal(azDecimal: number) {
  if (azDecimal >= 0 && azDecimal <= 45) {
    return "N";
  } else if (azDecimal > 45 && azDecimal <= 90) {
    return "NE";
  } else if (azDecimal > 90 && azDecimal <= 135) {
    return "E";
  } else if (azDecimal > 135 && azDecimal <= 180) {
    return "SE";
  } else if (azDecimal > 180 && azDecimal <= 225) {
    return "S";
  } else if (azDecimal > 225 && azDecimal <= 270) {
    return "SW";
  } else if (azDecimal > 270 && azDecimal <= 315) {
    return "W";
  } else {
    return "NW";
  }
}
