export function toBigInt(value: any): bigint | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  try {
    return BigInt(value);
  } catch {
    return undefined;
  }
}

export function toDate(value: any): Date | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

export function toNumber(value: any): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return isNaN(n) ? undefined : n;
}
