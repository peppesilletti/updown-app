/* eslint-disable react-refresh/only-export-components */
import useAuth from "@/hooks/useAuth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import Home from "./routes/home/index";
import LoginForm from "./routes/login";
import SignUpForm from "./routes/signup";

import "./index.css";
import NotFound from "./routes/404";

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  const [auth] = useAuth();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

const AuthenticatedRoute = ({ element }: { element: React.ReactNode }) => {
  const [auth] = useAuth();

  if (auth) {
    return <Navigate to="/home" replace />;
  }

  return element;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<ProtectedRoute element={<Home />} />} />
          <Route
            path="/signup"
            element={<AuthenticatedRoute element={<SignUpForm />} />}
          />
          <Route
            path="/login"
            element={<AuthenticatedRoute element={<LoginForm />} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
