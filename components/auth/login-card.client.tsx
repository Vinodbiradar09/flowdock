"use client";

import { signIn } from "@/lib/auth/client/auth-client";
import { GoogleLogo } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export function LoginCard() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch {
      toast.error("Failed to sign in. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 border border-border p-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground"></p>
        <p className="text-sm font-mono text-foreground">
          Continue with your Google account
        </p>
      </div>

      <div className="w-full h-px bg-border" />

      <Button
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full rounded-none flex items-center gap-3 h-11 font-mono text-sm"
        variant="outline"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border border-current border-t-transparent animate-spin rounded-full" />
            Connecting...
          </>
        ) : (
          <>
            <GoogleLogo size={16} weight="bold" />
            Continue with Google
          </>
        )}
      </Button>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-500" />
          <p className="text-xs font-mono text-muted-foreground">
            Secured by Better Auth
          </p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-xs font-mono text-muted-foreground"></p>
        </div>
      </div>
    </div>
  );
}
