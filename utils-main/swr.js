import useSWR from "swr";

const fetcher = async (url, method = "GET", body = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export default function useCustomSWR(endpoint, method = "GET", body = null) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseUrl}${endpoint}`;

  const { data, error, isLoading, mutate } = useSWR(
    [url, method, body],
    ([url, method, body]) => fetcher(url, method, body)
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
