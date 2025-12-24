import { useBalance } from "@starknet-react/core";
import { STRK_ADDR } from "@/lib/data";

export function usePublicBalance(address?: `0x${string}`) {
  const { data, isLoading } = useBalance({
    address,
    token: STRK_ADDR,
    watch: true,
  });

  return {
    balance: data ? Number(data.formatted) : 0,
    isLoading,
  };
}
