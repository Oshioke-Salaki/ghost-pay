import { useState, useEffect } from 'react';
import { getQuotes } from '@avnu/avnu-sdk';
import { TONGO_CONTRACTS } from '@/lib/tongoData';

export const useAvnuPrice = (tokenSymbol: string) => {
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If stablecoin, price is $1
    if (['USDC', 'USDT'].includes(tokenSymbol)) {
        setPrice(1);
        return;
    }

    const fetchPrice = async () => {
      setLoading(true);
      setError(null);
      try {
        const tokenConfig = TONGO_CONTRACTS['mainnet'][tokenSymbol as keyof typeof TONGO_CONTRACTS['mainnet']];
        const usdcConfig = TONGO_CONTRACTS['mainnet']['USDC'];

        if (!tokenConfig || !usdcConfig) {
             throw new Error('Token config missing');
        }

        // Quote for 1 Unit of Token -> USDC
        // Decimals: Token decimals vary. We need to send 1 * 10^decimals
        // Actually, let's assume standard useBalance flow or tongoData.
        // For simpler fetching, we can hardcode 1e18 for ETH/STRK and 1e6 for USDC to avoid complex ABI checks here if valid.
        // STRK/ETH are 18 decimals.
        // WBTC is 8 decimals.
        // USDC/USDT are 6 decimals.
        
        let decimals = 18;
        if (tokenSymbol === 'WBTC') decimals = 8;
        
        const amountInWei = BigInt(10 ** decimals); 

        const quotes = await getQuotes({
          sellTokenAddress: tokenConfig.erc20,
          buyTokenAddress: usdcConfig.erc20,
          sellAmount: amountInWei,
        });

        if (quotes && quotes.length > 0) {
            // Price = BuyAmount (USDC, 6 decimals)
            const buyAmountUSDC = Number(quotes[0].buyAmount) / 1e6;
            setPrice(buyAmountUSDC);
        } else {
            console.warn("No quotes found for", tokenSymbol);
        }

      } catch (err: any) {
        console.error('Price fetch failed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 60000); // Poll every minute
    return () => clearInterval(interval);

  }, [tokenSymbol]);

  return { price, loading, error };
};
