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
  } else data.objectName = "Manual";
  const nameNGC = parseObjectNGC(text);
  if (nameNGC) {
    data.objectNGC = nameNGC.objectNGC;
  } else data.objectNGC = "";
  return data;
}

function parseRADec(text: string) {
  let matches = text.match(
    /(?:[A-Za-z]+ *: *)?(?:RA\/Dec)? \(J2000.0\): *([-0-9hms.+°]+)\/([-0-9.+°'"]+)/
  );
  if (!matches) {
    matches = text.match(
      /(?:<td>\s*RA\/Dec \(J2000.0\):\s*<\/td>\s*<td[^>]*>\s*([-0-9hms.+°]*)\s*\/\s*<\/td>\s*<td[^>]*>\s*([-0-9.+°'"]*)\s*<\/td>)/i
    );
  }
  if (matches) {
    return { RA: matches[1], declination: matches[2] };
  }
}

function parseObjectName(text: string) {
  let matches = text.match(/<h2>(.*?)<\/h2>/);
  if (matches) {
    // Get the content inside the <h2> tag
    let content = matches[1];

    // Find the position of (
    let startIndex = content.indexOf("(");
    if (startIndex == 0) {
      let endIndex = content.indexOf(")", startIndex);
      if (endIndex !== -1) {
        let afterParenthesis = content.substring(endIndex + 1).trim();
        // Return only the content after the closing ')'
        return {
          objectName: afterParenthesis,
        };
      }
    } else if (startIndex !== -1)
      return {
        objectName: matches[1].split(")")[0].replace("<br />", "") + ")",
      };
    else return { objectName: matches[1].split("<br")[0] };
  }
}

function parseObjectNGC(text: string) {
  let matches = text.match(/<h2>(.*?)<\/h2>/);
  if (matches) {
    // Get the content inside the <h2> tag
    let content = matches[1];

    // Find the position of <br>
    let startIndex = content.indexOf("<br>");
    if (startIndex !== -1) {
      // Extract the substring after <br>
      let substring = content.substring(startIndex + 4);

      // Find the position of the first ' - ' or '<'
      let endIndexDash = substring.indexOf(" - ");
      let endIndexTag = substring.indexOf("<");

      // Determine the end index for the first name
      let endIndex = endIndexDash !== -1 ? endIndexDash : endIndexTag;

      // If neither ' - ' nor '<' is found, use the length of the substring
      if (endIndex === -1) {
        endIndex = substring.length;
      }

      // Extract the first name
      let firstName = substring.substring(0, endIndex).trim();

      // Check for the presence of "NGC xxx" or "HIP xxx" after the first name
      let additionalName: string | undefined = undefined;
      if (endIndexDash !== -1) {
        // Split the substring by " - " to get individual names
        let names = substring.split(" - ").map((name) => name.trim());

        // Find an additional name that starts with "NGC" or "HIP"
        additionalName = names.find(
          (name) => name.startsWith("NGC") || name.startsWith("HIP")
        );
      }

      // Combine the first name and additional name if present and conditions are met
      if (
        additionalName &&
        !firstName.startsWith("NGC") &&
        !firstName.startsWith("HIP")
      ) {
        return { objectNGC: `${firstName} - ${additionalName}` };
      } else {
        return { objectNGC: firstName };
      }
    } else {
      // Star  ?
      let indexDash = content.indexOf(" - ");
      if (indexDash !== -1) {
        // Split the content by " - " to get individual names
        let names = content.split(" - ").map((name) => name.trim());

        // Find the first occurrence of "HIP xxxx"
        let hipName = names.find((name) => name.startsWith("HIP"));

        if (hipName) return { objectNGC: hipName };
      }
    }
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
