export function formatBigInt(amount: bigint, decimals: number = 18) {
  const divisor = BigInt(10) ** BigInt(decimals);
  const integer = amount / divisor;
  const fraction = amount % divisor;
  return `${integer}.${fraction.toString().padStart(decimals, "0")}`;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}

export function shortenAddress(address: `0x${string}`, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, 5)}...${address.slice(-chars)}`;
}

export function parseAmountToWei(amount: string | number): bigint {
  const str = amount.toString();

  if (!str.includes(".")) {
    // simple integer case
    return BigInt(str) * 10n ** 18n;
  }

  const [whole, fraction] = str.split(".");

  // Pad the fractional part to 18 digits
  const fractionPadded = (fraction + "0".repeat(18)).slice(0, 18);

  return BigInt(whole) * 10n ** 18n + BigInt(fractionPadded);
}
