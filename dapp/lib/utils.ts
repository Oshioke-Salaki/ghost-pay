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

export function formatWeiToAmount(wei: bigint, decimals = 18): string {
  const base = 10n ** BigInt(decimals);

  const whole = wei / base;
  const fraction = wei % base;

  if (fraction === 0n) {
    return whole.toString();
  }

  const fractionStr = fraction
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, ""); // trim trailing zeros

  return `${whole}.${fractionStr}`;
}
