const DAYS_IN_WEEK = 7;
const DAYS_IN_MONTH = 30;
const DAYS_IN_3_MONTHS = 90;
const DAYS_IN_6_MONTHS = 180;
const DAYS_IN_YEAR = 365;
const ALL_TIME_DAYS = 100_000_000;
const DEFAULT_DAYS = DAYS_IN_MONTH;

export const TimePeriod = [
  { label: '1 day', value: 1 },
  { label: '1 week', value: DAYS_IN_WEEK },
  { label: '1 month', value: DAYS_IN_MONTH },
  { label: '3 months', value: DAYS_IN_3_MONTHS },
  { label: '6 months', value: DAYS_IN_6_MONTHS },
  { label: '1 year', value: DAYS_IN_YEAR },
  { label: 'all time', value: ALL_TIME_DAYS },
];

export function getValueFromLabel(value: string): number {
  const exist = TimePeriod.find((item) => item.label === value);
  return exist ? exist.value : DEFAULT_DAYS;
}

export function subtractDays(label: string): string {
  const days = getValueFromLabel(label);
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}
