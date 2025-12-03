import { Account, RpcProvider } from "starknet";

const provider = new RpcProvider({
  nodeUrl: "https://starknet-mainnet.public.blastapi.io/rpc/v0_8",
});

export function createAccount(address: string, privateKey: string) {
  return new Account(provider, address, privateKey);
}

export { provider };
