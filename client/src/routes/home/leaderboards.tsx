import { useFetchTop5 } from "@/api/hooks/useFetchTop5";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Leaderboard() {
  const { users = [], loading: top5Loading } = useFetchTop5();

  if (top5Loading) {
    return (
      <div className="flex flex-col w-full gap-4 p-4 bg-gray-800 border rounded-lg shadow-lg border-cyan-500 shadow-cyan-500/50">
        <Skeleton className="w-full h-10 bg-gray-200" />
        <Skeleton className="w-full h-10 bg-gray-200" />
        <Skeleton className="w-full h-10 bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-800 border rounded-lg shadow-lg border-cyan-500 shadow-cyan-500/50">
      <h3 className="mb-4 text-lg font-bold text-center text-cyan-300">
        Top 5 Players
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-cyan-400">Rank</TableHead>
            <TableHead className="text-cyan-400">Username</TableHead>
            <TableHead className="text-right text-cyan-400">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((entry, index) => (
            <TableRow key={entry.username} className="border-b border-cyan-800">
              <TableCell className="font-medium text-cyan-300">
                {index + 1}
              </TableCell>
              <TableCell className="text-cyan-100">{entry.username}</TableCell>
              <TableCell className="text-right text-cyan-400">
                {entry.score}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
