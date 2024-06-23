import {
  parseStellariumData,
  formatObjectNameStellarium,
} from "@/lib/stellarium_utils";
import { ObjectStellarium } from "@/types";

describe("parseStellariumData", () => {
  it("parses object name, RA and declination in hh:mm:ss format", () => {
    let text = `<h2>Sun</h2>Type: <b>star</b><br/>RA/Dec (J2000.0):     3h43m23.32s/+19°43'59.3"<br/>RA/Dec (on date):     3h44m43.70s/+19°48'25.0"<br/>HA/Dec:    20h00m46.20s/+19°49'04.7"  (apparent)<br/>`;
    let expected = {
      RA: "3h43m23.32s",
      declination: "+19°43'59.3\"",
      objectName: "Sun",
      objectNGC: "",
    };
    let res = parseStellariumData(text);

    expect(res).toEqual(expected);
  });

  it("parses object name, RA and declination in decimal format", () => {
    let text = `<h2>Sun</h2>Type: <b>star</b><br/>RA/Dec (J2000.0):     56.99046°/19.9770°<br/>RA/Dec (on date):     57.32990°/20.0476°<br/>HA/Dec:    20h00m46.20s/+19°49'04.7"  (apparent)<br/>`;

    let expected = {
      RA: "56.99046°",
      declination: "19.9770°",
      objectName: "Sun",
      objectNGC: "",
    };
    let res = parseStellariumData(text);

    expect(res).toEqual(expected);
  });

  it("parses negative numbers", () => {
    let text =
      "<h2>Spica (Azimech - Alaraph)<br />α Vir - 67<br />SAO 157923</h2>Type: <b>double star, variable star</b> (ELL+BCEP)<br />RA/Dec (J2000.0):    13h25m12.45s/-11°09'47.6\"<br/>RA/Dec (on date):    13h26m25.97s/-11°17'03.2\"<br/>HA/Dec:     6h29m41.30s/-11°17'03.2\"  (apparent)<br/>Az./Alt.: +264°38'41.8\"/-12°23'19.1\"  (apparent)";

    let expected = {
      RA: "13h25m12.45s",
      declination: "-11°09'47.6\"",
      objectName: "Spica (Azimech - Alaraph)",
      objectNGC: "",
    };
    let res = parseStellariumData(text);

    expect(res).toEqual(expected);
  });
});

describe("formatObjectNameStellarium", () => {
  let properties = {
    constellation: "Leo",
    dec: "+13°05'33\"",
    fov: 0,
    isVisibleMarker: true,
    jd: 0,
    landscapeID: "",
    location: "",
    magnitude: "9.30",
    objtype: "galaxy",
    ra: "11h18m56.2s",
    type: "Nebula",
  };

  it("uses designation, name, and nameI18n to create name if they are different", () => {
    let object: ObjectStellarium = {
      designation: "M 1",
      name: "name",
      nameI18n: "nameI18n",
      ...properties,
    };
    let expected = "M 1 - name; nameI18n";

    let res = formatObjectNameStellarium(object);
    expect(res).toEqual(expected);
  });

  it("uses designation and name if name and nameI18n are the same", () => {
    let object: ObjectStellarium = {
      designation: "M 1",
      name: "name",
      nameI18n: "name",
      ...properties,
    };
    let expected = "M 1 - name";

    let res = formatObjectNameStellarium(object);
    expect(res).toEqual(expected);
  });

  it("uses designation and nameI18n to create name if designation and name are the same", () => {
    let object: ObjectStellarium = {
      designation: "M 1",
      name: "M 1",
      nameI18n: "nameI18n",
      ...properties,
    };
    let expected = "M 1 - nameI18n";

    let res = formatObjectNameStellarium(object);
    expect(res).toEqual(expected);
  });

  it("uses designation to create name if designation, name, nameI18n are the same", () => {
    let object: ObjectStellarium = {
      designation: "M 1",
      name: "M 1",
      nameI18n: "M 1",
      ...properties,
    };
    let expected = "M 1";

    let res = formatObjectNameStellarium(object);
    expect(res).toEqual(expected);
  });

  it("ignores names that are empty strings", () => {
    let object: ObjectStellarium = {
      designation: "M 1",
      name: "",
      nameI18n: "",
      ...properties,
    };
    let expected = "M 1";

    let res = formatObjectNameStellarium(object);
    expect(res).toEqual(expected);
  });

  it("name and nameI18n to create name if they are different", () => {
    let object: ObjectStellarium = {
      designation: "",
      name: "name",
      nameI18n: "nameI18n",
      ...properties,
    };
    let expected = "name; nameI18n";

    let res = formatObjectNameStellarium(object);
    expect(res).toEqual(expected);
  });

  it("name to create name if they are different", () => {
    let object: ObjectStellarium = {
      designation: "",
      name: "name",
      nameI18n: "",
      ...properties,
    };
    let expected = "name";

    let res = formatObjectNameStellarium(object);
    expect(res).toEqual(expected);
  });

  it("nameI18n to create name if they are different", () => {
    let object: ObjectStellarium = {
      designation: "",
      name: "",
      nameI18n: "nameI18n",
      ...properties,
    };
    let expected = "nameI18n";

    let res = formatObjectNameStellarium(object);
    expect(res).toEqual(expected);
  });

  it("handles missing designation", () => {
    let object: ObjectStellarium = {
      name: "name",
      nameI18n: "nameI18n",
      ...properties,
    };
    let expected = "name; nameI18n";

    let res = formatObjectNameStellarium(object);
    expect(res).toEqual(expected);
  });

  it("handles missing nameI18n", () => {
    let object: ObjectStellarium = {
      designation: "designation",
      name: "name",
      ...properties,
    };
    let expected = "designation - name";

    let res = formatObjectNameStellarium(object);
    expect(res).toEqual(expected);
  });

  it("handles missing name", () => {
    let object: ObjectStellarium = {
      designation: "designation",
      nameI18n: "nameI18n",
      ...properties,
    };
    let expected = "designation - nameI18n";

    let res = formatObjectNameStellarium(object);
    expect(res).toEqual(expected);
  });
});
