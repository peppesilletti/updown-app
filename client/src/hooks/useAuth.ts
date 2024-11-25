import { User } from "@/api/types";
import useLocalStorage from "./useLocalStorage";

function useAuth(): [User | null, (user: User | null) => void] {
  const [auth, setAuth] = useLocalStorage<User | null>("auth", null);

  return [auth, setAuth];
}

export default useAuth;
