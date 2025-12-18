import { PredefinedSeries, SeriesType, VoteValue } from "../types";

export const PREDEFINED_SERIES: PredefinedSeries[] = [
  {
    type: "fibonacci",
    name: "Fibonacci",
    values: [0.5, 1, 2, 3, 5, 8, 13, 21],
  },
  {
    type: "modified-fibonacci",
    name: "Modified Fibonacci",
    values: [1, 2, 3, 5, 8, 13, 21, 34],
  },
  {
    type: "tshirt",
    name: "T-Shirt Sizes",
    values: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    type: "powers-of-2",
    name: "Powers of 2",
    values: [1, 2, 4, 8, 16, 32],
  },
];

export const getSeriesByType = (type: SeriesType): VoteValue[] => {
  const series = PREDEFINED_SERIES.find((s) => s.type === type);
  return series ? series.values : PREDEFINED_SERIES[0].values;
};

export const getSeriesName = (type: SeriesType): string => {
  const series = PREDEFINED_SERIES.find((s) => s.type === type);
  return series ? series.name : "Custom";
};

export const isNumericSeries = (values: VoteValue[]): boolean => {
  return values.every((v) => typeof v === "number");
};

export const validateCustomSeries = (
  values: VoteValue[]
): { valid: boolean; error?: string } => {
  if (values.length < 3) {
    return { valid: false, error: "Series must have at least 3 values" };
  }

  const uniqueValues = new Set(values);
  if (uniqueValues.size !== values.length) {
    return { valid: false, error: "Series cannot have duplicate values" };
  }

  return { valid: true };
};
