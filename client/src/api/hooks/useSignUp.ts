import useAuth from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";

import { User } from "../types";

interface CreateUserResponse {
  message: string;
  createdUser?: User;
}

interface CreateUserError {
  message: string;
  error?: string;
}

interface UseSignUpResult {
  signUp: (username: string) => Promise<User | undefined>;
  response: CreateUserResponse | null;
  error: CreateUserError | null;
  loading: boolean;
  isSuccess: boolean;
}

export const useSignUp = (): UseSignUpResult => {
  const [auth, setAuth] = useAuth();

  const mutation = useMutation<CreateUserResponse, CreateUserError, string>({
    mutationFn: async (username: string) => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/users/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        }
      );

      if (!res.ok) {
        const errorData: CreateUserError = await res.json();
        throw errorData;
      }

      const userData: CreateUserResponse = await res.json();

      if (userData.createdUser) {
        setAuth(userData.createdUser);
      }

      return userData;
    },
  });

  return {
    signUp: async (username: string) => {
      const userData = await mutation.mutateAsync(username);
      return userData?.createdUser;
    },
    response: mutation.data || null,
    error: mutation.error || null,
    loading: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
};
