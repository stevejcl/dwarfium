import { data_dwarf2_config } from "@/lib/data_dwarf2_config";
import { data_dwarf3_config } from "@/lib/data_dwarf3_config";

// Function to get the exposures from JSON data
const getWideExposuresDwarf2 = () => {
  let value;
  let supportParam;
  const camera = data_dwarf2_config.data.cameras.find(
    (camera) => camera.id === 1
  );
  if (camera)
    supportParam = camera.supportParams.find((param) => param.id === 0);
  if (supportParam) value = supportParam.gearMode;
  return value ? value : false;
};

const getWideExposuresDwarf3 = () => {
  let value;
  let supportParam;
  const camera = data_dwarf3_config.data.cameras.find(
    (camera) => camera.id === 1
  );
  if (camera)
    supportParam = camera.supportParams.find((param) => param.id === 0);
  if (supportParam) value = supportParam.gearMode;
  return value ? value : false;
};

export const allowedWideExposures = {
  1: getWideExposuresDwarf2(),
  2: getWideExposuresDwarf3(),
};

export const getWideExposureIndexDefault = (DwarfModelId = 1) => {
  let index = 75;
  if (allowedWideExposures[DwarfModelId])
    index = allowedWideExposures[DwarfModelId].defaultValueIndex;
  return index;
};

export const getWideExposureDefault = (DwarfModelId = 1) => {
  let foundOption;
  let index;
  if (allowedWideExposures[DwarfModelId])
    index = allowedWideExposures[DwarfModelId].defaultValueIndex;
  foundOption = allowedWideExposures[DwarfModelId].values.find(
    (option) => option.index === index
  );
  return foundOption ? foundOption.name : "1/30";
};

export const getWideExposureNameByIndex = (index, DwarfModelId = 1) => {
  let foundOption;
  if (allowedWideExposures[DwarfModelId])
    foundOption = allowedWideExposures[DwarfModelId].values.find(
      (option) => option.index === index
    );
  return foundOption ? foundOption.name : "Auto";
};

export const getWideExposureValueByIndex = (index, DwarfModelId = 1) => {
  const name = getWideExposureNameByIndex(index, DwarfModelId);
  if (name == "Auto") return eval(getWideExposureDefault(DwarfModelId));
  else return eval(name);
};

export const getWideExposureIndexByName = (name, DwarfModelId = 1) => {
  let foundOption;
  if (allowedWideExposures[DwarfModelId])
    foundOption = allowedWideExposures[DwarfModelId].values.find(
      (option) => option.name === String(name)
    );
  if (!foundOption)
    foundOption.index = allowedWideExposures[DwarfModelId].defaultValueIndex;
  return foundOption ? foundOption.index : 75;
};

// Function to get the gains from JSON data
const getWideGainsDwarf2 = () => {
  let value;
  let supportParam;
  const camera = data_dwarf2_config.data.cameras.find(
    (camera) => camera.id === 1
  );
  if (camera)
    supportParam = camera.supportParams.find((param) => param.id === 1);
  if (supportParam) value = supportParam.gearMode;
  console.log({ value });
  return value ? value : false;
};

const getWideGainsDwarf3 = () => {
  let value;
  let supportParam;
  const camera = data_dwarf3_config.data.cameras.find(
    (camera) => camera.id === 1
  );
  if (camera)
    supportParam = camera.supportParams.find((param) => param.id === 1);
  if (supportParam) value = supportParam.gearMode;
  return value ? value : false;
};

export const allowedWideGains = {
  1: getWideGainsDwarf2(),
  2: getWideGainsDwarf3(),
};

export const getWideGainNameByIndex = (index, DwarfModelId = 1) => {
  let foundOption;
  if (allowedWideGains[DwarfModelId])
    foundOption = allowedWideGains[DwarfModelId].values.find(
      (option) => option.index === index
    );
  return foundOption ? foundOption.name : "Auto";
};

export const getWideGainIndexByName = (name, DwarfModelId = 1) => {
  let foundOption;
  if (allowedWideGains[DwarfModelId]) {
    foundOption = allowedWideGains[DwarfModelId].values.find(
      (option) => option.name === String(name)
    );
  }
  if (!foundOption) {
    return allowedWideGains[DwarfModelId]?.defaultValueIndex || 0;
  }
  // Return the index of the found option
  return foundOption.index;
};

// Function to get the WB Color Temp from JSON data
const getWideWBColorTempDwarf2 = () => {
  let value;
  let supportParam;
  const camera = data_dwarf2_config.data.cameras.find(
    (camera) => camera.id === 1
  );
  if (camera)
    supportParam = camera.supportParams.find((param) => param.id === 2);
  value = supportParam.gearMode;
  return value ? value : false;
};

const getWideWBColorTempDwarf3 = () => {
  let value;
  let supportParam;
  const camera = data_dwarf3_config.data.cameras.find(
    (camera) => camera.id === 1
  );
  if (camera)
    supportParam = camera.supportParams.find((param) => param.id === 2);
  value = supportParam.gearMode;
  return value ? value : false;
};

export const allowedWideWBColorTemp = {
  1: getWideWBColorTempDwarf2(),
  2: getWideWBColorTempDwarf3(),
};

export const getWideWBColorTempValueByIndex = (index, DwarfModelId = 1) => {
  let foundOption;
  if (allowedWideWBColorTemp[DwarfModelId])
    foundOption = allowedWideWBColorTemp[DwarfModelId].values.find(
      (option) => option.index === index
    );
  return foundOption ? foundOption.name : "Auto";
};

export const getWideWBColorTempIndexByValue = (name, DwarfModelId = 1) => {
  let foundOption;
  if (allowedWideWBColorTemp[DwarfModelId])
    foundOption = allowedWideWBColorTemp[DwarfModelId].values.find(
      (option) => option.name === String(name)
    );
  if (!foundOption)
    foundOption.index = allowedWideWBColorTemp[DwarfModelId].defaultValueIndex;
  return foundOption ? foundOption.index : 51;
};
