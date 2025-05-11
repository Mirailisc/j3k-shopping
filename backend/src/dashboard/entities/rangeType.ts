const validRanges = ['DAY', 'WEEK', 'MONTH', 'YEAR'] as const;
type Range = typeof validRanges[number];

export function validateRange(range: string): Range {
  return validRanges.includes(range as Range) ? (range as Range) : 'MONTH';
}