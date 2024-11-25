import { Button } from "@/components/ui/button";
import { Layout } from "@/layout";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900">
      <Layout className="w-full max-w-2xl text-center">
        <div className="space-y-6 ">
          <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl text-cyan-400">
            404
          </h1>
          <h2 className="text-xl font-semibold sm:text-3xl text-cyan-300">
            System Malfunction
          </h2>
          <p className="text-xs sm:text-lg text-cyan-100">
            The page you're searching for has been destroyed or never existed in
            this reality.
          </p>
          <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button
              asChild
              className="text-white bg-cyan-600 hover:bg-cyan-700"
            >
              <Link to="/">Return to Base</Link>
            </Button>
          </div>
          <div className="mt-8">
            <div className="inline-block animate-pulse">
              <div className="w-12 h-1 mb-1 sm:w-16 bg-cyan-400"></div>
              <div className="w-12 h-1 mb-1 sm:w-16 bg-cyan-400"></div>
              <div className="w-12 h-1 sm:w-16 bg-cyan-400"></div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
