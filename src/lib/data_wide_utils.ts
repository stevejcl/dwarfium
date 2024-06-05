export const allowedWideExposures = {
  defaultValueIndex: 75,
  values: [
    {
      index: 0,
      name: "3/10000",
    },
    {
      index: 3,
      name: "1/2500",
    },
    {
      index: 6,
      name: "1/2000",
    },
    {
      index: 9,
      name: "1/1600",
    },
    {
      index: 12,
      name: "1/1250",
    },
    {
      index: 15,
      name: "1/1000",
    },
    {
      index: 18,
      name: "1/800",
    },
    {
      index: 21,
      name: "1/640",
    },
    {
      index: 24,
      name: "1/500",
    },
    {
      index: 27,
      name: "1/400",
    },
    {
      index: 30,
      name: "1/320",
    },
    {
      index: 33,
      name: "1/250",
    },
    {
      index: 36,
      name: "1/200",
    },
    {
      index: 39,
      name: "1/160",
    },
    {
      index: 42,
      name: "1/125",
    },
    {
      index: 45,
      name: "1/100",
    },
    {
      index: 48,
      name: "1/80",
    },
    {
      index: 51,
      name: "1/60",
    },
    {
      index: 54,
      name: "1/50",
    },
    {
      index: 57,
      name: "1/40",
    },
    {
      index: 60,
      name: "1/30",
    },
    {
      index: 63,
      name: "1/25",
    },
    {
      index: 66,
      name: "1/20",
    },
    {
      index: 69,
      name: "1/15",
    },
    {
      index: 72,
      name: "1/13",
    },
    {
      index: 75,
      name: "1/10",
    },
    {
      index: 78,
      name: "1/8",
    },
    {
      index: 81,
      name: "1/6",
    },
    {
      index: 84,
      name: "1/5",
    },
    {
      index: 87,
      name: "1/4",
    },
    {
      index: 90,
      name: "1/3",
    },
    {
      index: 93,
      name: "0.4",
    },
    {
      index: 96,
      name: "0.5",
    },
    {
      index: 99,
      name: "0.6",
    },
    {
      index: 102,
      name: "0.8",
    },
    {
      index: 105,
      name: "1.0",
    },
  ],
};

export const getWideExposureIndexDefault = () => {
  let index = allowedWideExposures.defaultValueIndex;
  return index;
};

export const getWideExposureDefault = () => {
  let index = allowedWideExposures.defaultValueIndex;
  const foundOption = allowedWideExposures.values.find(
    (option) => option.index === index
  );
  return foundOption ? foundOption.name : "1/30";
};

export const getWideExposureNameByIndex = (index) => {
  const foundOption = allowedWideExposures.values.find(
    (option) => option.index === index
  );
  return foundOption ? foundOption.name : "Auto";
};

export const getWideExposureValueByIndex = (index) => {
  const name = getWideExposureNameByIndex(index);
  if (name == "Auto") return eval(getWideExposureDefault());
  else return eval(name);
};

export const getWideExposureIndexByName = (name) => {
  const foundOption = allowedWideExposures.values.find(
    (option) => option.name === name
  );
  return foundOption
    ? foundOption.index
    : allowedWideExposures.defaultValueIndex;
};

export const allowedWideGains = {
  defaultValueIndex: 0,
  values: [
    {
      index: 0,
      name: "60",
    },
    {
      index: 3,
      name: "70",
    },
    {
      index: 6,
      name: "80",
    },
    {
      index: 9,
      name: "90",
    },
    {
      index: 12,
      name: "100",
    },
    {
      index: 15,
      name: "110",
    },
    {
      index: 18,
      name: "120",
    },
    {
      index: 21,
      name: "130",
    },
    {
      index: 24,
      name: "140",
    },
    {
      index: 27,
      name: "150",
    },
    {
      index: 30,
      name: "160",
    },
  ],
};

export const getWideGainNameByIndex = (index) => {
  const foundOption = allowedWideGains.values.find(
    (option) => option.index === index
  );
  return foundOption ? foundOption.name : "Auto";
};

export const getWideGainIndexByName = (name) => {
  const foundOption = allowedWideGains.values.find(
    (option) => option.name === name
  );
  return foundOption ? foundOption.index : allowedWideGains.defaultValueIndex;
};

export const allowedWideWBColorTemp = {
  defaultValueIndex: 51,
  values: [
    {
      index: 0,
      name: "2800",
    },
    {
      index: 3,
      name: "2900",
    },
    {
      index: 6,
      name: "3000",
    },
    {
      index: 9,
      name: "3100",
    },
    {
      index: 12,
      name: "3200",
    },
    {
      index: 15,
      name: "3300",
    },
    {
      index: 18,
      name: "3400",
    },
    {
      index: 21,
      name: "3500",
    },
    {
      index: 24,
      name: "3600",
    },
    {
      index: 27,
      name: "3700",
    },
    {
      index: 30,
      name: "3800",
    },
    {
      index: 33,
      name: "3900",
    },
    {
      index: 36,
      name: "4000",
    },
    {
      index: 39,
      name: "4100",
    },
    {
      index: 42,
      name: "4200",
    },
    {
      index: 45,
      name: "4300",
    },
    {
      index: 48,
      name: "4400",
    },
    {
      index: 51,
      name: "4500",
    },
    {
      index: 54,
      name: "4600",
    },
    {
      index: 57,
      name: "4700",
    },
    {
      index: 60,
      name: "4800",
    },
    {
      index: 63,
      name: "4900",
    },
    {
      index: 66,
      name: "5000",
    },
    {
      index: 69,
      name: "5100",
    },
    {
      index: 72,
      name: "5200",
    },
    {
      index: 75,
      name: "5300",
    },
    {
      index: 78,
      name: "5400",
    },
    {
      index: 81,
      name: "5500",
    },
    {
      index: 84,
      name: "5600",
    },
    {
      index: 87,
      name: "5700",
    },
    {
      index: 90,
      name: "5800",
    },
    {
      index: 93,
      name: "5900",
    },
    {
      index: 96,
      name: "6000",
    },
  ],
};

export const getWideWBColorTempValueByIndex = (index) => {
  const foundOption = allowedWideWBColorTemp.values.find(
    (option) => option.index === index
  );
  return foundOption ? foundOption.name : "Auto";
};

export const getWideWBColorTempIndexByValue = (name) => {
  const foundOption = allowedWideWBColorTemp.values.find(
    (option) => option.name === name
  );
  return foundOption
    ? foundOption.index
    : allowedWideWBColorTemp.defaultValueIndex;
};
