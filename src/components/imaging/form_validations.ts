type FieldValues = number | "default" | undefined;

type Fields = {
  gain: FieldValues | string;
  exposure: FieldValues | string;
  IR: FieldValues;
  binning: FieldValues;
  fileFormat: FieldValues;
  count: FieldValues;
  quality: FieldValues;
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
    "AIEnhance",
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
