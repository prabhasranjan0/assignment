export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface PredefinedRange {
  label: string;
  startDate: Date;
  endDate: Date;
}
