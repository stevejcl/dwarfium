import { calculateImagingTime, calculateElapsedTime } from "@/lib/date_utils";

describe("calculateImagingTime", () => {
  it("returns seconds if total time is <= 59 seconds", () => {
    let timesObject = [
      { count: 0, expected: { hours: 0, minutes: 0, seconds: 0 } },
      { count: 5, expected: { hours: 0, minutes: 0, seconds: 5 } },
      { count: 59, expected: { hours: 0, minutes: 0, seconds: 59 } },
    ];
    let exposure = 1;

    timesObject.forEach((timeObject) => {
      let res = calculateImagingTime(timeObject.count, exposure);
      expect(res).toEqual(timeObject.expected);
    });
  });

  it("returns minutes and seconds if total time is > 59 and < 3600", () => {
    let timesObject = [
      { count: 60, expected: { hours: 0, minutes: 1, seconds: 0 } },
      { count: 65, expected: { hours: 0, minutes: 1, seconds: 5 } },
      { count: 179, expected: { hours: 0, minutes: 2, seconds: 59 } },
      { count: 3599, expected: { hours: 0, minutes: 59, seconds: 59 } },
    ];
    let exposure = 1;

    timesObject.forEach((timeObject) => {
      let res = calculateImagingTime(timeObject.count, exposure);
      expect(res).toEqual(timeObject.expected);
    });
  });

  it("returns hours, minutes and seconds if total time is >= 3600 ", () => {
    let timesObject = [
      { count: 3600, expected: { hours: 1, minutes: 0, seconds: 0 } },
      { count: 3605, expected: { hours: 1, minutes: 0, seconds: 5 } },
      { count: 3779, expected: { hours: 1, minutes: 2, seconds: 59 } },
      { count: 10799, expected: { hours: 2, minutes: 59, seconds: 59 } },
      { count: 36121, expected: { hours: 10, minutes: 2, seconds: 1 } },
    ];
    let exposure = 1;

    timesObject.forEach((timeObject) => {
      let res = calculateImagingTime(timeObject.count, exposure);
      expect(res).toEqual(timeObject.expected);
    });
  });
});

describe("calculateElapsedTime", () => {
  it("returns seconds if total time is <= 59 seconds", () => {
    let timesObject = [
      {
        start: "2000-01-01 12:00:00",
        now: "2000-01-01 12:00:00",
        expected: { hours: 0, minutes: 0, seconds: 0 },
      },
      {
        start: "2000-01-01 12:00:00",
        now: "2000-01-01 12:00:05",
        expected: { hours: 0, minutes: 0, seconds: 5 },
      },
      {
        start: "2000-01-01 12:00:00",
        now: "2000-01-01 12:00:59",
        expected: { hours: 0, minutes: 0, seconds: 59 },
      },
    ];

    timesObject.forEach((timeObject) => {
      let res = calculateElapsedTime(
        new Date(timeObject.start).getTime(),
        new Date(timeObject.now).getTime()
      );
      expect(res).toEqual(timeObject.expected);
    });
  });

  it("returns minutes and seconds if total time is > 59 and < 3600", () => {
    let timesObject = [
      {
        start: "2000-01-01 12:00:00",
        now: "2000-01-01 12:01:00",
        expected: { hours: 0, minutes: 1, seconds: 0 },
      },
      {
        start: "2000-01-01 12:00:00",
        now: "2000-01-01 12:01:05",
        expected: { hours: 0, minutes: 1, seconds: 5 },
      },
      {
        start: "2000-01-01 12:00:00",
        now: "2000-01-01 12:02:59",
        expected: { hours: 0, minutes: 2, seconds: 59 },
      },
      {
        start: "2000-01-01 12:00:00",
        now: "2000-01-01 12:59:59",
        expected: { hours: 0, minutes: 59, seconds: 59 },
      },
    ];

    timesObject.forEach((timeObject) => {
      let res = calculateElapsedTime(
        new Date(timeObject.start).getTime(),
        new Date(timeObject.now).getTime()
      );
      expect(res).toEqual(timeObject.expected);
    });
  });

  it("returns hours, minutes and seconds if total time is >= 3600 ", () => {
    let timesObject = [
      {
        start: "2000-01-01 12:00:00",
        now: "2000-01-01 13:00:00",
        expected: { hours: 1, minutes: 0, seconds: 0 },
      },
      {
        start: "2000-01-01 12:00:00",
        now: "2000-01-01 13:01:05",
        expected: { hours: 1, minutes: 1, seconds: 5 },
      },
      {
        start: "2000-01-01 12:00:00",
        now: "2000-01-01 13:02:59",
        expected: { hours: 1, minutes: 2, seconds: 59 },
      },
      {
        start: "2000-01-01 12:00:00",
        now: "2000-01-01 14:59:59",
        expected: { hours: 2, minutes: 59, seconds: 59 },
      },
      {
        start: "2000-01-01 12:00:00",
        now: "2000-01-01 22:02:01",
        expected: { hours: 10, minutes: 2, seconds: 1 },
      },
    ];

    timesObject.forEach((timeObject) => {
      let res = calculateElapsedTime(
        new Date(timeObject.start).getTime(),
        new Date(timeObject.now).getTime()
      );
      expect(res).toEqual(timeObject.expected);
    });
  });
});
