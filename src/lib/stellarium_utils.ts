import {
  ParsedStellariumData,
  ObjectStellariumInfo,
  ObjectStellarium,
} from "@/types";

export let statusPath = "/api/main/status";
export let focusPath = "/api/main/focus?target=";
export let focusPosPath = "/api/main/focus?position=";
export let objectInfoPath = "/api/objects/info?format=json";

export let catalogs = ["C", "Ced", "HIP", "IC", "LBN", "M", "NGC", "PGC"];

export function parseStellariumData(text: string): ParsedStellariumData {
  let data = {} as ParsedStellariumData;

  const RADecData = parseRADec(text);
  if (RADecData) {
    data.RA = RADecData.RA;
    data.declination = RADecData.declination;
  }
  const nameData = parseObjectName(text);
  if (nameData) {
    data.objectName = nameData.objectName;
  }

  return data;
}

function parseRADec(text: string) {
  let matches = text.match(
    /(?:[A-Za-z]+ *: *)?(?:RA\/Dec)? \(J2000.0\): *([-0-9hms.+°]+)\/([-0-9.+°'"]+)/
  );
  if (matches) {
    return { RA: matches[1], declination: matches[2] };
  }
}

function parseObjectName(text: string) {
  let matches = text.match(/<h2>(.*?)<\/h2>/);
  if (matches) {
    return { objectName: matches[1].split("<br")[0] };
  }
}

export function formatObjectName(objectData: ObjectStellariumInfo) {
  let name1 = objectData.designations;
  let name2 = objectData.name;
  let name3 = objectData["localized-name"];
  return formatName(name1, name2, name3);
}

export function formatObjectNameStellarium(objectData: ObjectStellarium) {
  let name1 = objectData.designation;
  let name2 = objectData.name;
  let name3 = objectData.nameI18n;
  return formatName(name1, name2, name3);
}

function formatName(
  name1: string | undefined,
  name2: string | undefined,
  name3: string | undefined
) {
  let allNames = [name1, name2, name3];
  let filteredNames = allNames.filter(
    (item) => item !== "" && item !== undefined
  );
  let uniqueNames = new Set(filteredNames);
  let names = "";
  if (uniqueNames.size === 1) {
    names += Array.from(uniqueNames)[0];
  } else if (uniqueNames.size === 2) {
    if (uniqueNames.has(name1)) {
      names += name1;
      names += " - ";

      if (uniqueNames.has(name2) && name2 !== name1) {
        names += name2;
      } else {
        names += name3;
      }
    } else {
      names += `${name2}; ${name3}`;
    }
  } else {
    names += `${name1} - ${name2}; ${name3}`;
  }

  return names;
}

// https://stackoverflow.com/a/24457420
export function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}
