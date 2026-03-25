import { LoginCard } from "@/components/auth/login-card.client";
import { getSession } from "@/lib/auth/client/get-session";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Flowdock",
  description: "Sign in to your Flowdock account",
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6" />
            <span className="text-sm font-mono font-medium tracking-tight">
              {/*FLOWDOCK*/}
            </span>
          </div>
          <h1 className="text-2xl font-mono font-medium tracking-tight text-foreground">
            Welcome back Flowdock
          </h1>
          <p className="text-sm text-muted-foreground font-mono">
            Sign in to manage your tasks and track progress
          </p>
        </div>
        <LoginCard />
        <p className="text-xs text-muted-foreground font-mono text-center">
          By signing in, you agree to our{" "}
          <span className="underline underline-offset-4 cursor-pointer hover:text-foreground transition-colors">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline underline-offset-4 cursor-pointer hover:text-foreground transition-colors">
            Privacy Policy
          </span>
        </p>
      </div>
    </main>
  );
}
