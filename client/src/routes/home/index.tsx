import { useFetchUserBets } from "@/api/hooks/useFetchUserBets";
import { Bet } from "@/api/types";
import loadingSkeleton from "@/assets/loading-skeleton.gif";
import { Countdown } from "@/components/ui/countdown";
import Loader from "@/components/ui/loader";
import { Layout } from "@/layout";
import dayjs from "dayjs";
import { BetsList } from "./bets-list";
import { BettingForm } from "./betting-form";
import { Leaderboard } from "./leaderboards";
import { UserInfo } from "./user-info";

const Home = () => {
  const { bets, loading: betsLoading } = useFetchUserBets();

  const hasPendingBets = bets.some((bet) => bet.status === "pending");

  if (betsLoading)
    return (
      <div className="flex items-center justify-center min-h-screen gap-16 p-4 bg-gray-900">
        <Loader />
      </div>
    );

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
      <Layout className="w-full max-w-2xl">
        <UserInfo />

        <div className="flex flex-col justify-between gap-8 mb-10 xl:flex-row">
          <div className="flex items-center justify-center w-full p-6">
            {bets.length === 0 ? (
              <BettingForm />
            ) : hasPendingBets ? (
              <WaitingForLastBet
                lastBet={bets.find((bet) => bet.status === "pending")}
              />
            ) : (
              <BettingForm />
            )}
          </div>

          <Leaderboard />
        </div>

        <BetsList bets={bets} />
      </Layout>
    </div>
  );
};

const WaitingForLastBet = ({ lastBet }: { lastBet: Bet | undefined }) => {
  return (
    <div className="flex flex-col items-center">
      <img
        src={loadingSkeleton}
        alt="Waiting for last bet"
        width={300}
        className="-mt-10 md:mt-0"
      />

      <Countdown
        targetDate={dayjs(lastBet?.lastCheckedAt || lastBet?.createdAt)
          .add(
            import.meta.env.VITE_BTC_PRICE_CHECK_INTERVAL_IN_SECONDS,
            "seconds"
          )
          .toDate()}
      />
    </div>
  );
};

export default Home;
