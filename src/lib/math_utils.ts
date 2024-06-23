import { sexagesimal as sexa } from "astronomia";

export function roundExposure(value: number): number {
  let newValue = 100000;
  if (value > 0.8) {
    newValue = Math.round(value);
  } else if (value > 0.08) {
    newValue = Math.round(value * 10) / 10;
  } else if (value > 0.008) {
    newValue = Math.round(value * 100) / 100;
  } else if (value > 0.0008) {
    newValue = Math.round(value * 1000) / 1000;
  } else {
    newValue = Math.round(value * 10000) / 10000;
  }

  return newValue;
}

export function olderThanHours(prevTime: number, hours: number): boolean {
  const oneDay = hours * 60 * 60 * 1000;
  return Date.now() - prevTime > oneDay;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from#sequence_generator_range
export function range(start: number, stop: number, step: number) {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step
  );
}

export function parseRaToFloat(raString) {
  // If the input is already in decimal format, return it directly
  if (!raString.includes(":")) {
    return parseFloat(raString);
  }

  // Split the RA string into hours, minutes, and seconds
  const raParts = raString.split(":").map(parseFloat);
  // Handle the case where hours, minutes, and seconds are given without leading zeros
  let hours, minutes, seconds;
  if (raParts.length === 3) {
    [hours, minutes, seconds] = raParts;
  } else if (raParts.length === 2) {
    // Handle the case where only two parts are provided (e.g., "1:0:7.49" or "01:07:07.49")
    hours = raParts[0];
    minutes = Math.floor(raParts[1] / 100); // Extract minutes from the second part
    seconds = raParts[1] % 100; // Extract seconds from the second part
  } else {
    return false; // Invalid format
  }

  // Validate RA format
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    return false;
  }

  // Convert to decimal hour
  const raDecimal = hours + minutes / 60 + seconds / 3600;

  return raDecimal;
}

export function formatRa(raDecimal) {
  if (raDecimal === false) {
    return "Invalid RA";
  }

  let hours = Math.floor(raDecimal);
  const minutesDecimal = (raDecimal % 1) * 60;
  let minutes = Math.floor(minutesDecimal);
  let seconds = (minutesDecimal % 1) * 60;
  seconds = Math.round(seconds * 100) / 100;

  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }

  if (minutes >= 60) {
    minutes = 0;
    hours += 1;
  }

  return `${hours}h ${minutes}m ${seconds.toFixed(2)}s`;
}

export function formatModifyRa(raDecimal) {
  if (raDecimal === false) {
    return "Invalid RA";
  }

  let hours = Math.floor(raDecimal);
  const minutesDecimal = (raDecimal % 1) * 60;
  let minutes = Math.floor(minutesDecimal);
  let seconds = (minutesDecimal % 1) * 60;
  seconds = Math.round(seconds * 100) / 100;

  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }

  if (minutes >= 60) {
    minutes = 0;
    hours += 1;
  }

  return `${hours}:${minutes}:${seconds.toFixed(2)}`;
}

export function parseDecToFloat(decString) {
  // If the input is already in decimal format, return it directly
  if (!decString.includes(":")) {
    return parseFloat(decString);
  }

  // Split the Dec string into degrees, minutes, and seconds
  let sign = 1;
  let decStringModified = decString;
  if (decString.charAt(0) === "-") {
    sign = -1;
    decStringModified = decString.substring(1);
  }

  const decParts = decStringModified.split(":").map(parseFloat);

  // Validate Dec format
  if (decParts.length !== 3 || decParts.some(isNaN)) {
    return false;
  }
  const [degrees, minutes, seconds] = decParts;

  // Convert to decimal degrees
  const decDecimal = sign * (degrees + minutes / 60 + seconds / 3600);

  return decDecimal;
}

export function formatDec(decDecimal) {
  if (decDecimal === false) {
    return "Invalid Dec";
  }

  const absDecDecimal = Math.abs(decDecimal);
  let degrees = Math.floor(absDecDecimal);
  let minutes = Math.floor((absDecDecimal % 1) * 60);
  let seconds = (absDecDecimal * 3600) % 60;
  seconds = Math.round(seconds * 100) / 100;

  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }

  if (minutes >= 60) {
    minutes = 0;
    degrees += 1;
  }

  const sign = decDecimal < 0 ? "-" : "+";

  return `${sign}${degrees}° ${minutes}' ${seconds.toFixed(1)}"`;
}

export function formatModifyDec(decDecimal) {
  if (decDecimal === false) {
    return "Invalid Dec";
  }

  const absDecDecimal = Math.abs(decDecimal);
  let degrees = Math.floor(absDecDecimal);
  let minutes = Math.floor((absDecDecimal % 1) * 60);
  let seconds = (absDecDecimal * 3600) % 60;
  seconds = Math.round(seconds * 100) / 100;

  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }

  if (minutes >= 60) {
    minutes = 0;
    degrees += 1;
  }

  const sign = decDecimal < 0 ? "-" : "+";

  return `${sign}${degrees}:${minutes}:${seconds.toFixed(1)}`;
}

// https://www.vedantu.com/question-answer/calculate-the-right-ascension-and-decli-class-11-physics-cbse-5ff94d1cbfdd3912f3ab841e
export function convertHMSToDecimalDegrees(
  text: string,
  decimalPlaces = 5
): number {
  let hmsMatches = extractHMSValues(text);
  if (hmsMatches) {
    // eslint-disable-next-line  no-unused-vars
    let { hour, minute, second } = hmsMatches;
    let decimal =
      (Number(hour) + Number(minute) / 60 + Number(second) / 3600) * 15;
    return formatFloatToDecimalPlaces(decimal, decimalPlaces);
  }

  let decimalMatches = text.match(/([-0-9.]+)/);
  if (decimalMatches) {
    return formatFloatToDecimalPlaces(Number(decimalMatches[1]), decimalPlaces);
  }

  return Number(text);
}

// Dwarf uses RA in decimal hour : don't multiply by 15 !
export function convertHMSToDecimalHours(
  text: string,
  decimalPlaces = 5
): number {
  let hmsMatches = extractHMSValues(text);
  if (hmsMatches) {
    // eslint-disable-next-line  no-unused-vars
    let { hour, minute, second } = hmsMatches;
    let decimal = Number(hour) + Number(minute) / 60 + Number(second) / 3600;
    return formatFloatToDecimalPlaces(decimal, decimalPlaces);
  }

  let decimalMatches = text.match(/([-0-9.]+)/);
  if (decimalMatches) {
    return formatFloatToDecimalPlaces(Number(decimalMatches[1]), decimalPlaces);
  }

  return Number(text);
}

export function extractHMSValues(text: string):
  | {
      hour: number;
      minute: number;
      second: number;
    }
  | undefined {
  let hmsMatches = text.match(/(\d{1,2})[hH] *(\d{1,2})[mM'] *([0-9.]+)[sS"]+/);
  if (hmsMatches) {
    // eslint-disable-next-line  no-unused-vars
    let [_, hour, minute, second] = hmsMatches;
    return {
      hour: Number(hour),
      minute: Number(minute),
      second: Number(second),
    };
  }
  hmsMatches = text.match(/(\d{1,2}):(\d{1,2}):([0-9.]+)/);
  if (hmsMatches) {
    // eslint-disable-next-line  no-unused-vars
    let [_, hour, minute, second] = hmsMatches;

    return {
      hour: Number(hour),
      minute: Number(minute),
      second: Number(second),
    };
  }
}

// Dwarf uses RA in decimal hour : don't multiply by 15 !
export function convertHMSToDwarfRA(text: string): string | undefined {
  let hmsMatches = extractHMSValues(text);
  if (hmsMatches) {
    // eslint-disable-next-line  no-unused-vars
    let { hour, minute, second } = hmsMatches;
    return `${hour}h ${minute}m ${second}s`;
  }

  let decimalMatches = text.match(/([-0-9.]+)/);
  if (decimalMatches) {
    let { hour, minute, second } = convertDecimalHoursToHMS(
      Number(decimalMatches[1])
    );
    return `${hour}h ${minute}m ${second}s`;
  }
}

// https://stackoverflow.com/a/5786281
export function convertDecimalDegreesToHMS(decimal: number) {
  let degree = decimal / 15;
  return {
    hour: 0 | (degree < 0 ? (degree = -degree) : degree),
    minute: 0 | (((degree += 1e-9) % 1) * 60),
    second: (0 | (((degree * 60) % 1) * 6000)) / 100,
  };
}

// Dwarf uses RA in decimal hour : don't divide by 15 !
export function convertDecimalHoursToHMS(decimal: number) {
  let degree = decimal;
  let hours = 0 | (degree < 0 ? (degree = -degree) : degree);
  let minutes = 0 | (((degree += 1e-9) % 1) * 60);
  let seconds = (0 | (((degree * 60) % 1) * 6000)) / 100;

  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }

  if (minutes >= 60) {
    minutes = 0;
    hours += 1;
  }

  return {
    hour: hours,
    minute: minutes,
    second: seconds,
  };
}

export function convertDMSToDecimalDegrees(
  text: string,
  decimalPlaces = 5
): number {
  let dmsMatches = extractDMSValues(text);
  if (dmsMatches) {
    let { negative, degree, minute, second } = dmsMatches;
    return sexa.DMSToDeg(
      negative,
      Number(degree),
      Number(minute),
      Number(second)
    );
  }

  let decimalMatches = text.match(/([-0-9.]+)/);
  if (decimalMatches) {
    return formatFloatToDecimalPlaces(Number(decimalMatches[1]), decimalPlaces);
  }

  return Number(text);
}

export function convertDMSToDwarfDec(text: string): string | undefined {
  let data = extractDMSValues(text);
  if (data) {
    let { negative, degree, minute, second } = data;
    let secondParts = second.toString().split(".");
    let secondStr = padNumber(Number(secondParts[0]));
    if (secondParts[1]) {
      secondStr = secondStr + "." + secondParts[1];
    }
    let newDec = `${padNumber(degree)}° ${padNumber(minute)}' ${secondStr}"`;
    return negative ? "-" + newDec : "+" + newDec;
  }

  let decimalMatches = text.match(/([-0-9.]+)/);
  if (decimalMatches) {
    let { negative, degree, minute, second } = convertDecimalDegreesToDMS(
      Number(decimalMatches[1])
    );
    let secondParts = second.toString().split(".");
    let secondStr = padNumber(Number(secondParts[0]));
    if (secondParts[1]) {
      secondStr = secondStr + "." + secondParts[1];
    }
    let newDec = `${padNumber(degree)}° ${padNumber(minute)}' ${secondStr}"`;
    return negative ? "-" + newDec : "+" + newDec;
  }
}

export function extractDMSValues(text: string) {
  let dmsMatches = text.match(/(\d{1,3})° *(\d{1,2})' *([0-9.]+)"/);
  if (dmsMatches) {
    // eslint-disable-next-line  no-unused-vars
    let [_, degree, minute, second] = dmsMatches;

    return {
      negative: text[0] === "-",
      degree: Number(degree),
      minute: Number(minute),
      second: Number(second),
    };
  }

  dmsMatches = text.match(/(\d{1,2}):(\d{1,2}):([0-9.]+)/);
  if (dmsMatches) {
    // eslint-disable-next-line  no-unused-vars
    let [_, degree, minute, second] = dmsMatches;

    return {
      negative: text[0] === "-",
      degree: Number(degree),
      minute: Number(minute),
      second: Number(second),
    };
  }
}

export function convertDecimalDegreesToDMS(decimal: number) {
  const data = sexa.degToDMS(decimal);

  let degrees = data[1];
  let minutes = data[2];
  let seconds = data[3];

  if (seconds >= 60) {
    seconds = 0;
    minutes += 1;
  }

  if (minutes >= 60) {
    minutes = 0;
    degrees += 1;
  }

  return {
    negative: data[0],
    degree: degrees,
    minute: minutes,
    second: seconds,
  };
}

export function padNumber(num: number, places = 2) {
  return num.toString().padStart(places, "0");
}

// https://stackoverflow.com/a/32178833
export function formatFloatToDecimalPlaces(
  value: number,
  decimalPlaces: number
): number {
  return Number(
    Math.round(parseFloat(value + "e" + decimalPlaces)) + "e-" + decimalPlaces
  );
}

export function convertRaDecToVec3d(dec: number, Ra: number) {
  let toRad = Math.PI / 180;

  let x = Math.cos(dec * toRad) * Math.cos(Ra * toRad);
  let y = Math.cos(dec * toRad) * Math.sin(Ra * toRad);
  let z = Math.sin(dec * toRad);

  return {
    x: x,
    y: y,
    z: z,
  };
}

export function ConvertStrDeg(data: number) {
  let { degree, minute, second, negative } = convertDecimalDegreesToDMS(data);
  let secondParts = second.toString().split(".");
  let secondStr = padNumber(Number(secondParts[0]));
  if (secondParts[1]) {
    secondStr = secondStr + "." + secondParts[1];
  }
  let newData = `${padNumber(degree)}° ${padNumber(minute)}' ${secondStr}"`;

  return negative ? "-" + newData : "+" + newData;
}

export function ConvertStrHours(data: number) {
  let { hour, minute, second } = convertDecimalHoursToHMS(data);
  return `${hour}h ${minute}m ${second}s`;
}
