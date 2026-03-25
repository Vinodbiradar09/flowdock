import { getSession } from "@/lib/auth/client/get-session";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flowdock — Minimal Task Tracking Platform",
  description:
    "Create, manage and track tasks with built-in analytics. Know exactly what is done, what is pending and how fast you are moving.",
};

export default async function RootPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
