import { useQuery } from "@tanstack/react-query";

interface FetchBtcPriceResponse {
  rate_float: number;
}

interface FetchBtcPriceError {
  message: string;
  error?: string;
}

export const useFetchBtcPrice = () => {
  const { data, error, isLoading, isError } = useQuery<
    FetchBtcPriceResponse,
    FetchBtcPriceError
  >({
    queryKey: ["btcPrice"],
    queryFn: async () => {
      const res = await fetch(
        "https://api.coindesk.com/v1/bpi/currentprice/BTC.json"
      );

      if (!res.ok) {
        const errorData: FetchBtcPriceError = await res.json();
        throw errorData;
      }

      const data = await res.json();
      return { rate_float: data.bpi.USD.rate_float };
    },
    refetchInterval: 3000,
  });

  return {
    btcPrice: data?.rate_float || null,
    error: isError ? error : null,
    loading: isLoading,
  };
};
