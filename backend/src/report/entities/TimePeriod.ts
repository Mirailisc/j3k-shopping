export const TimePeriod = [
  { label: '1 day', value: 1 },
  { label: '1 week', value: 7 },
  { label: '1 month', value: 30 },
  { label: '3 months', value: 90 },
  { label: '6 months', value: 180 },
  { label: '1 year', value: 365 },
  { label: 'all time', value: 100000000 },
]

export function getValueFromLabel(value: string): number {
  const exist = TimePeriod.find((item) => item.label === value)
  return exist ? exist?.value : 30
}

export function subtractDays(label: string): String {
  const days = getValueFromLabel(label);
  var date;
  date = new Date();
  date.setDate(date.getDate() - days);

  return date.toISOString();;
}
