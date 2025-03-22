"use server"
export async function fetchApi(
    url,
    method = "GET",
    data = null,
    options = {},
    token = null
  ) {
    try {
      const baseUrl = `https://api.nexzan.com/api/v2/cloud`
  
      if (!baseUrl) {
        throw new Error("API base URL is not defined in .env.local");
      }
  
      const fullUrl = `${baseUrl}${url}`;
  
      const defaultHeaders = {
        "Content-Type": "application/json",
        ...options.headers,
      };
  
      if (token) {
        defaultHeaders.Authorization = `Bearer ${token}`;
      }
  
      // Configure the request options
      const fetchOptions = {
        method,
        headers: defaultHeaders,
        cache: "no-store", 
        next: { revalidate: 60 },
        ...options,
      };
  
      // If method is POST, PUT, or PATCH, include the body
      if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
        fetchOptions.body = JSON.stringify(data);
      }
  
      const response = await fetch(fullUrl, fetchOptions);
  
      // Check if the response is successful
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData?.message || `Request failed with status ${response.status}`
        );
      }
  
      // Try to parse the response JSON
      const responseData = await response.json();
      return { data: responseData, error: null };
    } catch (error) {
      console.error("Error in fetchApi:", error);
      return {
        data: null,
        error: error.message || "An unexpected error occurred",
      };
    }
  }


//call
  useEffect(() => {

    const token = getCookie('auth_token');

    async function fetchData() {
      const { data } = await fetchApi(`/get-database-with-user/${serverId}`, "GET", null, {}, token);
      console.log('test')
      if (data) {
        setData(data)
      }


    }
    fetchData();
  }, [])
