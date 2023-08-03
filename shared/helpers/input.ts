export function cleanNumber(
  num: number | string,
  defaultValue = 0,
  opts: {
    round?: boolean;
    floor?: boolean;
    abs?: boolean;
    min?: number;
    max?: number;
  } = {},
): number {
  num = +num;
  if (isNaN(num)) return defaultValue;
  if (!isFinite(num)) return defaultValue;

  if (opts.round) num = Math.round(num);
  if (opts.floor) num = Math.floor(num);
  if (opts.abs) num = Math.abs(num);

  if (opts.min !== undefined) num = Math.max(num, opts.min);
  if (opts.max !== undefined) num = Math.min(num, opts.max);

  return num;
}
