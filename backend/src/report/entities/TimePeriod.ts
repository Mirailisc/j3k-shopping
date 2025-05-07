export const TimePeriod = [
    { label: '1 day', value: 'INTERVAL 1 DAY' },
    { label: '1 week', value: 'INTERVAL 1 WEEK' },
    { label: '1 month', value: 'INTERVAL 1 MONTH' },
    { label: '3 months', value: 'INTERVAL 3 MONTH' },
    { label: '6 months', value: 'INTERVAL 6 MONTH' },
    { label: '1 year', value: 'INTERVAL 1 YEAR' },
    { label: 'all time', value: 'ALL TIME' },
  ]

export function WrongTimePeriod(value: string): Boolean {
    const exist = TimePeriod.find((item) => item.value === value)
    return exist === undefined
}