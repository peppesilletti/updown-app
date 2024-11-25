import { useMakeBet } from "@/api/hooks/useMakeBet";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useState } from "react";

export function BettingForm() {
  const { makeBet, error, loading } = useMakeBet();
  const [direction, setDirection] = useState<"UP" | "DOWN" | null>(null);

  const handleBet = () => {
    if (direction) {
      makeBet({ direction });
      setDirection(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Place Your Bet</h3>
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => setDirection("UP")}
          className={`bg-green-600 hover:bg-green-700 ${direction === "UP" ? "ring-2 ring-white" : ""}`}
        >
          UP
        </Button>
        <Button
          onClick={() => setDirection("DOWN")}
          className={`bg-red-600 hover:bg-red-700 ${direction === "DOWN" ? "ring-2 ring-white" : ""}`}
        >
          DOWN
        </Button>
      </div>
      <Button
        onClick={handleBet}
        disabled={!direction}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600"
      >
        {loading ? "Placing Bet..." : "Place Bet"}
      </Button>
      {error && (
        <div className="flex items-center p-2 space-x-2 text-red-400 bg-red-900 bg-opacity-50 rounded">
          <AlertCircle size={16} />
          <span>{error.message}</span>
        </div>
      )}
    </div>
  );
}
