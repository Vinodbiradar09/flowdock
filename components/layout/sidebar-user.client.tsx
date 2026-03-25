"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SignOut, User, CaretUpDown } from "@phosphor-icons/react";
import { signOut } from "@/lib/auth/client/auth-client";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";

type SidebarUserProps = {
  user: {
    name: string;
    email: string;
    image: string | null;
  };
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function SidebarUser({ user }: SidebarUserProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to sign out. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isLoading}
        className="w-full flex items-center gap-3 p-2 hover:bg-muted transition-colors outline-none disabled:opacity-50"
      >
        <Avatar className="w-7 h-7 rounded-none shrink-0">
          <AvatarImage
            src={user.image ?? undefined}
            alt={user.name}
            className="rounded-none"
          />
          <AvatarFallback className="rounded-none bg-foreground text-background text-xs font-mono">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start flex-1 min-w-0">
          <span className="text-xs font-mono font-medium text-foreground truncate w-full text-left">
            {user.name}
          </span>
          <span className="text-xs font-mono text-muted-foreground truncate w-full text-left">
            {user.email}
          </span>
        </div>
        <CaretUpDown size={14} className="text-muted-foreground shrink-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64 rounded-none border-border font-mono"
        side="top"
        align="start"
      >
        <DropdownMenuLabel className="flex items-center gap-3 p-3">
          <Avatar className="w-8 h-8 rounded-none shrink-0">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name}
              className="rounded-none"
            />
            <AvatarFallback className="rounded-none bg-foreground text-background text-xs font-mono">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-mono font-medium text-foreground truncate">
              {user.name}
            </span>
            <span className="text-xs font-mono text-muted-foreground truncate">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          className="rounded-none px-3 py-2.5 gap-3 cursor-pointer font-mono text-xs text-muted-foreground hover:text-foreground focus:text-foreground"
          onSelect={(e) => e.preventDefault()}
          onClick={() => {}}
        >
          <User size={14} />
          <div className="flex flex-col">
            <span className="text-foreground">Account</span>
            <span className="text-muted-foreground">
              Manage your profile settings
            </span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem
          className="rounded-none px-3 py-2.5 gap-3 cursor-pointer font-mono text-xs text-destructive hover:text-destructive focus:text-destructive focus:bg-destructive/10"
          onSelect={(e) => e.preventDefault()}
          onClick={handleSignOut}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="w-3.5 h-3.5 border border-current border-t-transparent animate-spin rounded-full" />
          ) : (
            <SignOut size={14} />
          )}
          <div className="flex flex-col">
            <span>Sign out</span>
            <span className="text-muted-foreground">
              Sign out of your Flowdock account
            </span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
