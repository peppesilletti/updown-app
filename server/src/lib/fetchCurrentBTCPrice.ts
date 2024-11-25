import axios from "axios";

const BTC_VITE_API_URL =
  "https://api.coindesk.com/v1/bpi/currentprice/BTC.json";

const fetchCurrentBTCPrice = async (): Promise<number> => {
  const response = await axios.get(BTC_VITE_API_URL);
  const data = response.data as { bpi: { USD: { rate_float: number } } };
  return data.bpi.USD.rate_float;
};

export { fetchCurrentBTCPrice };
