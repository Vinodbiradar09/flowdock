import "server-only";
import { headers } from "next/headers";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
};

type ServerFetchOptions = Omit<RequestInit, "headers"> & {
  cache?: RequestCache;
  revalidate?: number;
};

export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${path}`;

  const incomingHeaders = await headers();

  const cookie = incomingHeaders.get("cookie");

  const { revalidate, cache, ...restOptions } = options;

  const nextConfig: { revalidate?: number; cache?: RequestCache } = {};
  if (revalidate !== undefined) nextConfig.revalidate = revalidate;
  if (cache !== undefined) nextConfig.cache = cache;

  const res = await fetch(url, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    next: revalidate !== undefined ? { revalidate } : undefined,
    cache: cache ?? "no-store",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({
      message: "An unexpected error occurred",
    }));
    throw new Error(error.message ?? "Server fetch failed");
  }

  return res.json() as Promise<T>;
}
