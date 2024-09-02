type FieldValues = number | "default" | undefined;

type Fields = {
  gain: FieldValues | string;
  exposure: FieldValues | string;
  IR: FieldValues;
  binning: FieldValues;
  fileFormat: FieldValues;
  count: FieldValues;
  quality: FieldValues;
  AiEnhance: FieldValues;
};

export function validateAstroSettings(values: Fields) {
  const errors: { [k: string]: string } = {};
  [
    "gain",
    "exposure",
    "IR",
    "binning",
    "fileFormat",
    "count",
    "quality",
    "AiEnhance",
  ].forEach((item) => {
    if (
      values[item as keyof Fields] === undefined ||
      values[item as keyof Fields] === "default"
    ) {
      errors[item] = `${item} is required`;
    }
  });

  return errors;
}
