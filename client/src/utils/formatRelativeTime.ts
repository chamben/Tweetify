const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 60 * 60 * 24 * 365],
  ['month', 60 * 60 * 24 * 30],
  ['day', 60 * 60 * 24],
  ['hour', 60 * 60],
  ['minute', 60],
];

const SHORT_LABEL: Record<string, string> = {
  year: 'y',
  month: 'mo',
  day: 'd',
  hour: 'h',
  minute: 'm',
};

/**
 * Formats a timestamp as a short relative label similar to X/Twitter, e.g. "5m", "3h", "2d".
 * Falls back to a locale date string once older than a year.
 */
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) {
    return 'now';
  }

  for (const [unit, secondsInUnit] of UNITS) {
    const value = Math.floor(seconds / secondsInUnit);
    if (value >= 1) {
      if (unit === 'year') {
        return date.toLocaleDateString();
      }
      return `${value}${SHORT_LABEL[unit]}`;
    }
  }

  return 'now';
}
