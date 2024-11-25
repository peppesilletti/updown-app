export interface User {
  id: number;
  username: string;
  score: number;
}

export interface Bet {
  id: number;
  userId: number;
  btcPrice: number;
  direction: "UP" | "DOWN";
  status: "won" | "lost" | "pending";
  createdAt: string;
  lastCheckedAt?: string | null;
}
