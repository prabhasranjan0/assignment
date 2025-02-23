import { PredefinedRange } from "./type";

export const PREDEFINED_RANGES: PredefinedRange[] = [
  {
    label: "Last 7 Days",
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  },
  {
    label: "Last 30 Days",
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  },
];
