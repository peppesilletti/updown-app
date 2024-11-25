import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useSignUp } from "@/api/hooks/useSignUp";
import logo from "@/assets/logo.webp";
import { Layout } from "@/layout";
import { Link, useNavigate } from "react-router";

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
});

const SignUpForm = () => {
  const navigate = useNavigate();

  const {
    signUp,
    loading: createUserLoading,
    error: createUserError,
  } = useSignUp();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const createdUser = await signUp(values.username);

    if (createdUser) {
      navigate("/");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen gap-16 p-2 bg-gray-900 sm:p-4">
      <Layout className="w-full max-w-md">
        <div className="w-full max-w-md mx-auto space-y-6">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="Logo"
              width={128}
              height={128}
              className={`rounded-full ${createUserLoading ? "animate-spin" : ""}`}
            />
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                disabled={createUserLoading}
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter your username..."
                        {...field}
                        className="!placeholder-white text-[18px] sm:text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={createUserLoading}
              >
                {createUserLoading ? "Signing up..." : "Sign Up"}
              </Button>

              <div className="flex justify-center mt-4 text-xs">
                <span className="text-white">Already have an account?</span>
                <Link
                  to="/login"
                  className="ml-2 text-blue-500 hover:underline"
                >
                  Login
                </Link>
              </div>
            </form>
          </Form>
          {createUserError && (
            <Alert
              variant="destructive"
              className="text-purple-600 border-purple-600"
            >
              <AlertDescription>{createUserError.message}</AlertDescription>
            </Alert>
          )}
        </div>
      </Layout>
    </div>
  );
};

export default SignUpForm;
