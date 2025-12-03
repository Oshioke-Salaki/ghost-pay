import { TyphoonSDK } from "typhoon-sdk";

const sdk = new TyphoonSDK();

export async function generateApproveAndDepositCalls(
  amount: bigint,
  tokenAddress: string
) {
  return await sdk.generate_approve_and_deposit_calls(amount, tokenAddress);
}

export function getSecrets() {
  return sdk.get_secrets();
}

export function getNullifiers() {
  return sdk.get_nullifiers();
}

export function getPools() {
  return sdk.get_pools();
}

export async function withdraw(txHash: string, receivers: string[]) {
  return await sdk.withdraw(txHash, receivers);
}

export async function downloadNotes(txHash: string) {
  return await sdk.download_notes(txHash);
}

export default sdk;
