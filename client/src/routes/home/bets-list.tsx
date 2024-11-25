import { Bet } from "@/api/types";
import dayjs from "dayjs";

interface BetsListProps {
  bets: Bet[];
}

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export function BetsList({ bets }: BetsListProps) {
  return (
    <div className="!mt-10 space-y-4">
      <h3 className="text-lg font-semibold">Your Bets</h3>
      <div className="space-y-2">
        {bets
          .sort((a, b) => b.id - a.id)
          .map((bet) => (
            <div
              key={bet.id}
              className="flex flex-col items-start justify-between p-2 bg-gray-800 rounded sm:flex-row sm:items-center"
            >
              <div className="flex flex-col items-start sm:flex-row sm:items-center">
                <span className="text-xs text-gray-400">
                  {dayjs(bet.createdAt)
                    .tz(localTimezone)
                    .format("DD/MM/YYYY HH:mm")}
                </span>
                <span
                  className={`ml-0 sm:ml-2 ${bet.direction === "UP" ? "text-green-400" : "text-red-400"}`}
                >
                  {bet.direction}
                </span>

                <span className="ml-0 text-cyan-40 sm:ml-2">
                  $
                  {bet.btcPrice !== undefined
                    ? bet.btcPrice.toFixed(2)
                    : "0.00"}{" "}
                  BTC
                </span>
              </div>

              <div className="mt-2 sm:mt-0">
                {bet.status === "pending" && (
                  <span className="text-yellow-400">Pending</span>
                )}
                {bet.status === "won" && (
                  <span className="text-green-400">Won</span>
                )}
                {bet.status === "lost" && (
                  <span className="text-red-400">Lost</span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
