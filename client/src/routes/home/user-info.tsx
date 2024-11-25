import { useFetchBtcPrice } from "@/api/hooks/useFetchBtcPrice";
import { useFetchUser } from "@/api/hooks/useFetchUser";
import { Skeleton } from "@/components/ui/skeleton";

export function UserInfo() {
  const { user, loading: userLoading } = useFetchUser();
  const { btcPrice, loading: btcPriceLoading } = useFetchBtcPrice();

  return (
    <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-2 md:grid-cols-3">
      <div>
        <h3 className="text-xs font-semibold text-gray-400 sm:text-sm">
          BTC Price
        </h3>

        <div className="flex items-center justify-center">
          {btcPriceLoading ? (
            <Skeleton className="w-20 h-3 mt-3 bg-gray-200" />
          ) : (
            <p className="text-lg font-bold sm:text-xl">
              ${Number(Math.floor(btcPrice ?? 0)).toLocaleString()}
            </p>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-gray-400 sm:text-sm">
          Username
        </h3>
        <div className="flex items-center justify-center">
          {userLoading ? (
            <Skeleton className="w-20 h-3 mt-3 bg-gray-200" />
          ) : (
            `${user?.username}`
          )}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold text-gray-400 sm:text-sm">
          Score
        </h3>
        <div className="flex items-center justify-center">
          {userLoading ? (
            <Skeleton className="w-20 h-3 mt-3 bg-gray-200" />
          ) : (
            `${user?.score}`
          )}
        </div>
      </div>
    </div>
  );
}
