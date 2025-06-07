export function formatValue(v: number): string {
  // If v is a percentage (0–100 range for growth, etc.), show as is
  // Otherwise, use compact notation for large numbers
  if (Math.abs(v) < 1000) {
    return v.toLocaleString(undefined, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    });
  }
  return new Intl.NumberFormat(undefined, {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 2,
  }).format(v);
}
