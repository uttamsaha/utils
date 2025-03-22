"use server";

import { auth } from "@/auth";

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: object;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

export async function fetchData<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const session = await auth();

  const url = `${(process.env.API_BASE_URL as string).replace(/\/$/, "")}/${endpoint.replace(
    /^\//,
    ""
  )}`;

  
  // Merge default headers with provider-specific headers and custom headers
  const headers: Record<string, string> = {
    // "Content-Type": "application/json",
    Authorization: `Bearer ${session?.user.access_token}`,
    ...options.headers
  };

  // If the body is FormData, don't set Content-Type to application/json
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  try {
    const response = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body instanceof FormData ? options.body : options.body ? JSON.stringify(options.body) : undefined,
      cache: options.cache,
      next: options.next
    });

    if (!response.ok) {
      const errorText = await response.json();
      throw new Error(`${errorText.error}`);
    }

    // For empty responses or responses that aren't JSON
    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return {
        success: false,
        error: "Something went wrong",
        status: 204
      } as T;
    }

    return { ...(await response.json()), status: response.status } as T;
  } catch (error: any) {
    console.error(`Error fetching:`, error);
    return { status: 500, success: false, error: error.toString() } as T;
  }
}
